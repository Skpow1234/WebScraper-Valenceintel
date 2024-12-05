import { saveToCSV, logError } from "../utils";
import * as fs from "fs";
import { createObjectCsvWriter } from "csv-writer";

jest.mock("csv-writer", () => ({
    createObjectCsvWriter: jest.fn((params) => ({
        writeRecords: jest.fn().mockResolvedValue(undefined),
    })),
}));

jest.mock("fs", () => ({
    appendFileSync: jest.fn(),
}));

describe("Utils Tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("saveToCSV", () => {
        it("should save data to CSV correctly", async () => {
            const testData = [
                {
                    sku: "12345",
                    source: "Amazon",
                    title: "Test Product",
                    description: "A test product description",
                    price: "$10.99",
                    reviews: "100 reviews",
                },
            ];
            const params = {
                path: "./product_data.csv",
                header: [
                    { id: "sku", title: "SKU" },
                    { id: "source", title: "Source" },
                    { id: "title", title: "Title" },
                    { id: "description", title: "Description" },
                    { id: "price", title: "Price" },
                    { id: "reviews", title: "Number of Reviews" },
                ],
            };
            const mockCsvWriter = createObjectCsvWriter(params);
            await saveToCSV(testData);
            expect(mockCsvWriter.writeRecords).toHaveBeenCalledTimes(1);
            expect(mockCsvWriter.writeRecords).toHaveBeenCalledWith(testData);
        });
        it("should log success message to the console", async () => {
            const consoleSpy = jest.spyOn(console, "log").mockImplementation();
            await saveToCSV([]);
            expect(consoleSpy).toHaveBeenCalledWith("Data saved to CSV!");
            consoleSpy.mockRestore();
        });
    });
    describe("logError", () => {
        it("should append error messages to the log file", () => {
            const testMessage = "Test error message";
            logError(testMessage);
            expect(fs.appendFileSync).toHaveBeenCalledTimes(1);
            expect(fs.appendFileSync).toHaveBeenCalledWith(
                "./errors.log",
                expect.stringMatching(new RegExp(`.*${testMessage}.*`))
            );
        });
    });
});
