import { Server } from "bun";
import { registerHealth } from "./routes/health";
import { registerJudge } from "./routes/judge";
import { PORT } from "./config";

interface Route {
  path: string;
  handler: (req: Request) => Promise<Response> | Response;
}

export type RouteHandler = (req: Request) => Promise<Response> | Response;

const routes: Route[] = [];

function matchRoute(routePath: string, requestPath: string): boolean {
  const routeParts = routePath.split("/");
  const requestParts = requestPath.split("/");

  if (routeParts.length !== requestParts.length) {
    return false;
  }

  return routeParts.every((routePart, i) => {
    return routePart.startsWith(":") || routePart === requestParts[i];
  });
}

export function registerRoute(path: string, handler: RouteHandler) {
  routes.push({ path, handler });
}

const server = Bun.serve({
  port: process.env.PORT || 3000,
  fetch(req) {
    const url = new URL(req.url);
    const route = routes.find((r) => url.pathname === r.path);

    if (route) {
      return route.handler(req);
    }
    return new Response("Not Found", { status: 404 });
  },
});

registerHealth();
registerJudge();

console.log(`Server running at http://localhost:${server.port}`);
