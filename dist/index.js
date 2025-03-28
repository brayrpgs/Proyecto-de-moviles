"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Authentication_1 = require("./authentication/Authentication");
const Middlewares_1 = require("./middlewares/Middlewares");
const UserController_1 = require("./controllers/UserController");
class Main {
    constructor(port) {
        this.userController = new UserController_1.UserController();
        this.app = (0, express_1.default)();
        this.app.use(express_1.default.json());
        this.port = port;
        this.middlewares();
        this.routes();
        this.start();
    }
    start() {
        this.app.listen(this.port, () => {
            console.log(`App listening on port http://localhost:${this.port}/`);
        });
    }
    routes() {
        new Authentication_1.Authentication("/auth").routes(this.app);
        // User endpoints:
        this.app.post('/api/users', (req, res) => {
            this.userController.create(req, res);
        });
        this.app.get('/api/users', (req, res) => {
            this.userController.read(req, res);
        });
        this.app.patch('/api/users/:id', (req, res) => {
            this.userController.update(req, res);
        });
        this.app.delete('/api/users/:id', (req, res) => {
            this.userController.delete(req, res);
        });
    }
    middlewares() {
        // new Middlewares(this.app);
        new Middlewares_1.Middlewares(this.app);
    }
}
new Main(3000);
