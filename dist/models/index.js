"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImage = exports.Image = exports.Product = exports.sequelize = void 0;
const db_1 = __importDefault(require("../config/db"));
exports.sequelize = db_1.default;
const Product_1 = __importDefault(require("./Product"));
exports.Product = Product_1.default;
const Image_1 = __importDefault(require("./Image"));
exports.Image = Image_1.default;
const ProductImage_1 = __importDefault(require("./ProductImage"));
exports.ProductImage = ProductImage_1.default;
// Initialize needed models (because of relations)
Product_1.default.initialize();
Image_1.default.initialize();
ProductImage_1.default.initialize();
// Creating the relations
Product_1.default.associate({ Image: Image_1.default, ProductImage: ProductImage_1.default });
Image_1.default.associate({ Product: Product_1.default, ProductImage: ProductImage_1.default });
