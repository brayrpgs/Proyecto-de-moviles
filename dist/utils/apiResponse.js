"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    static success(res, data = null, status = 200) {
        res.status(status).json({
            success: true,
            data
        });
    }
    static error(res, message, status = 400) {
        res.status(status).json({
            success: false,
            error: message
        });
    }
}
exports.ApiResponse = ApiResponse;
