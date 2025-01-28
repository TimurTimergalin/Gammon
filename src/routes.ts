import {route, type RouteConfig,} from "@react-router/dev/routes";

export default [
    route("*?", "./catchall.tsx"),
] satisfies RouteConfig;