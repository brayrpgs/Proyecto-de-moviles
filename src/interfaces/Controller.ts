import { Express } from "express";
export interface Controller {
    routes(app: Express): void;
}