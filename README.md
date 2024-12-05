
# Web Scraper with TypeScript and Puppeteer

## Overview

This project is a web scraper built in **TypeScript** using **Puppeteer**, designed to extract product details from Amazon and Walmart based on a list of SKUs. The scraped data is saved to a CSV file, and errors are logged for review.

---

## Features

- **Scrape Product Data:** Extracts product title, price, description, and number of reviews.
- **Error Logging:** Logs failed attempts or unexpected issues to `errors.log`.
- **CSV Output:** Saves scraped data in `product_data.csv`.
- **Dynamic SKU Input:** Reads a list of SKUs from `skus.json` for flexible configuration.

---

## Project Structure

```bash
/project-root
|-- /src
|   |-- scraper.ts          # Main logic for scraping Amazon and Walmart
|   |-- utils.ts            # Utilities for logging and saving data
|-- skus.json               # Input file with SKUs
|-- package.json            # Project dependencies and scripts
|-- tsconfig.json           # TypeScript configuration
|-- product_data.csv        # Output file with scraped data (auto-generated)
|-- errors.log              # Log file for errors (auto-generated)
|-- README.md               # Project documentation
```

---

## Prerequisites

Ensure you have the following installed:

1. **Node.js** (v14+ recommended)
2. **npm** or **yarn**

---

## Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Skpow1234/WebScraper-Valenceintel.git
   cd web-scraper
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Prepare the Input File:**
   - Create a `skus.json` file in the root directory with the following structure:

     ```json
     {
       "skus": [
         { "Type": "Amazon", "SKU": "B0CT4BB651" },
         { "Type": "Walmart", "SKU": "5326288985" },
         { "Type": "Amazon", "SKU": "B01LR5S6HK" }
       ]
     }
     ```

---

## Usage

1. **Compile the Typescript files**

   ```bash
   npx tsc

   ```

2. **Run the Scraper:**

   ```bash
   node dist/scraper.js
   ```

3. **View Results:**
   - Scraped data is saved to `product_data.csv`.
   - Errors encountered during scraping are logged in `errors.log`.

---

## Output Details

The `product_data.csv` will contain the following columns:

- `SKU`: The unique identifier for the product.
- `Source`: The source of the product (Amazon/Walmart).
- `Title`: The product's title.
- `Description`: The product's description.
- `Price`: The product's price.
- `Number of Reviews`: The number of reviews the product has received.

---

## Assumptions

- The SKUs provided in `skus.json` are valid and match the format required by Amazon and Walmart.
- Both websites use the current selectors for product details.
- Puppeteer can access the pages without encountering CAPTCHA or other anti-bot mechanisms.

---

## Limitations

- **CAPTCHA Handling:** This scraper does not handle CAPTCHA challenges dynamically. If encountered, the scraper will log the error and skip the SKU.
- **Site Changes:** The scraper relies on current DOM selectors, which may break if Amazon or Walmart updates their websites.
- **Limited Data:** Description for Walmart products is not scraped due to lack of consistent selector availability.

---

## Customization

- **Update Selectors:**
  Modify `scraper.ts` to update selectors if Amazon or Walmart changes their website structure.
- **Additional Fields:**
  Add new fields in `scraper.ts` and update the CSV header in `utils.ts` to include more product data.

---

## Error Handling

- Errors during scraping are logged in `errors.log` with timestamps for debugging.
- If a SKU cannot be scraped, it will be skipped, and the scraper will continue with the next SKU.

---

## Dependencies

- **Puppeteer:** For headless browser automation.
- **csv-writer:** For writing scraped data to a CSV file.
- **TypeScript:** For static type checking and better code organization.
- **Jest:** For unit testing

---
