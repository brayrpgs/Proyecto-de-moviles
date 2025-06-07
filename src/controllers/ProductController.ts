import { Request, Response } from 'express';
import { ApiResponse } from "../utils/apiResponse"
import { ProductService } from '../services/ProductService';
import { WebScraping } from '../services/webscraping';
import { Image } from '../models/index';


export class ProductController {
    private productService = new ProductService();

    constructor() {
        this.productService = new ProductService();
    }

    // Method to save products to the database

   private async saveProducts(products: any[], store: string, tagName: string): Promise<void> {
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
            store: store,
            tags: tagName,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            images: productImages
        };

        await this.productService.create(newProduct, newProduct.images);
    }
}
// Create a new product and save it to the database

async create(req: Request, res: Response) {
    try {
        ApiResponse.success(res, { message: "Creating products, please wait..." }, 201);

        const { name } = req.body;

        const [ebayProducts, alibabaProducts, amazonProducts] = await Promise.all([
            new WebScraping().setSearchData(name).setUrls("https://www.ebay.com/").setStorage("ebay").ScrapingEbay(),
            new WebScraping().setSearchData(name).setUrls("https://www.alibaba.com/").setStorage("alibaba").ScrapingAlibaba(),
            new WebScraping().setSearchData(name).setUrls("https://www.amazon.com/").setStorage("amazon").ScrapingAmazon()
        ]);

        await this.saveProducts(alibabaProducts, "Alibaba", name);
        await this.saveProducts(amazonProducts, "Amazon", name);
        await this.saveProducts(ebayProducts, "Ebay", name);

    } catch (error: any) {
        ApiResponse.error(res, error.message, 400);
    }
}
// Method to read products from the database with pagination and optional filters
   async read(req: Request, res: Response) {
    try {
        const page = Math.max(1, parseInt(req.query.page as string)) || 1;
        const size = Math.min(Math.max(1, parseInt(req.query.size as string) || 10), 100);
        const { ...queryParams } = req.query;

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

        // if the count is less than or equal to 15 and a name is provided, scrape products
        if (count <= 15 && req.query.name) {
            const name = req.query.name as string;

            const [ebayProducts, alibabaProducts, amazonProducts] = await Promise.all([
                new WebScraping().setSearchData(name).setUrls("https://www.ebay.com/").setStorage("ebay").ScrapingEbay(),
                new WebScraping().setSearchData(name).setUrls("https://www.alibaba.com/").setStorage("alibaba").ScrapingAlibaba(),
                new WebScraping().setSearchData(name).setUrls("https://www.amazon.com/").setStorage("amazon").ScrapingAmazon()
            ]);

            await this.saveProducts(alibabaProducts, "Alibaba", name);
            await this.saveProducts(amazonProducts, "Amazon", name);
            await this.saveProducts(ebayProducts, "Ebay", name);
        }
    } catch (error: any) {
        ApiResponse.error(res, error.message, 400);
    }
}

}
