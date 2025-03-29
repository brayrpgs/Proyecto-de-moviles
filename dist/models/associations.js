"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Product_1 = __importDefault(require("./Product"));
const Image_1 = __importDefault(require("./Image"));
const ProductImage_1 = __importDefault(require("./ProductImage"));
Product_1.default.belongsToMany(Image_1.default, {
    through: ProductImage_1.default,
    foreignKey: 'product_id',
    as: 'images'
});
Image_1.default.belongsToMany(Product_1.default, {
    through: ProductImage_1.default,
    foreignKey: 'image_id',
    as: 'products'
});
