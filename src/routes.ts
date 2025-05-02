import {index, layout, route, type RouteConfig} from "@react-router/dev/routes";

export default [
    layout("./layouts/auth_status.tsx", [
        layout("./layouts/adapt.tsx", [
            layout("./layouts/side_bar.tsx", [
                index("./routes/index.tsx"),
                route("/play", "./routes/play_menu.tsx"),
                route("/local-play/backgammon", "./routes/play/local/backgammon.tsx"),
                route("/local-play/narde", "./routes/play/local/narde.tsx"),
                route("/play/:roomId", "./routes/play/remote/play.tsx"),
                route("*?", "./catchall.tsx"),
                // layout("./layouts/auth.tsx", [
                //     route("/sign-in", "./routes/auth/sign_in.tsx"),
                //     route("/sign-up", "./routes/auth/sign_up.tsx")
                // ])
            ])
        ]),
        layout("./layouts/game_page_adapt.tsx", [
            route("/local-play/new/backgammon", "./routes/play/local/new_backgammon.tsx"),
            route("/local-play/new/narde", "./routes/play/local/new_narde.tsx"),
            route("/play/new/:roomId", "./routes/play/remote/play_new.tsx")
        ]),
        layout("./layouts/menu_sidebar_adapt.tsx", [
            route("/play/new", "./routes/new_play_menu.tsx"),
            layout("./layouts/auth.tsx", [
                    route("/sign-in", "./routes/auth/sign_in.tsx"),
                    route("/sign-up", "./routes/auth/sign_up.tsx")
                ])
        ])
    ]),
] satisfies RouteConfig;