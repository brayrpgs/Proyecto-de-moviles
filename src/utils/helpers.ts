import { IUserAttributes } from "../models/User";

export function sanitizeUser(user: IUserAttributes) {
    const {
        password,
        refreshToken,
        accessToken,
        providerId,
        ...safeUser
    } = user;

    return safeUser;
}
