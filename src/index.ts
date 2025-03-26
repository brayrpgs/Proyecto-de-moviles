import express, { Application } from "express";
import { Authentication } from "./authentication/Authentication";
import { Middlewares } from "./middlewares/Middlewares";

class Main {
    private app: Application;
    private port: number;

    constructor(port: number) {
        this.app = express();
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

    }

    private middlewares() {
        // new Middlewares(this.app);
        new Middlewares(this.app);
    }
}

new Main(3000);
