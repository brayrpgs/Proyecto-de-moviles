import express, { Application } from "express";
import { Authentication } from "./authentication/Authentication";
import { Middlewares } from "./middlewares/Middlewares";
import { UserController } from "./controllers/UserController";
import { ProductController } from "./controllers/ProductController";

class Main {
    private app: Application;
    private port: number;
    private userController = new UserController();
    private ProductController = new ProductController();

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
        this.app.post('/api/users/recovery-password', (req, res) => {
            this.userController.sendOTP(req, res);
        });
        this.app.post('/api/users/confirm-recovery-password', (req, res) => {
            this.userController.validateOTPToRecoverPassword(req, res);
        });

        // Product endpoints:
        this.app.post('/api/products', (req, res) => {
            this.ProductController.create(req, res);
        });

        this.app.get('/api/products', (req, res) => {
            this.ProductController.read(req, res);
        });
         this.app.patch('/api/products/:id', (req, res) => {
            this.ProductController.update(req, res);
        });
        this.app.delete('/api/products/:id', (req, res) => {
            this.ProductController.delete(req, res);
        });
        
    }

    private middlewares() {

        new Middlewares(this.app);
    }
}

new Main(3000);
