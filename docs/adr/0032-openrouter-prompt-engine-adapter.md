# OpenRouter adapter for the customer-pilot Prompt Engine

For the customer pilot, the Prompt Engine will use a server-only OpenRouter Chat Completions adapter through its existing provider port instead of calling OpenAI Responses directly. This is a deliberate temporary routing choice requested for available pilot credentials; compiled prompts remain server-only, the model slug is explicitly configured, and production can return to a direct provider without changing the Creative Brief domain.
