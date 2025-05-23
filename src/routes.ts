import {index, layout, route, type RouteConfig} from "@react-router/dev/routes";

export default [
    index("./routes/index.tsx"),
    layout("./layouts/img_cache.tsx", [
        layout("./layouts/message_layout.tsx", [
            layout("./layouts/auth_status.tsx", [
                layout("./layouts/challenge_events.tsx", [
                    layout("./layouts/game_page_adapt.tsx", [
                        route("/local-play/backgammon", "./routes/play/local/backgammon.tsx"),
                        route("/local-play/narde", "./routes/play/local/narde.tsx"),
                        route("/play/:roomId", "./routes/play/remote/play.tsx")
                    ]),
                    layout("./layouts/menu_sidebar_adapt.tsx", [
                        route("/play", "./routes/play_menu.tsx"),
                        layout("./layouts/auth.tsx", [
                            route("/sign-in", "./routes/auth/sign_in.tsx"),
                            route("/sign-up", "./routes/auth/sign_up.tsx")
                        ]),
                        route("/profile/:userId?", "./routes/profile.tsx"),
                        route("/edit-profile", "./routes/edit_profile.tsx"),

                        route("/history/:matchId", "./routes/history.tsx"),
                        route("/friends", "./routes/friends.tsx"),
                        route("/challenge/:userId", "./routes/challenge.tsx")
                    ])
                ])
            ])
        ]),
    ]),

] satisfies RouteConfig;