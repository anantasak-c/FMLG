export class PromptEngineError extends Error {
  constructor(message = "Prompt Engine is unavailable") { super(message); this.name = "PromptEngineError"; }
}

/** Server-side OpenRouter Chat Completions port. Never import from a Client Component. */
export function createOpenRouterPromptEngine({ apiKey, model, fallbackModel = "openrouter/free", appUrl, fetcher = fetch, timeoutMs = 25_000, hedgeDelayMs = 6_000 }) {
  if (!apiKey || !model) throw new PromptEngineError("OpenRouter configuration is missing");
  let activeModel = model;
  return {
    async complete({ system, user }) {
      const request = async (selectedModel, signal) => {
        try {
          const response = await fetcher("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              ...(appUrl ? { "HTTP-Referer": appUrl } : {}),
              "X-OpenRouter-Title": "FOMOlogy AI Coach",
            },
            signal: AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)]),
            body: JSON.stringify({
              model: selectedModel,
              temperature: 0.2,
              max_tokens: 4000,
              ...(selectedModel === model && model !== "openrouter/free" ? { reasoning: { effort: "low", exclude: true } } : {}),
              messages: [{ role: "system", content: system }, { role: "user", content: user }],
            }),
          });
          if (!response.ok) return { response, content: null };
          const payload = await response.json();
          const content = payload?.choices?.[0]?.message?.content;
          return { response, content: typeof content === "string" && content.trim() ? content : null };
        } catch {
          return { response: null, content: null };
        }
      };

      const primaryController = new AbortController();
      const primaryPromise = request(activeModel, primaryController.signal);
      if (!fallbackModel || activeModel === fallbackModel) {
        const attempt = await primaryPromise;
        return readAttempt(attempt);
      }

      const fallbackController = new AbortController();
      const fallbackPromise = waitForHedge(hedgeDelayMs, fallbackController.signal)
        .then(() => request(fallbackModel, fallbackController.signal));
      try {
        const winner = await Promise.any([
          primaryPromise.then((attempt) => requireUsableAttempt(attempt, activeModel)),
          fallbackPromise.then((attempt) => requireUsableAttempt(attempt, fallbackModel)),
        ]);
        if (winner.model === fallbackModel) activeModel = fallbackModel;
        return winner.content;
      } catch {
        const [primary, fallback] = await Promise.all([primaryPromise, fallbackPromise]);
        return readAttempt(fallback.response ? fallback : primary);
      } finally {
        primaryController.abort();
        fallbackController.abort();
      }
    },
    async stream({ system, messages, signal }) {
      const models = [...new Set([model, fallbackModel].filter(Boolean))];
      let lastError = new PromptEngineError();

      for (const selectedModel of models) {
        const controller = new AbortController();
        const timeoutController = new AbortController();
        const timeout = setTimeout(() => timeoutController.abort(), timeoutMs);
        const combinedSignal = signal
          ? AbortSignal.any([signal, controller.signal, timeoutController.signal])
          : AbortSignal.any([controller.signal, timeoutController.signal]);
        try {
          const response = await fetcher("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              ...(appUrl ? { "HTTP-Referer": appUrl } : {}),
              "X-OpenRouter-Title": "FOMOlogy Skill Chat",
            },
            signal: combinedSignal,
            body: JSON.stringify({
              model: selectedModel,
              stream: true,
              temperature: 0.7,
              max_tokens: 4000,
              ...(selectedModel === model && model !== "openrouter/free" ? { reasoning: { effort: "low", exclude: true } } : {}),
              messages: [{ role: "system", content: system }, ...messages],
            }),
          });
          if (!response.ok || !response.body) {
            lastError = new PromptEngineError(`Prompt Engine request failed with status ${response.status}`);
            controller.abort();
            continue;
          }

          const iterator = parseOpenRouterStream(response.body)[Symbol.asyncIterator]();
          const first = await iterator.next();
          if (first.done || !first.value) {
            lastError = new PromptEngineError("Prompt Engine returned no content");
            controller.abort();
            continue;
          }
          clearTimeout(timeout);
          return iterableToReadableStream(iterator, first.value, controller);
        } catch (error) {
          controller.abort();
          if (signal?.aborted) throw error;
          lastError = error instanceof PromptEngineError ? error : new PromptEngineError("Prompt Engine request timed out or failed");
        } finally {
          clearTimeout(timeout);
        }
      }
      throw lastError;
    },
  };
}

async function* parseOpenRouterStream(body) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      const lines = buffer.split(/\r?\n/);
      buffer = done ? "" : lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (!data || data === "[DONE]") continue;
        try {
          const content = JSON.parse(data)?.choices?.[0]?.delta?.content;
          if (typeof content === "string" && content) yield content;
        } catch {
          // Ignore provider keep-alives and malformed non-content events.
        }
      }
      if (done) break;
    }
  } finally {
    reader.releaseLock();
  }
}

function iterableToReadableStream(iterator, firstValue, controller) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(streamController) {
      streamController.enqueue(encoder.encode(firstValue));
      try {
        while (true) {
          const next = await iterator.next();
          if (next.done) break;
          if (next.value) streamController.enqueue(encoder.encode(next.value));
        }
        streamController.close();
      } catch (error) {
        streamController.error(error);
      } finally {
        controller.abort();
      }
    },
    cancel() { controller.abort(); },
  });
}

function requireUsableAttempt(attempt, model) {
  if (!attempt.response?.ok || !attempt.content) throw new PromptEngineError();
  return { content: attempt.content, model };
}

function readAttempt(attempt) {
  if (!attempt.response) throw new PromptEngineError("Prompt Engine request timed out or failed");
  if (!attempt.response.ok) throw new PromptEngineError(`Prompt Engine request failed with status ${attempt.response.status}`);
  if (!attempt.content) throw new PromptEngineError("Prompt Engine returned no content");
  return attempt.content;
}

function waitForHedge(delayMs, signal) {
  return new Promise((resolve) => {
    if (signal.aborted) { resolve(); return; }
    const timer = setTimeout(resolve, delayMs);
    signal.addEventListener("abort", () => { clearTimeout(timer); resolve(); }, { once: true });
  });
}

export function createDeterministicPromptEngine(reply = "ช่วยบอกเป้าหมายของวิดีโออีกนิด") {
  return { async complete() { return reply; } };
}
