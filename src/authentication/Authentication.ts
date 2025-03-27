require("dotenv").config();

import { Application, Request, Response } from "express";
import passport from "passport";

// Extend the Express.User interface to include displayName 
// This is temporary until the type definitions are updated
declare global {
    namespace Express {
        interface User {
            displayName?: string;
        }
    }
}

export class Authentication {
    private route: string;

    constructor(route: string) {
        this.route = route;
    }

    routes(app: Application) {
        // To show the login options, this is temporary
        app.route(this.route).get((req: Request, res: Response) => {
            res.send(
                `<a href='/auth/google'>Login with Google</a>
                <a href='/auth/facebook'>Login with Facebook</a>
                <a href='/auth/github'>Login with Github</a>
                <form action="/auth/login" method="POST">
                    <input type="text" name="username" placeholder="Usuario" required/>
                    <input type="password" name="password" placeholder="Contraseña" required/>
                    <button type="submit">Iniciar sesión</button>
                </form>
                `
            );
        });

        // Authentication routes
        this.configureAuthRoute(app, 'google', ['profile', 'email']);
        this.configureAuthRoute(app, 'facebook', ['email', 'public_profile']);
        this.configureAuthRoute(app, 'github', ['user:email']);

        // Callback routes
        this.configureCallbackRoute(app, 'google');
        this.configureCallbackRoute(app, 'facebook');
        this.configureCallbackRoute(app, 'github');

        // Route to handle the local login
        app.route(`${this.route}/login`).post(passport.authenticate("local", {
            successRedirect: "/auth/user",
            failureRedirect: "/auth",
        }));

        // Route to show the user information, this is temporary
        app.route(`${this.route}/user`).get((req: Request, res: Response) => {
            if (req.user) {
                const user = req.user as Express.User;
                res.send(`Welcome user: ${user.displayName || 'Unknown'}`);
            } else {
                res.status(401).send("User not authenticated");
            }
        });

        // Logout route
        app.route(`${this.route}/logout`).get((req: Request, res: Response) => {
            req.logout((err) => {
                if (err) {
                    return res.status(500).send("Failed to log out");
                }
                res.redirect(this.route);
            });
        });
    }

    // Method to configure the authentication route for each provider
    private configureAuthRoute(app: Application, provider: string, scope: string[]) {
        app.route(`${this.route}/${provider}`).get(
            passport.authenticate(provider, { scope })
        );
    }

    // Method to configure the callback route for each provider, will be changed in the future
    private configureCallbackRoute(app: Application, provider: string) {
        app.route(`${this.route}/${provider}/callback`).get(
            passport.authenticate(provider, { failureRedirect: "/" }),
            (req: Request, res: Response) => {
                res.redirect("/auth/user");
            }
        );
    }
}
