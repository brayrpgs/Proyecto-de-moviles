import { Request, Response } from 'express';
import { ApiResponse } from "../utils/apiResponse"
import { generateToken } from "../utils/jwt";
import { UserService } from '../services/UserService';
import { EmailService } from '../services/EmailService';
import { UserPasswordRecoveryService } from '../services/UserPasswordRecoveryService';

export class UserController {
    private userService;
    private passwordRecoveryService;

    constructor() {
        this.userService = new UserService();
        this.passwordRecoveryService = new UserPasswordRecoveryService();
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
            ApiResponse.success(res, { user }, 200);
        } catch (error: any) {
            ApiResponse.error(res, error.message, 400);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) throw new Error("ID must be a number");

            const user = await this.userService.delete(id)
            ApiResponse.success(res, { user }, 200);
        } catch (error: any) {
            ApiResponse.error(res, error.message, 400);
        }
    }

    // Method to find a user by email
    async findByEmail(email: string) {
        try {
            const user = await this.userService.findByEmail(email);

            return user;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    // Method to send OTP to an user to recover their password
    async sendOTP(req: Request, res: Response) {
        try {
            // 1. Validate request sent an email
            const { email } = req.body;
            if (!email || email === "" || email === null) {
                ApiResponse.error(res, "An email is required")
                return;
            }

            // 2. Validate that user exists
            const user = await this.userService.findByEmail(email);
            const { password, ...sanitizedUser } = user;

            // 2.1 If user dont exist, send ApiResponse
            if (user.id === 0 || !user || !user.id) {
                ApiResponse.error(res, "User not found", 404);
                return;
            }
            
            // 3. Validate the limit of OTP requests
            if (!await this.passwordRecoveryService.validateOTPLimits(user.id)) {
                ApiResponse.error(res, "User has too many recent requests");
                return;
            }

            // 4. Generate OTP and save it on database
            const recordOTP = await this.passwordRecoveryService.create(user.id)

            // 5. Send created OTP to user through email
            const emailService = new EmailService();
            await emailService.sendOTPEmail({ to: user.email, otp: recordOTP.otp });

            // 6. Response
            ApiResponse.success(res, { user: sanitizedUser })
        } catch (error: any) {
            console.log(error)
            ApiResponse.error(res, "Unexpected error has ocurred", 500);
        }
    }

    // Method to validate OTP and make the password update if it's valid
    async validateOTPToRecoverPassword(req: Request, res: Response) {
        try {
            // 1. Validate all needed data were sent 
            const { otp, user, newPassword } = req.body;
            if (!otp || !user || !newPassword) {
                ApiResponse.error(res, "Can not process the request")
                return;
            }

            // 2. Validate OTP
            const otpRecord = await this.passwordRecoveryService.getOTPRecordIfValid(otp.trim(), user.email);
            if (!otpRecord || !otpRecord.user) {
                ApiResponse.error(res, "OTP is not valid");
                return;
            }

            // 3. As OTP was confirm as valid, password can be updated
            await this.userService.update(otpRecord.user.id, { password: newPassword });

            // 4. Update OTP as used
            await this.passwordRecoveryService.update(otpRecord.id, { isUsed: true });

            // 4. Response
            ApiResponse.success(res)
        } catch (error: any) {
            console.log(error)
            ApiResponse.error(res, "Unexpected error has ocurred", 500);
        }
    }

}
