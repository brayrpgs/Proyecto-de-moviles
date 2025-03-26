require("dotenv").config();

import { Application, Request, Response } from "express";
import passport from "passport";

export class Authentication {

    private route: string;

    constructor(route: string) {
        this.route = route;
    }

    routes(app: Application) {

        app.route(this.route).get((req: Request, res: Response) => {
            res.send("<a href='/auth/google'>Login with Google</a>");
        });
        
        app.route(`${this.route}/google`).get(passport.authenticate('google', { scope: ["profile", "email"] }));

        app.route(`${this.route}/google/callback`).get(passport.authenticate('google', { failureRedirect: "/" }), (req: Request, res: Response) => {
            res.redirect("/auth/user");
        });
        
        app.route(`${this.route}/user`).get((req: Request, res: Response) => {
            if (req.user) {
                console.log(req.user);
                interface CustomUser extends Express.User {
                    displayName?: string;
                }
                const user = req.user as CustomUser;
                const name = user.displayName;
                res.send(`Welcome user: ${name}`);
            } else {
                res.status(401).send("User not authenticated");
            }
        });

        app.route(`${this.route}/logout`).get((req: Request, res: Response) => {
            req.logOut((err) => {
                if (err) {
                    return res.status(500).send("Failed to log out");
                }
                res.redirect(this.route);
            });

        })
    }

}




