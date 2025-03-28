import express, { Application } from "express";
import { Authentication } from "./authentication/Authentication";
import { Middlewares } from "./middlewares/Middlewares";
import { UserController } from "./controllers/UserController";

class Main {
    private app: Application;
    private port: number;
    private userController = new UserController();

    constructor(port: number) {
        this.app = express();
        this.app.use(express.json())
        this.port = port;
        this.middlewares();
        this.routes(); 
        this.start();
    }

    private start() {
        this.app.listen(this.port, () => {
            console.log(`App listening on port http://localhost:${this.port}/`);
        });
    }

    private routes() {
        
        new Authentication("/auth").routes(this.app);

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

    private middlewares() {
        // new Middlewares(this.app);
        new Middlewares(this.app);
    }
}

new Main(3000);
