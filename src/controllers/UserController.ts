import { Request, Response } from 'express';
import { ApiResponse } from "../utils/apiResponse"
import { generateToken } from "../utils/jwt";
import { UserService } from '../services/UserService';

export class UserController {
    private userService = new UserService();

    constructor() {
        this.userService = new UserService();
    }
  
    async create(req: Request, res: Response) {
        try {
            const user = await this.userService.create(req.body)
            const token = generateToken({ id: user.id, email: user.email });
            ApiResponse.success(res, { user, token }, 201);
        } catch (error: any) {
            ApiResponse.error(res, error.message, 400);
        }
    }

    async read(req: Request, res: Response) {
        try {
            const page = Math.max(1, parseInt(req.query.page as string)) || 1;
            const size = Math.min(Math.max(1, parseInt(req.query.size as string) || 10), 100);
            const { ...queryParams } = req.query;

           // Taking pagination data and users
            const { count, rows: users } = await this.userService.read(page, size, queryParams);
            
            // Result of total pages
            const totalPages = Math.ceil(count / size);

            // Sending strctured response
            ApiResponse.success(res, { 
                users,
                pagination: {
                    totalItems: count,
                    totalPages,
                    currentPage: page,
                    pageSize: size
                }
            }, 200);
        } catch (error: any) {
            ApiResponse.error(res, error.message, 400);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) throw new Error("ID must be a number");

            const user = await this.userService.update(id, req.body)
            ApiResponse.success(res, { user}, 200);
        } catch (error: any) {
            ApiResponse.error(res, error.message, 400);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) throw new Error("ID must be a number");

            const user = await this.userService.delete(id)
            ApiResponse.success(res, { user}, 200);
        } catch (error: any) {
            ApiResponse.error(res, error.message, 400);
        }
    }

}
