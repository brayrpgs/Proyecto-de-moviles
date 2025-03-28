"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Image extends sequelize_1.Model {
    static associate(models) {
        Image.belongsToMany(models.Product, {
            through: models.ProductImage,
            foreignKey: 'image_id',
            as: 'products'
        });
    }
    static initialize() {
        this.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            url: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
                unique: true,
                validate: {
                    isUrl: { msg: 'URL must be correct' }
                }
            }
        }, {
            sequelize: db_1.default,
            tableName: 'tb_image',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        });
    }
}
exports.default = Image;
