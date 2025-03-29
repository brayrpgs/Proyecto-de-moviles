import { Application, json, Request, Response } from "express";
import { Controller } from "../interfaces/Controller";
import { WebScraping } from "../services/webscraping";

export class Data implements Controller {
    private route: string;

    constructor(route: string) {
        this.route = route;
    }

    routes(app: Application) {
        app.route(this.route)
            .get(async (req: Request, res: Response) => {
                res.sendStatus(200);
                return;
            });
    }
}

