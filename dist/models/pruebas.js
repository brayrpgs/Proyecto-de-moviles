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
exports.create = void 0;
const _1 = require(".");
const User_1 = __importDefault(require("./User"));
const create = () => __awaiter(void 0, void 0, void 0, function* () {
    const product = {
        name: 'producto1',
        summary: 'summary1',
        price: 14.50,
        dateConsulted: new Date,
        store: 'Amazon',
        tags: ['ropa', 'fashion', 'style'].join(','),
        isActive: true
    };
    const imageUrls = [
        'https://m.media-amazon.com/images/I/51yaQQSq59L._AC_SX569_.jpg',
        'https://m.media-amazon.com/images/I/51DkqxFg7zL._AC_SX569_.jpg'
    ];
    const createdProduct = yield _1.Product.create(product);
    const imagePromises = imageUrls.map((url, index) => __awaiter(void 0, void 0, void 0, function* () {
        const [image] = yield _1.Image.findOrCreate({
            where: { url },
        });
        return image;
    }));
    const images = yield Promise.all(imagePromises);
    const productImagePromises = images.map((image, index) => {
        return _1.ProductImage.create({
            productId: createdProduct.id,
            imageId: image.id
        });
    });
    yield Promise.all(productImagePromises);
    const products = yield User_1.default.findAll();
    console.log(products);
});
exports.create = create;
