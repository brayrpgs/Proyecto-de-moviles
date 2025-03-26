import { Application } from "express";
import morgan from "morgan";
import { Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth20';
import passport, { Profile, } from "passport";
import session from "express-session";

export class Middlewares {

    private app: Application;

    constructor(app: Application) {
        this.app = app;
        this.app.use(morgan("common"));
        this.app.use(
            session({
                secret: "secret",
                resave: false,
                saveUninitialized: true,
            })
        );
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        const options = {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: "http://localhost:3000/auth/google/callback",
        };

        const verifyCallback = (accessToken: string, refreshToken: string, params: any, profile: Profile, done: (err: any, user?: any) => void): void => {

            console.log(profile);
            return done(null, profile);
        };

        passport.use(new GoogleStrategy(options, verifyCallback));

        passport.serializeUser((user, done) => {
            done(null, user);
        });

        passport.deserializeUser((user, done) => {
            done(null, user as Express.User);
        });

    }

}