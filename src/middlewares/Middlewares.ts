import { Application } from "express";
import morgan from "morgan";
import express from 'express';
import passport, { Profile } from "passport";
import session from "express-session";
import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { UserController } from "../controllers/UserController";
import User from "../models/User";

export class Middlewares {

    private app: Application;
    private userController = new UserController();

    // Define the URLs for the callback routes
    private static readonly CALLBACK_URLS = {
        google: "http://localhost:3000/auth/google/callback",
        facebook: "http://localhost:3000/auth/facebook/callback",
        github: "http://localhost:3000/auth/github/callback"
    };

    constructor(app: Application) {
        this.app = app;

        this.userController = new UserController();

        // Morgan is used for logging HTTP requests
        this.app.use(morgan("common"));
        // Handle the session
        this.app.use(
            session({
                secret: process.env.SESSION_SECRET || "default_secret",
                resave: false,
                saveUninitialized: true,
            })
        );

        // Initialize passport and session
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        // Setting up the social login strategies
        this.configureSocialLoginStrategies();
        // Setting up the local strategy
        this.configureLocalStrategy();
    }

    // Method to configure the social login strategies
    private configureSocialLoginStrategies(): void {
        const strategies = [
            {
                strategy: GoogleStrategy,
                options: {
                    clientID: process.env.GOOGLE_CLIENT_ID as string,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
                    callbackURL: Middlewares.CALLBACK_URLS.google,
                },
            },
            {
                strategy: FacebookStrategy,
                options: {
                    clientID: process.env.FACEBOOK_CLIENT_ID as string,
                    clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
                    callbackURL: Middlewares.CALLBACK_URLS.facebook,
                },
            },
            {
                strategy: GitHubStrategy,
                options: {
                    clientID: process.env.GITHUB_CLIENT_ID as string,
                    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
                    callbackURL: Middlewares.CALLBACK_URLS.github,
                },
            },
        ];

        // Define the callback function for the strategies
        const verifyCallback = (accessToken: string, refreshToken: string, profile: Profile, done: (err: any, user?: any) => void): void => {
            return done(null, profile);
        };

        // Register the strategies
        strategies.forEach(({ strategy, options }) => {

            passport.use(new (strategy as new (...args: any[]) => passport.Strategy)(options as any, verifyCallback));
        });

        // Serialize and deserialize the user
        passport.serializeUser((user, done) => done(null, user));
        passport.deserializeUser((user, done) => done(null, user as Express.User));
    }

    // Method to configure the local strategy
    private configureLocalStrategy(): void {
        passport.use(
            new LocalStrategy(
                {
                    usernameField: "email",
                    passwordField: "password", 
                },
                async (email: string, password: string, done) => {
                    try {

                        const user: User = await this.userController.findByEmail(email.toLocaleLowerCase());
                        
                        if (!user || !user.isActive) {
                            return done(null, false, { message: "User not found" });
                        } 

                        const isMatch = await bcrypt.compare(password, user.password as string);

                        if (!isMatch) {
                            
                            return done(null, false, { message: "Incorrect credentials" });
                        }

                        return done(null, user);

                    } catch (error) {
                        return done(error);
                    }
                }
            )
        );
    }

}
