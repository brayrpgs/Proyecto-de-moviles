import { Request, Response } from 'express';
import { ApiResponse } from "../utils/apiResponse"
import { ProductService } from '../services/ProductService';
import { WebScraping } from '../services/webscraping';


export class ProductController {
    private productService = new ProductService();

    constructor() {
        this.productService = new ProductService();
    }

    async create(req: Request, res: Response) {
        try {
            ApiResponse.success(res, { message: "Creating products wait a minute" }, 201);
        
            
            //const product_ScrappingEbay = await new WebScraping().setSearchData(req.body.name).setUrls("https://www.ebay.com/").setStorage("ebay").ScrapingEbay();
            const product_ScrappingAlibaba = await new WebScraping().setSearchData(req.body.name).setUrls("https://www.alibaba.com/").setStorage("alibaba").ScrapingAlibaba();
            //const product_ScrappingAmazon = await new WebScraping().setSearchData(req.body.name).setUrls("https://www.amazon.com/").setStorage("amazon").ScrapingAmazon();

            
            console.log(product_ScrappingAlibaba)

            Array.from(product_ScrappingAlibaba).map((product: any) => {
                
                const newProduct = {

                    url_indentifier: product.image,
                    name: product.title,
                    price: product.price,
                    type_coin: product.type_coin,
                    dateConsulted: new Date,
                    store: "Alibaba",
                    tags: req.body.name,
                    isActive: true,
                    createdAt: new Date,
                    updatedAt: new Date

                }
                this.productService.create(newProduct);
            });
/*

            Array.from(product_ScrappingAmazon).map((product: any) => {
                const newProduct = {

                    url_indentifier: product.image,
                    name: product.title,
                    price: product.price,
                    type_coin: product.type_coin,
                    dateConsulted: new Date,
                    store: "Amazon",
                    tags: req.body.name,
                    isActive: true,
                    createdAt: new Date,
                    updatedAt: new Date

                }
                this.productService.create(newProduct);
            });

            Array.from(product_ScrappingEbay).map((product: any) => {
                const newProduct = {

                    url_indentifier: product.image,
                    name: product.title,
                    price: product.price,
                    type_coin: product.type_coin,
                    dateConsulted: new Date,
                    store: "Ebay",
                    tags: req.body.name,
                    isActive: true,
                    createdAt: new Date,
                    updatedAt: new Date
                    
                }
                this.productService.create(newProduct);
            });
            
*/
        } catch (error: any) {
            ApiResponse.error(res, error.message, 400);
        }
    }
    /*
        async read(req: Request, res: Response) {
            try {
                const page = Math.max(1, parseInt(req.query.page as string)) || 1;
                const size = Math.min(Math.max(1, parseInt(req.query.size as string) || 10), 100);
                const { ...queryParams } = req.query;
    
               // Taking pagination data and users
                const { count, rows: users } = await this.userService.read(page, size, queryParams);
                
                // Result of total pages
                const totalPages = Math.ceil(count / size);
    
                // Sending strctured response
                ApiResponse.success(res, { 
                    users,
                    pagination: {
                        totalItems: count,
                        totalPages,
                        currentPage: page,
                        pageSize: size
                    }
                }, 200);
            } catch (error: any) {
                ApiResponse.error(res, error.message, 400);
            }
        }
    
        async update(req: Request, res: Response) {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) throw new Error("ID must be a number");
    
                const user = await this.userService.update(id, req.body)
                ApiResponse.success(res, { user}, 200);
            } catch (error: any) {
                ApiResponse.error(res, error.message, 400);
            }
        }
    
        async delete(req: Request, res: Response) {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) throw new Error("ID must be a number");
    
                const user = await this.userService.delete(id)
                ApiResponse.success(res, { user}, 200);
            } catch (error: any) {
                ApiResponse.error(res, error.message, 400);
            }
        }
    
        // Method to find a user by email
        async findByEmail(email: string) {
            try {
                const user = await this.userService.findByEmail(email);
                return user;
            } catch (error: any) {
                throw new Error(error.message); 
            }
        }
    */
}
