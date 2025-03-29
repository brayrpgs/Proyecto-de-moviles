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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const sequelize_1 = require("sequelize");
class UserService {
    create(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = userData.password ? yield bcryptjs_1.default.hash(userData.password, 12) : null;
                const newUser = Object.assign(Object.assign({}, userData), { password: hashedPassword });
                const { id, username, email, firstName, lastName, avatarUrl, isActive } = yield User_1.default.create(newUser);
                return { id, username, email, firstName, lastName, avatarUrl, isActive };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    read(page, size, queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Variable for filters from extra params and only on those fields
                const where = {};
                const allowedFields = ['id', 'username', 'email', 'firstName', 'lastName', 'isActive'];
                // Maping of filters
                for (const [key, value] of Object.entries(queryParams)) {
                    if (allowedFields.includes(key)) {
                        if (key === 'isActive') {
                            where[key] = value === 'true'; // Convert string to boolean
                        }
                        else if (key === 'id') {
                            where[key] = value; // Exact match for IDs
                        }
                        else {
                            where[key] = { [sequelize_1.Op.iLike]: `%${value}%` }; // Case-insensitive search
                        }
                    }
                }
                return yield User_1.default.findAndCountAll({
                    limit: size,
                    offset: (page - 1) * size,
                    attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'avatarUrl', 'isActive'],
                    where: Object.keys(where).length > 0 ? where : undefined
                });
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    update(id, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Getting the user using the id taken from req path
                const user = yield User_1.default.findByPk(id);
                if (!user) {
                    throw new Error("User not found");
                }
                // Updating user with its new data
                user.set(Object.assign(Object.assign({}, user.get()), userData));
                // If needed to hash the new password it's also needed to put it in the new data
                const hashedPassword = userData.password ? yield bcryptjs_1.default.hash(userData.password, 12) : null;
                if (hashedPassword) {
                    user.set({
                        password: hashedPassword
                    });
                }
                const { id: userId, username, email, firstName, lastName, avatarUrl, isActive } = yield user.save(); // Saving changes to database
                return { id, username, email, firstName, lastName, avatarUrl, isActive };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Getting the user using the id taken from req path
                const user = yield User_1.default.findByPk(id);
                if (!user) {
                    throw new Error("User not found");
                }
                // If it's already deleted
                if (!user.isActive) {
                    throw new Error("User already deleted");
                }
                user.set(Object.assign(Object.assign({}, user.get()), { isActive: false }));
                const { id: userId, username, email, firstName, lastName, avatarUrl, isActive } = yield user.save(); // Saving changes to database
                return { id, username, email, firstName, lastName, avatarUrl, isActive };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.UserService = UserService;
