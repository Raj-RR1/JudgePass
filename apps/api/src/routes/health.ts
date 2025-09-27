import { registerRoute, RouteHandler } from "../server";

export function registerHealth(): void {
  const healthHandler: RouteHandler = () => {
    return new Response(JSON.stringify({ ok: true, ts: Date.now() }), {
      headers: { "Content-type": "application/json" },
    });
  };

  registerRoute("/health", healthHandler);
}
