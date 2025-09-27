import { Server } from "bun";

interface Route {
  path: string;
  handler: (req: Request) => Promise<Response> | Response;
}

export type RouteHandler = (req: Request) => Promise<Response> | Response;

const routes: Route[] = [];

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

console.log(`Server running at http://localhost:${server.port}`);
