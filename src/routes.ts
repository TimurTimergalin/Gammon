import {layout, route, index, type RouteConfig} from "@react-router/dev/routes";

export default [
    layout("./layouts/adapt.tsx", [
        layout("./layouts/side_bar.tsx", [
            index("./routes/index.tsx"),
            route("/play", "./routes/play_menu.tsx"),
            route("/local-play/backgammon", "./routes/local_play/backgammon.tsx"),
            route("/play/:roomId", "./routes/play.tsx"),
            route("*?", "./catchall.tsx"),
            layout("./layouts/auth.tsx", [
                route("/sign-in", "./routes/auth/sign_in.tsx"),
                route("/sign-up", "./routes/auth/sign_up.tsx")
            ])
        ])
    ]),
] satisfies RouteConfig;