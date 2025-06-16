require("dotenv").config();

import { Application, Request, Response } from "express";
import passport from "passport";
import { UserController } from "../controllers/UserController";
import User from "../models/User";
import { log } from "console";

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
                        return res.status(200).json({
                            message: "Session verified",
                            user: user
                        });

                    });
                }
            )(req, res, next);
        });

        // Recover data of the user
        app.route(`${this.route}/userinfo`).get(async (req: Request, res: Response) => {
            if (req.user) {

                const response = {
                    status: (code: number) => ({
                        json: (data: any) => console.log(`Status: ${code}, Response:`, data)
                    })
                } as unknown as Response;

                if ((req.user as any).provider === "facebook") {

                    const request = {
                        body: {
                            email: (((req.user as any)._json.name).split(" ")[0] + ((req.user as any)._json.name).split(" ")[1] + "@noprovideemail.com").toLocaleLowerCase(),
                            authProvider: (req.user as any).provider,
                            providerId: (req.user as any).id,
                            firstName: ((req.user as any)._json.name).split(" ")[0] || "",
                            lastName: ((req.user as any)._json.name).split(" ")[1] || ""

                        }
                    } as Request;

                    const user: User = await this.userController.findByEmail(request.body.email);

                    if (user.id === 0) {

                        this.userController.create(request, response);
                    }

                    res.send("Login succesfuly with facebook")

                } else if ((req.user as any).provider === "google") {

                    const request = {
                        body: {
                            email: (req.user as any)._json.email,
                            authProvider: (req.user as any).provider,
                            providerId: (req.user as any).id,
                            firstName: ((req.user as any)._json.name).split(" ")[0] || "",
                            lastName: ((req.user as any)._json.name).split(" ")[1] || ""
                        }
                    } as Request;

                    const user: User = await this.userController.findByEmail(request.body.email);

                    if (user.id === 0) {
                        this.userController.create(request, response);
                    }

                    res.send("Login succesfuly with google")

                } else if ((req.user as any).provider === "github") {
                    const request = {
                        body: {
                            email: ((req.user as any).username + "@noprovideemail.com").toLocaleLowerCase(),
                            username: (req.user as any).username,
                            authProvider: (req.user as any).provider,
                            providerId: (req.user as any).id,
                            firstName: ((req.user as any)._json.name).split(" ")[0] || "",
                            lastName: ((req.user as any)._json.name).split(" ")[1] || ""
                        }
                    } as Request;

                    const user: User = await this.userController.findByEmail(request.body.email);

                    if (user.id === 0) {
                        this.userController.create(request, response);
                    }
                    res.send("Login succesfuly with github")

                } else {
                    res.send(req.user)
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
    /*private configureCallbackRoute(app: Application, provider: string) {
        app.route(`${this.route}/${provider}/callback`).get(
            passport.authenticate(provider, { failureRedirect: "/" }),
            (req: Request, res: Response) => {
                res.redirect("/auth/userinfo");
            }
        );
    }*/

    private configureCallbackRoute(app: Application, provider: string) {
        app.route(`${this.route}/${provider}/callback`).get(
            passport.authenticate(provider, { failureRedirect: "/" }),
            (req: Request, res: Response) => {
                //log("User authenticated:", req.user);
                const user = req.user as {
                    _json: {
                        name: string;
                        email: string;
                        picture?: string;
                        email_verified: boolean;
                    };
                };
                //id, email, username, avatar_url, isActive
                log(`arshopping://auth?email=${user._json.email}&username=${user._json.name}&avatar_url=${user._json.picture}&isActive=${user._json.email_verified ? 1 : 0}`);
                res.redirect(`arshopping://auth?email=${user._json.email}&username=${user._json.name}&avatar_url=${user._json.picture}&isActive=${user._json.email_verified ? 1 : 0}`);
            }
        );
    }
}
/**
 * http://10.0.2.2:3000/auth/google/callback?code=4%2F0AUJR-x7AAPBWeo7j8yEY1oeyLBNjDid8Gb8FoL8_TPF8302m1okG200fxI0QUcYs2iS2Hg&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&authuser=0&hd=est.una.ac.cr&prompt=none
 */