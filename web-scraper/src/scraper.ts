import puppeteer, { Browser } from "puppeteer";
import { saveToCSV, logError } from "./utils";

const AMAZON_URL = "https://www.amazon.com/dp/";
const WALMART_URL = "https://www.walmart.com/";

async function scrapeAmazon(browser: Browser, sku: string) {
    const page = await browser.newPage();
    const url = `${AMAZON_URL}${sku}?language=en_US`;
    try {
        await page.goto(url, { waitUntil: "domcontentloaded" });
        await page.waitForSelector("#productTitle", { timeout: 5000 });
        const title = await page.$eval("#productTitle", el => (el as HTMLElement).textContent?.trim() || "");
        const price = await page.$eval(".a-price span", el => (el as HTMLElement).textContent?.trim() || "");
        const description = await page.$eval("#feature-bullets", el => (el as HTMLElement).textContent?.trim() || "");
        const reviews = await page.$eval("#acrCustomerReviewText", el => (el as HTMLElement).textContent?.trim() || "");
        await page.close();
        return { title, price, description, reviews };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        logError(`Amazon SKU ${sku} failed: ${errorMessage}`);
        await page.close();
        return null;
    }
}

async function scrapeWalmart(browser: Browser, sku: string) {
    const page = await browser.newPage();
    const url = `${WALMART_URL}${sku}`;
    try {
        await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36"
        );
        await page.goto(url, { waitUntil: "domcontentloaded" });
        await page.waitForSelector(".price-characteristic", { timeout: 5000 });
        const title = await page.$eval("h1", el => (el as HTMLElement).textContent?.trim() || "");
        const price = await page.$eval(".price-characteristic", el => el.getAttribute("content") || "");
        const description = "Description not available";
        const reviews = await page.$eval(".stars-reviews-count", el => (el as HTMLElement).textContent?.trim() || "");
        await page.close();
        return { title, price, description, reviews };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        logError(`Walmart SKU ${sku} failed: ${errorMessage}`);
        await page.close();
        return null;
    }
}

async function scrapeProducts() {
    const browser = await puppeteer.launch({ headless: true });
    const skus = require("../skus.json").skus;
    const results = [];
    for (const { Type, SKU } of skus) {
        if (Type === "Amazon") {
            const data = await scrapeAmazon(browser, SKU);
            if (data) results.push({ sku: SKU, source: "Amazon", ...data });
        } else if (Type === "Walmart") {
            const data = await scrapeWalmart(browser, SKU);
            if (data) results.push({ sku: SKU, source: "Walmart", ...data });
        }
    }
    await saveToCSV(results);
    await browser.close();
}

scrapeProducts();
