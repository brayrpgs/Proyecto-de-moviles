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

// Because we don't have a database yet, we will use a test user
const testUser = {
    id: "1",
    username: "admin",
    password: bcrypt.hashSync("123456", 10),
    displayName: "Patricio" 
};

export class Middlewares {

    private app: Application;

    // Define the URLs for the callback routes
    private static readonly CALLBACK_URLS = {
        google: "http://localhost:3000/auth/google/callback",
        facebook: "http://localhost:3000/auth/facebook/callback",
        github: "http://localhost:3000/auth/github/callback"
    };

    constructor(app: Application) {
        this.app = app;

        // Morgan is used for logging HTTP requests
        this.app.use(morgan("common"));
        this.app.use(express.urlencoded({ extended: true })); // To read the body of the request, temporarily
        this.app.use(express.json());
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
        passport.use(new LocalStrategy((username, password, done) => {
            if (username === testUser.username && bcrypt.compareSync(password, testUser.password)) {
                return done(null, testUser as Express.User);
            } else {
                return done(null, false, { message: "Incorrect credentials" });
            }
        }));

        passport.serializeUser((user, done) => done(null, (user as any).id));
        passport.deserializeUser((id, done) => {
            if (id === testUser.id) {
                done(null, testUser as Express.User);
            } else {
                done(null, false);
            }
        });
    }

}
