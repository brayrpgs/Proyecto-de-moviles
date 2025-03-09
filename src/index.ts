import express, { Application } from "express";
import morgan from "morgan";
import { Data } from "./controllers/data";


class Main {
    
    private app: Application;
    private port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;
        this.middlewares();
        this.rutes();
        this.start();
    }

    private start() {
        this.app.listen(this.port, () => {
            console.log(`App listening on port http://localhost:${this.port}/`)
        })
    }

    private rutes() {
        new Data("/").routes(this.app);

    }

    private middlewares() {
        this.app.use(morgan("common"));
        
    }
}
new Main(3000);