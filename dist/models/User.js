"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: sequelize_1.DataTypes.STRING(63),
        allowNull: true,
        unique: true,
        validate: {
            len: {
                args: [3, 63],
                msg: 'Username must be between 3 and 63 characters'
            },
            is: {
                args: /^[a-zA-Z0-9_]+$/i,
                msg: 'Username can only contain letters, numbers and underscores'
            }
        }
    },
    email: {
        type: sequelize_1.DataTypes.STRING(63),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Please enter a valid email address'
            },
            len: {
                args: [5, 63],
                msg: 'Email must be between 5 and 63 characters'
            },
            notEmpty: {
                msg: 'Email is required'
            }
        }
    },
    password: {
        type: sequelize_1.DataTypes.STRING(1027),
        allowNull: true,
        validate: {
            len: {
                args: [8, 1027],
                msg: 'Password must be between 8 and 1027 characters'
            }
        }
    },
    authProvider: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
        field: 'auth_provider',
        validate: {
            isIn: {
                args: [['Google', 'Facebook', 'Apple', 'Email', null]],
                msg: 'Invalid authentication provider'
            },
            len: {
                args: [0, 20],
                msg: 'Auth provider cannot exceed 20 characters'
            }
        }
    },
    providerId: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        field: 'provider_id',
        validate: {
            len: {
                args: [0, 255],
                msg: 'Provider ID cannot exceed 255 characters'
            }
        }
    },
    accessToken: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        field: 'access_token',
        validate: {
            len: {
                args: [0, 65535],
                msg: 'Access token is too long'
            }
        }
    },
    refreshToken: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        field: 'refresh_token',
        validate: {
            len: {
                args: [0, 65535],
                msg: 'Refresh token is too long'
            }
        }
    },
    tokenExpiry: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: 'token_expiry',
        validate: {
            isDate: {
                msg: 'Token expiry must be a valid date',
                args: true
            }
        }
    },
    avatarUrl: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        field: 'avatar_url',
        validate: {
            isUrl: {
                msg: 'Avatar URL must be a valid URL'
            },
            len: {
                args: [0, 65535],
                msg: 'Avatar URL is too long'
            }
        }
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
        field: 'first_name',
        validate: {
            len: {
                args: [0, 100],
                msg: 'First name cannot exceed 100 characters'
            },
            is: {
                args: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
                msg: 'First name can only contain letters (including accents), spaces, apostrophes (\'), and hyphens (-)'
            }
        }
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
        field: 'last_name',
        validate: {
            len: {
                args: [0, 100],
                msg: 'Last name cannot exceed 100 characters'
            },
            is: {
                args: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
                msg: 'Last name can only contain letters (including accents), spaces, apostrophes (\'), and hyphens (-)'
            }
        }
    },
    isEmailVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_email_verified',
        validate: {
            isBoolean: {
                msg: 'Email verification status must be true or false'
            }
        }
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
        validate: {
            isBoolean: {
                msg: 'Active status must be true or false'
            }
        }
    },
}, {
    sequelize: db_1.default,
    modelName: 'User',
    tableName: 'tb_user',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
    hooks: {
        beforeValidate: (user) => {
            if (user.username) {
                user.username = user.username.trim();
            }
            if (user.email) {
                user.email = user.email.trim().toLowerCase();
            }
        }
    }
});
exports.default = User;
