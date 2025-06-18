import { Op, Identifier } from 'sequelize';
import UserPasswordRecovery from '../models/UserPasswordRecovery';
import User from '../models/User';

export class UserPasswordRecoveryService {
    async create(idUser: number) {
        try {
            // Generate OTP
            const otp = UserPasswordRecovery.generateOTP();

            // Create password recovery record
            const newRecord = await UserPasswordRecovery.create({
                idUser,
                otp,
                isUsed: false,
            });

            return {
                id: newRecord.id,
                idUser: newRecord.idUser,
                otp: newRecord.otp,
                isUsed: newRecord.isUsed,
                createdAt: newRecord.createdAt,
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async update(id: Identifier, updateData: { isUsed?: boolean }) {
        try {
            // Find password recovery record
            const record = await UserPasswordRecovery.findByPk(id);
            if (!record) {
                throw new Error('Password recovery record not found');
            }

            // Update record with new data
            record.set({
                ...record.get(),
                ...updateData,
            });

            const updatedRecord = await record.save();

            return {
                id: updatedRecord.id,
                idUser: updatedRecord.idUser,
                otp: updatedRecord.otp,
                isUsed: updatedRecord.isUsed,
                createdAt: updatedRecord.createdAt,
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async findByOTP(otp: string) {
        try {
            const record = await UserPasswordRecovery.findOne({
                where: { otp },
                attributes: ['id', 'idUser', 'otp', 'isUsed', 'createdAt'],
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username', 'email'],
                    },
                ],
            });

            if (!record) {
                return null;
            }

            return record;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    // Helpers declared on Model
    async validateOTPLimits(idUser: number){
        return await UserPasswordRecovery.isWithinLimits(idUser);
    }

    async getOTPRecordIfValid(otp: string, email: string){
        return await UserPasswordRecovery.getOTPRecordIfValid(otp, email);
    }
}