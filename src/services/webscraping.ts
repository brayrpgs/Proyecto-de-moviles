import { isEmpty } from "lodash";
import { log } from "node:console";
import puppeteer from "puppeteer";
import { ElementHandle } from "puppeteer";

export class WebScraping {
    private searchData: string;
    private storage: string;
    private url: string;

    constructor() {
        this.searchData = "";
        this.storage = "";
        this.url = "";
    }

    public setSearchData(searchData: string): WebScraping {
        this.searchData = searchData;
        return this;
    }

    public setStorage(storage: string): WebScraping {
        this.storage = storage;
        return this;
    }

    public setUrls(url: string): WebScraping {
        this.url = url;
        return this;
    }

    public getStorage() {
        return this.storage
    }

    public getSearchData() {
        return this.searchData;
    }



    public async ScrapingAmazon(): Promise<Array<Object>> {
        try {

            /**
             * configuration and search
             */
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.goto(`${this.url}s?k=${this.searchData}`);
            const elements = await page.$$(".a-section.a-spacing-small.a-spacing-top-small");



            /**
            * get all elements with sub-elements and limit to sub-elements
            */
            const data = await Promise.all(
                elements.map(async (element) => {
                    return await page.evaluate(el => {
                        return {
                            title: el.querySelector("h2>span")?.textContent?.trim() || "Sin título",
                            image: [] as string[],
                            type_coin: el.querySelector("span.a-price-symbol")?.textContent || "Sin moneda",
                            price: (el.querySelector("span.a-price-whole")?.textContent || "0") + (el.querySelector("span.a-price-fraction")?.textContent || "0"),
                            url_product: el.querySelector("a")?.href || "",
                        };
                    }, element);
                })
            );



            /**
             * clean data
             */
            const cleanData = data.filter(value =>
                value.url_product !== "javascript:void(0)" &&
                value.title !== "Sin título" &&
                !isEmpty(value.url_product) &&
                value.price !== "00" &&
                value.type_coin !== "Sin moneda"
            );



            /**
             * get the images for each products
             */
            const imaPage = await browser.newPage();
            for (const value of cleanData) {
                if (!value.url_product) continue;
                await imaPage.goto(value.url_product, { 
                    waitUntil: ["load", "networkidle0", "networkidle2"],
                    timeout: 60000
                });
                const buttons = (await imaPage.$$('li.imageThumbnail')).slice(0, 10);
                for (const btn of buttons) {
                    await btn.hover();
                    const imgElement = await imaPage.$("img.a-dynamic-image");
                    const img = await imgElement?.evaluate(img => img.src);
                    if (img) value.image.push(img);
                }
            }


            /** close window */
            await imaPage.close();
            await page.close();
            await browser.close();

            return cleanData;
        } catch (error) {
            throw new Error("Error : " + error);
        }
    }

    public async ScrapingEbay(): Promise<Array<Object>> {
        try {

            /**
             * configuration and search
             */
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.goto(`${this.url}/sch/i.html?_nkw=${this.searchData}&_fcid=1`);
            const elements = await page.$$(".s-item__wrapper.clearfix");

            /**
            * get all elements with sub-elements and limit to sub-elements
            */
            const data = await Promise.all(
                elements.map(async (element) => {
                    return await page.evaluate(el => {
                        return {
                            title: el.querySelector(".s-item__title")?.textContent?.trim() || "Sin título",
                            image: [] as string[],
                            type_coin: el.querySelector("span.s-item__price")?.textContent?.charAt(0) || "Sin moneda",
                            price: el.querySelector("span.s-item__price")?.textContent || "0",
                            url_product: el.querySelector("a")?.href || "",
                        };
                    }, element);
                })
            );

            /**
            * clean data
            */
            const cleanData = data.filter(
                (value) =>
                    value.url_product !== "javascript:void(0)" &&
                    value.title !== "Sin título" &&
                    !isEmpty(value.url_product) &&
                    value.title !== 'Shop on eBay'
            );



            /**
             * get the images for each products
            */
            const imaPage = await browser.newPage();
            for (const value of cleanData) {
                if (!value.url_product) continue;
                await imaPage.goto(value.url_product, { 
                    waitUntil: ["load", "networkidle0", "networkidle2"],
                    timeout: 60000
                });
                const buttons = (await imaPage.$$('div.ux-image-grid.no-scrollbar > button')).slice(0, 10);

                for (const btn of buttons) {
                    await btn.hover();
                    const test = await imaPage.$(".ux-image-carousel-item.image-treatment.active.image > img");
                    const img = await test?.evaluate((img) => img.src);
                    if (img) value.image.push(img);
                }
            }


            /** close window */
            await imaPage.close();
            await page.close();
            await browser.close();

            return cleanData;
        } catch (error) {
            throw new Error("Error: " + error);
        }
    }

    public async ScrapingAlibaba(): Promise<Array<Object>> {
        try {

            /**
             * configuration and search
             */
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.goto(`${this.url}trade/search?SearchText=${this.searchData}`);
            const elements = await page.$$(".fy23-search-card.m-gallery-product-item-v2.J-search-card-wrapper.fy23-gallery-card.searchx-offer-item");


            /**
            * get all elements with sub-elements and limit to sub-elements
            */
            const data = await Promise.all(
                elements.map(async (element) => {
                    return await page.evaluate(el => {
                        return {
                            title: el.querySelector(".search-card-e-title>a>span")?.textContent?.trim() || "Sin título",
                            image: [] as string[],
                            type_coin: el.querySelector(".search-card-e-price-main")?.textContent?.match(/[A-Z$]+/g)?.pop() || "Sin moneda",
                            price: el.querySelector(".search-card-e-price-main")?.textContent?.slice(0, -4) || "00",
                            url_product: el.querySelector("a")?.href || "",
                        };
                    }, element);
                })
            );

            /**
            * clean data
            */
            const cleanData = data.filter(value =>
                value.url_product !== "javascript:void(0)" &&
                value.title !== "Sin título" &&
                !isEmpty(value.url_product) &&
                value.price !== "00" &&
                value.type_coin !== "Sin moneda"
            );



            /**
             * get the images for each products
            */
            const imaPage = await browser.newPage();
            for (const value of cleanData) {
                if (!value.url_product) continue;
                await imaPage.goto(value.url_product, { 
                    waitUntil: ["load", "networkidle0", "networkidle2"],
                    timeout: 60000
                });
                const buttons = (await imaPage.$$('.id-flex.id--mt-4.id-flex-col.id--mt-5.id-h-full>div')).slice(0, 10);
                log(buttons.length)
                for (const btn of buttons) {
                    await btn.hover();
                    const test = await imaPage.$("img.id-h-full.id-w-full.id-object-contain");
                    const img = await test?.evaluate((img) => img.src);
                    if (img) value.image.push(img);
                }
            }


            /** close window */
            await imaPage.close();
            await page.close();
            await browser.close();

            return cleanData;
        } catch (error) {
            throw new Error("Error: " + error);
        }
    }


}