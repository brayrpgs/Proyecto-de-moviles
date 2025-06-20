import { Request, Response } from 'express';
import { ApiResponse } from "../utils/apiResponse"
import { ProductService } from '../services/ProductService';
import { WebScraping } from '../services/webscraping';
import { Image } from '../models/index';
import { IProductAttributes } from '../models/Product';


export class ProductController {
    private productService = new ProductService();

    constructor() {
        this.productService = new ProductService();
    }

    async create(req: Request, res: Response) {
        try {
            ApiResponse.success(res, { message: "Creating products, please wait a moment..." }, 201);

            const { name } = req.body;
            console.log("init product alibaba");
            await this.scrapeAndSave(name, "https://www.alibaba.com/", "alibaba", "Alibaba");
            console.log("init product amazon");
            await this.scrapeAndSave(name, "https://www.amazon.com/", "amazon", "Amazon");
            console.log("init product ebay");
            await this.scrapeAndSave(name, "https://www.ebay.com/", "ebay", "Ebay");

        } catch (error: any) {
            console.error("Error in create:", error);
        }
    }

    private async scrapeAndSave(
        productName: string,
        url: string,
        storageKey: string,
        storeName: "Alibaba" | "Amazon" | "Ebay"
    ) {
        const scraper = new WebScraping()
            .setSearchData(productName)
            .setUrls(url)
            .setStorage(storageKey);

        let products: any[] = [];

        switch (storeName) {
            case "Alibaba":
                products = await scraper.ScrapingAlibaba();
                break;
            case "Amazon":
                products = await scraper.ScrapingAmazon();
                break;
            case "Ebay":
                products = await scraper.ScrapingEbay();
                break;
            default:
                throw new Error("Invalid store name");
        }

        for (const product of products) {
            const productImages: Image[] = product.image.map((url: string) => {
                const image = new Image();
                image.url = url;
                return image;
            });

            const newProduct = {
                urlIdentifier: product.url_product,
                name: product.title,
                price: product.price,
                typeCoin: product.type_coin,
                dateConsulted: new Date(),
                store: storeName,
                tags: productName,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                images: productImages
            };

            await this.productService.create(newProduct, newProduct.images);
        }
    }
    async cleanProducts(products: IProductAttributes[]) {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        for (const product of products) {
            if (product.id && product.createdAt) {
                if (new Date(product.createdAt) < oneMonthAgo) {
                    await this.productService.delete(product.id);
                }
            }else{
                continue;
            }
        }
    }

    async read(req: Request, res: Response) {
        try {

            const page = Math.max(1, parseInt(req.query.page as string)) || 1;
            const size = Math.min(Math.max(1, parseInt(req.query.size as string) || 10), 100);
            const { ...queryParams } = req.query;
            this.productService.read(page, size, queryParams).then(products => this.cleanProducts(products.rows));
            const { count, rows: products } = await this.productService.read(page, size, queryParams);
            const totalPages = Math.ceil(count / size);



            ApiResponse.success(res, {
                products,
                pagination: {
                    totalItems: count,
                    totalPages,
                    currentPage: page,
                    pageSize: size
                }
            }, 200);

            if (count <= 15 && req.query.name) {
                const searchTerm = req.query.name as string;

                const webScraper = new WebScraping().setSearchData(searchTerm);

                const product_ScrappingEbay = await webScraper.setUrls("https://www.ebay.com/").setStorage("ebay").ScrapingEbay();
                const product_ScrappingAlibaba = await webScraper.setUrls("https://www.alibaba.com/").setStorage("alibaba").ScrapingAlibaba();
                const product_ScrappingAmazon = await webScraper.setUrls("https://www.amazon.com/").setStorage("amazon").ScrapingAmazon();

                const saveProducts = (products: any[], storeName: string) => {
                    for (const product of products) {
                        const productImages: Image[] = product.image.map((url: string) => {
                            const image = new Image();
                            image.url = url;
                            return image;
                        });

                        const newProduct = {
                            urlIdentifier: product.url_product,
                            name: product.title,
                            price: product.price,
                            typeCoin: product.type_coin,
                            dateConsulted: new Date(),
                            store: storeName,
                            tags: searchTerm,
                            isActive: true,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            images: productImages
                        };

                        this.productService.create(newProduct, newProduct.images);
                    }
                };

                saveProducts(product_ScrappingEbay, "Ebay");
                saveProducts(product_ScrappingAlibaba, "Alibaba");
                saveProducts(product_ScrappingAmazon, "Amazon");
            }
        } catch (error: any) {
            ApiResponse.error(res, error.message, 400);
        }
    }
    async update(req: Request, res: Response) {
        try {
            const productId = parseInt(req.params.id);
            if (isNaN(productId)) {
                return ApiResponse.error(res, "Invalid product ID", 400);
            }

            const productData = {
                name: req.body.name,
                price: req.body.price,
                typeCoin: req.body.typeCoin,
                updatedAt: new Date(),
                tags: req.body.tags,
            };

            const urlImages = req.body.images || [];

            const updatedProduct = await this.productService.update(productId, productData, urlImages);

            ApiResponse.success(res, { message: "Product updated successfully", product: updatedProduct }, 200);
        } catch (error: any) {

            ApiResponse.error(res, error.message || "Failed to update product", 500);
        }
    }
    async delete(req: Request, res: Response) {
        try {
            const productId = parseInt(req.params.id);
            if (isNaN(productId)) {
                return ApiResponse.error(res, "Invalid product ID", 400);
            }

            const result = await this.productService.delete(productId);

            if (result.updatedRows === 0) {
                return ApiResponse.error(res, "Product not found", 404);
            }

            ApiResponse.success(res, { message: "Product deleted successfully" }, 200);
        } catch (error: any) {

            ApiResponse.error(res, error.message || "Failed to delete product", 500);
        }
    }

}
