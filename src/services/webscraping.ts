import puppeteer from "puppeteer";


export class WebScraping {
    private searchData: string;
    private storage: string;
    private urls: Array<string>;

    constructor() {
        this.searchData = "";
        this.storage = "";
        this.urls = [];
    }

    public setSearchData(searchData: string): WebScraping {
        this.searchData = searchData;
        return this;
    }

    public setStorage(storage: string): WebScraping {
        this.storage = storage;
        return this;
    }

    public setUrls(urls: Array<string>): WebScraping {
        this.urls = urls;
        return this;
    }

    public getStorage() {
        return this.storage
    }

    public getSearchData() {
        return this.searchData;
    }

    public async init(): Promise<Object> {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(this.urls[0]);
        await page.reload();
        await page.goto(`${this.urls[0]}s?k=${this.searchData}`);
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
        console.log(data);
        return data;
    }


}