import { serve } from "@hono/node-server";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const client = new Client({
  name: "example-mcp-client",
  version: "1.0.0",
});

const transport = new StreamableHTTPClientTransport(
  new URL("https://example-mcp.haataa0100.workers.dev/mcp")
);

app.get("/chat", async (c) => {
  await client.connect(transport);

  const tools = await client.listTools();

  return c.json({ tools });
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
