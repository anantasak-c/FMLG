import assert from "node:assert/strict";
import test from "node:test";
import { createDeterministicPromptEngine, createOpenRouterPromptEngine } from "../src/coach/openrouter-prompt-engine.js";

test("OpenRouter Prompt Engine keeps the API key in the authorization header only", async () => {
  let request;
  const engine = createOpenRouterPromptEngine({ apiKey: "test-secret", model: "openai/gpt-4o-mini", fetcher: async (_url, init) => { request = init; return { ok: true, json: async () => ({ choices: [{ message: { content: "คำถามภาษาไทย" } }] }) }; } });
  assert.equal(await engine.complete({ system: "Thai coach", user: "idea" }), "คำถามภาษาไทย");
  assert.equal(request.headers.Authorization, "Bearer test-secret");
  assert.equal(request.body.includes("test-secret"), false);
  assert.equal(Object.hasOwn(JSON.parse(request.body), "response_format"), false);
});

test("OpenRouter Prompt Engine streams free-form text and preserves chat roles", async () => {
  let request;
  const engine = createOpenRouterPromptEngine({
    apiKey: "test-secret",
    model: "stealth/ox-alpha",
    fallbackModel: "openrouter/free",
    fetcher: async (_url, init) => {
      request = init;
      return sseResponse(["สวัสดี", "ครับ"]);
    },
  });
  const stream = await engine.stream({ system: "Thai chat", messages: [{ role: "user", content: "hello" }] });
  assert.equal(await new Response(stream).text(), "สวัสดีครับ");
  const body = JSON.parse(request.body);
  assert.equal(body.stream, true);
  assert.equal(Object.hasOwn(body, "response_format"), false);
  assert.deepEqual(body.messages.map(({ role }) => role), ["system", "user"]);
  assert.equal(request.body.includes("test-secret"), false);
});

test("streaming falls back before the first token when Ox Alpha is unavailable", async () => {
  const models = [];
  const engine = createOpenRouterPromptEngine({
    apiKey: "test-secret",
    model: "stealth/ox-alpha",
    fallbackModel: "openrouter/free",
    fetcher: async (_url, init) => {
      const selectedModel = JSON.parse(init.body).model;
      models.push(selectedModel);
      return selectedModel === "stealth/ox-alpha" ? { ok: false, status: 429, body: null } : sseResponse(["fallback"]);
    },
  });
  const stream = await engine.stream({ system: "chat", messages: [{ role: "user", content: "hello" }] });
  assert.equal(await new Response(stream).text(), "fallback");
  assert.deepEqual(models, ["stealth/ox-alpha", "openrouter/free"]);
});

function sseResponse(parts) {
  const encoder = new TextEncoder();
  return {
    ok: true,
    status: 200,
    body: new ReadableStream({
      start(controller) {
        for (const part of parts) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: part } }] })}\n\n`));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    }),
  };
}

test("deterministic Prompt Engine is available for tests without network", async () => {
  assert.equal(await createDeterministicPromptEngine("คำถามทดสอบ").complete({}), "คำถามทดสอบ");
});

test("OpenRouter Prompt Engine falls back to the free router only after a 429", async () => {
  const models = [];
  const engine = createOpenRouterPromptEngine({
    apiKey: "test-secret",
    model: "stealth/ox-alpha",
    fallbackModel: "openrouter/free",
    hedgeDelayMs: 0,
    fetcher: async (_url, init) => {
      models.push(JSON.parse(init.body).model);
      if (models.length === 1) return { ok: false, status: 429 };
      return { ok: true, status: 200, json: async () => ({ choices: [{ message: { content: "คำถามสำรอง" } }] }) };
    },
  });
  assert.equal(await engine.complete({ system: "coach", user: "idea" }), "คำถามสำรอง");
  assert.deepEqual(models, ["stealth/ox-alpha", "openrouter/free"]);
});

test("OpenRouter Prompt Engine retries an empty primary response with the free router", async () => {
  const models = [];
  const engine = createOpenRouterPromptEngine({
    apiKey: "test-secret",
    model: "stealth/ox-alpha",
    fallbackModel: "openrouter/free",
    hedgeDelayMs: 0,
    fetcher: async (_url, init) => {
      models.push(JSON.parse(init.body).model);
      return { ok: true, status: 200, json: async () => ({ choices: [{ message: { content: models.length === 1 ? "" : "{\"type\":\"question\"}" } }] }) };
    },
  });
  assert.equal(await engine.complete({ system: "coach", user: "idea" }), "{\"type\":\"question\"}");
  assert.deepEqual(models, ["stealth/ox-alpha", "openrouter/free"]);
});
