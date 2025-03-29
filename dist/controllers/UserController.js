"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const jwt_1 = require("../utils/jwt");
const UserService_1 = require("../services/UserService");
class UserController {
    constructor() {
        this.userService = new UserService_1.UserService();
        this.userService = new UserService_1.UserService();
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.create(req.body);
                const token = (0, jwt_1.generateToken)({ id: user.id, email: user.email });
                apiResponse_1.ApiResponse.success(res, { user, token }, 201);
            }
            catch (error) {
                apiResponse_1.ApiResponse.error(res, error.message, 400);
            }
        });
    }
    read(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = Math.max(1, parseInt(req.query.page)) || 1;
                const size = Math.min(Math.max(1, parseInt(req.query.size) || 10), 100);
                const queryParams = __rest(req.query, []);
                // Taking pagination data and users
                const { count, rows: users } = yield this.userService.read(page, size, queryParams);
                // Result of total pages
                const totalPages = Math.ceil(count / size);
                // Sending strctured response
                apiResponse_1.ApiResponse.success(res, {
                    users,
                    pagination: {
                        totalItems: count,
                        totalPages,
                        currentPage: page,
                        pageSize: size
                    }
                }, 200);
            }
            catch (error) {
                apiResponse_1.ApiResponse.error(res, error.message, 400);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id))
                    throw new Error("ID must be a number");
                const user = yield this.userService.update(id, req.body);
                apiResponse_1.ApiResponse.success(res, { user }, 200);
            }
            catch (error) {
                apiResponse_1.ApiResponse.error(res, error.message, 400);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id))
                    throw new Error("ID must be a number");
                const user = yield this.userService.delete(id);
                apiResponse_1.ApiResponse.success(res, { user }, 200);
            }
            catch (error) {
                apiResponse_1.ApiResponse.error(res, error.message, 400);
            }
        });
    }
}
exports.UserController = UserController;
