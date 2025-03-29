"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authentication = void 0;
require("dotenv").config();
const passport_1 = __importDefault(require("passport"));
class Authentication {
    constructor(route) {
        this.route = route;
    }
    routes(app) {
        app.route(this.route).get((req, res) => {
            res.send("<a href='/auth/google'>Login with Google</a>");
        });
        app.route(`${this.route}/google`).get(passport_1.default.authenticate('google', { scope: ["profile", "email"] }));
        app.route(`${this.route}/google/callback`).get(passport_1.default.authenticate('google', { failureRedirect: "/" }), (req, res) => {
            res.redirect("/auth/user");
        });
        app.route(`${this.route}/user`).get((req, res) => {
            if (req.user) {
                console.log(req.user);
                const user = req.user;
                const name = user.displayName;
                res.send(`Welcome user: ${name}`);
            }
            else {
                res.status(401).send("User not authenticated");
            }
        });
        app.route(`${this.route}/logout`).get((req, res) => {
            req.logOut((err) => {
                if (err) {
                    return res.status(500).send("Failed to log out");
                }
                res.redirect(this.route);
            });
        });
    }
}
exports.Authentication = Authentication;
