require("dotenv").config();

import { Application, Request, Response } from "express";
import passport from "passport";
import { UserController } from "../controllers/UserController";

export class Authentication {
    private route: string;
    private userController = new UserController();

    constructor(route: string) {
        this.route = route;
        this.userController = new UserController();
    }

    routes(app: Application) {
        
        // Authentication routes
        this.configureAuthRoute(app, 'google', ['profile', 'email']);
        this.configureAuthRoute(app, 'facebook', ['email', 'public_profile']);
        this.configureAuthRoute(app, 'github', ['user:email']);

        // Callback routes
        this.configureCallbackRoute(app, 'google');
        this.configureCallbackRoute(app, 'facebook');
        this.configureCallbackRoute(app, 'github');

        // Route to handle the local login
        app.route(`${this.route}/login`).post((req: Request, res: Response, next) => {
            passport.authenticate(
                "local", 
                (err: any, user: Express.User | false, info: { message?: string } | undefined) => {
                    if (err) {
                        return res.status(500).send("Error in the authentication");
                    }
                    if (!user) {
                        return res.status(400).send(info?.message || "Incorrect credentials");
                    }
        
                    // Create session login
                    req.logIn(user, (err: any) => {
                        if (err) {
                            return res.status(500).send("Error in login");
                        }
                        return res.status(200).send("Session verified");
                    });
                }
            )(req, res, next);
        });

        // Recover data of the user
        app.route(`${this.route}/userinfo`).get((req: Request, res: Response) => {
            if (req.user) {
                if((req.user as any).provider === "facebook"){
                    res.send("Hola facebook")
                    
                } else if ((req.user as any).provider === "google"){
                    res.send("Hola google")

                } else if ((req.user as any).provider === "github"){
                    res.send("Hola github")

                } else {
                    res.send("Hola local")
                }
                
            } else {
                res.status(401).send("User not authenticated");
            }
        });

        // Logout route
        app.route(`${this.route}/logout`).get((req: Request, res: Response, next) => {
            if (!req.isAuthenticated()) {
                res.status(400).send("No active session to log out");
                return;
            }
        
            req.logout((err) => {
                if (err) {
                    res.status(500).send("Failed to log out");
                    return;
                }
        
                req.session.destroy((err) => {
                    if (err) {
                        res.status(500).send("Failed to destroy session");
                        return;
                    }
                    res.status(200).send("Logged out successfully");
                });
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
                res.redirect("/auth/userinfo");
            }
        );
    }
}
