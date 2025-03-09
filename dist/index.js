"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
class Main {
    constructor(port) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.rutes();
        this.start();
        this.app.use((0, morgan_1.default)("common"));
    }
    start() {
        this.app.listen(this.port, () => {
            console.log(`App listening on port http://localhost:${this.port}/`);
        });
    }
    rutes() {
    }
    middlewares() { }
}
new Main(3000);
