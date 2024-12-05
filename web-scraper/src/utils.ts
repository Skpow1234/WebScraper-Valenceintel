import { createObjectCsvWriter } from "csv-writer";
import * as fs from "fs";

const csvWriter = createObjectCsvWriter({
    path: "./product_data.csv",
    header: [
        { id: "sku", title: "SKU" },
        { id: "source", title: "Source" },
        { id: "title", title: "Title" },
        { id: "description", title: "Description" },
        { id: "price", title: "Price" },
        { id: "reviews", title: "Number of Reviews" }
    ]
});
export async function saveToCSV(data: any[]) {
    await csvWriter.writeRecords(data);
    console.log("Data saved to CSV!");
}
export function logError(message: string) {
    fs.appendFileSync("./errors.log", `${new Date().toISOString()} - ${message}\n`);
}
