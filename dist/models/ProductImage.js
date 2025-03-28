"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class ProductImage extends sequelize_1.Model {
    static initialize() {
        this.init({
            productId: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                field: 'product_id'
            },
            imageId: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                field: 'image_id'
            }
        }, {
            sequelize: db_1.default,
            tableName: 'tb_product_image',
            createdAt: 'created_at',
            updatedAt: false,
            timestamps: true
        });
    }
}
exports.default = ProductImage;
