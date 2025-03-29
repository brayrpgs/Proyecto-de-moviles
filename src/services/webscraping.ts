import puppeteer from "puppeteer";


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
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(this.url);
        await page.reload();
        await page.goto(`${this.url}s?k=${this.searchData}`);
        const elements = await page.$$(".sg-col-inner");
        const data = await Promise.all(
            elements.map(async (element) => {
                return await page.evaluate(el => {
                    return {
                        title: el.querySelector("h2")?.textContent?.trim() || "Sin título",
                        image: el.querySelector("img")?.src || "Sin imagen",
                        type_coin: el.querySelector("span.a-price-symbol")?.textContent || "Sin moneda",
                        price: (el.querySelector("span.a-price-whole")?.textContent || "0") + (el.querySelector("span.a-price-fractio")?.textContent || "0")
                    };
                }, element);
            })
        );
        
        return data;
    }

    public async ScrapingEbay(): Promise<Array<Object>> {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(this.url);
        await page.reload();
        await page.goto(`${this.url}/sch/i.html?_nkw=${this.searchData}&_fcid=1`);
        const elements = await page.$$(".s-item__wrapper.clearfix");
        const data = await Promise.all(
            elements.map(async (element) => {
                return await page.evaluate(el => {
                    return {
                        title: el.querySelector(".s-item__title")?.textContent?.trim() || "Sin título",
                        image: el.querySelector("img")?.src || "Sin imagen",
                        type_coin: el.querySelector("span.s-item__price")?.textContent?.charAt(0) || "Sin moneda",
                        price: el.querySelector("span.s-item__price")?.textContent || "0"
                    };
                }, element);
            })
        );
        
        return data;
    }

    public async ScrapingAlibaba(): Promise<Array<Object>> {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768});
        await page.goto(this.url);
        await page.reload();
        await page.goto(`${this.url}trade/search?SearchText=${this.searchData}`);
        const elements = await page.$$(".fy23-search-card.m-gallery-product-item-v2.J-search-card-wrapper.fy23-gallery-card.searchx-offer-item.fy23-list-card");
        const data = await Promise.all(
            elements.map(async (element) => {
                return await page.evaluate(el => {
                    return {
                        title: el.querySelector(".search-card-e-title>a>span")?.textContent?.trim() || "Sin título",
                        image: el.querySelector("img")?.src || "Sin imagen",
                        type_coin: el.querySelector(".search-card-e-price-main")?.textContent?.match(/[A-Z$]+/g)?.pop() || "Sin moneda",
                        price: el.querySelector(".search-card-e-price-main")?.textContent?.slice(0,-4) || "0"
                    };
                }, element);
            })
        );
        
        console.log(data);
        return data;
    }


}