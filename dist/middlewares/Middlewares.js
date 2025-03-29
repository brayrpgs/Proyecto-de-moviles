"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middlewares = void 0;
const morgan_1 = __importDefault(require("morgan"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
class Middlewares {
    constructor(app) {
        this.app = app;
        this.app.use((0, morgan_1.default)("common"));
        this.app.use((0, express_session_1.default)({
            secret: "secret",
            resave: false,
            saveUninitialized: true,
        }));
        this.app.use(passport_1.default.initialize());
        this.app.use(passport_1.default.session());
        const options = {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/callback",
        };
        const verifyCallback = (accessToken, refreshToken, params, profile, done) => {
            console.log(profile);
            return done(null, profile);
        };
        passport_1.default.use(new passport_google_oauth20_1.Strategy(options, verifyCallback));
        passport_1.default.serializeUser((user, done) => {
            done(null, user);
        });
        passport_1.default.deserializeUser((user, done) => {
            done(null, user);
        });
    }
}
exports.Middlewares = Middlewares;
