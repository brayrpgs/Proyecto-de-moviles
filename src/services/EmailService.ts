require("dotenv").config();

import nodemailer, { Transporter } from 'nodemailer';
import { OTP_EXPIRATION_MINUTES } from '../utils/constants';

interface EmailOptions {
    to: string;
    otp: string;
    expirationMinutes?: number;
}

export class EmailService {
    private transporter: Transporter;
    private appName: string;

    constructor() {
        this.appName = process.env.APP_NAME || 'Search Engine';
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT!, 10) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    // Helper method to format OTP with spaces every 2 characters
    private formatOTP(otp: string): string {
        return otp.match(/.{1,2}/g)?.join(' ') || otp;
    }

    async sendOTPEmail({ to, otp, expirationMinutes = OTP_EXPIRATION_MINUTES }: EmailOptions): Promise<void> {
        try {
            const mailOptions = {
                from: `"${this.appName}" <${process.env.SMTP_FROM}>`,
                to,
                subject: 'Password Recovery OTP',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>Password Recovery</h2>
                        <p>Your One-Time Password (OTP) for password recovery is:</p>
                        <h3 style="color: #2c3e50; font-size: 24px;">${this.formatOTP(otp)}</h3>
                        <p>This OTP is valid for ${expirationMinutes} minutes. Please do not share this code with anyone.</p>
                        <p>If you didn't request this, please ignore this email.</p>
                        <p>Best regards,<br>${this.appName} Team</p>
                    </div>
                `,
            };

            await this.transporter.sendMail(mailOptions);
        } catch (error: any) {
            console.error('Error sending OTP email:', error.message || 'Unknown error');
            throw new Error('Failed to send OTP email');
        }
    }

    async verifyConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            return true;
        } catch (error) {
            console.error('SMTP connection verification failed:', (error as Error).message);
            return false;
        }
    }
}