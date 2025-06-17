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

    async create(req: Request, res: Response) {
        try {
            ApiResponse.success(res, { message: "Creating products wait a minute" }, 201);
            const { name } = req.body;

            const product_ScrappingEbay = await new WebScraping().setSearchData(name).setUrls("https://www.ebay.com/").setStorage("ebay").ScrapingEbay();
            const product_ScrappingAlibaba = await new WebScraping().setSearchData(name).setUrls("https://www.alibaba.com/").setStorage("alibaba").ScrapingAlibaba();
            const product_ScrappingAmazon = await new WebScraping().setSearchData(name).setUrls("https://www.amazon.com/").setStorage("amazon").ScrapingAmazon();

            // Saving the products in the database

            Array.from(product_ScrappingAlibaba).map((product: any) => {
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
                    dateConsulted: new Date,
                    store: "Alibaba",
                    tags: req.body.name,
                    isActive: true,
                    createdAt: new Date,
                    updatedAt: new Date,
                    images: productImages



                }

                this.productService.create(newProduct, newProduct.images);
            });

            Array.from(product_ScrappingAmazon).map((product: any) => {

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
                    dateConsulted: new Date,
                    store: "Amazon",
                    tags: req.body.name,
                    isActive: true,
                    createdAt: new Date,
                    updatedAt: new Date,
                    images: productImages



                }

                this.productService.create(newProduct, newProduct.images);
            });

            Array.from(product_ScrappingEbay).map((product: any) => {  

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
                    dateConsulted: new Date,
                    store: "Ebay",
                    tags: req.body.name,
                    isActive: true,
                    createdAt: new Date,
                    updatedAt: new Date,
                    images: productImages
                }
                this.productService.create(newProduct, newProduct.images);
            }); 


        } catch (error: any) {
            console.log(error)
        }
    }

    async read(req: Request, res: Response) {
        try {
            const page = Math.max(1, parseInt(req.query.page as string)) || 1;
            const size = Math.min(Math.max(1, parseInt(req.query.size as string) || 10), 100);
            const { ...queryParams } = req.query;

            // Taking pagination data and users
            const { count, rows: products } = await this.productService.read(page, size, queryParams);

            // Result of total pages
            const totalPages = Math.ceil(count / size);

            // Sending strctured response
            ApiResponse.success(res, {
                products,
                pagination: {
                    totalItems: count,
                    totalPages,
                    currentPage: page,
                    pageSize: size
                }
            }, 200);

            if (count <= 15) {

                if (!req.query.name && req.query.name === undefined) return 
                const product_ScrappingEbay = await new WebScraping().setSearchData(req.query.name as string).setUrls("https://www.ebay.com/").setStorage("ebay").ScrapingEbay();
                const product_ScrappingAlibaba = await new WebScraping().setSearchData(req.body.name as string).setUrls("https://www.alibaba.com/").setStorage("alibaba").ScrapingAlibaba();
                const product_ScrappingAmazon = await new WebScraping().setSearchData(req.body.name as string).setUrls("https://www.amazon.com/").setStorage("amazon").ScrapingAmazon();

                // Saving the products in the database

                Array.from(product_ScrappingAlibaba).map((product: any) => {

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
                        dateConsulted: new Date,
                        store: "Alibaba",
                        tags: req.body.name,
                        isActive: true,
                        createdAt: new Date,
                        updatedAt: new Date,
                        images: productImages



                    }

                    this.productService.create(newProduct, newProduct.images);
                });


                Array.from(product_ScrappingAmazon).map((product: any) => {

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
                        dateConsulted: new Date,
                        store: "Amazon",
                        tags: req.body.name,
                        isActive: true,
                        createdAt: new Date,
                        updatedAt: new Date,
                        images: productImages



                    }

                    this.productService.create(newProduct, newProduct.images);
                });


                Array.from(product_ScrappingEbay).map((product: any) => {

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
                        dateConsulted: new Date,
                        store: "Ebay",
                        tags: req.body.name,
                        isActive: true,
                        createdAt: new Date,
                        updatedAt: new Date,
                        images: productImages
                    }
                    this.productService.create(newProduct, newProduct.images);
                });
            }
        } catch (error: any) {
            ApiResponse.error(res, error.message, 400);
        }
    }

}
