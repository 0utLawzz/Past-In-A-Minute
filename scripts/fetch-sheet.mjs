// fetch-sheet.mjs
//
// Ye script Google Sheet se episode data khichti hai -- BINA kisi API key/OAuth ke.
// Tareeka: apni Google Sheet ko "File > Share > Publish to web" karein, format "CSV"
// select karein, aur jo link mile wo neeche .env ya SHEET_CSV_URL variable mein daal dein.
// Google ka published-to-web link public hota hai (read-only), isliye koi key nahi chahiye.
//
// Chalane ka tareeka:
//   node scripts/fetch-sheet.mjs "https://docs.google.com/spreadsheets/d/.../pub?output=csv"
//
// Ye link content/episodes.csv mein save ho jayega, phir csv-to-json.mjs use karein.

import fs from "node:fs/promises";
import path from "node:path";

const url = process.argv[2] || process.env.SHEET_CSV_URL;

if (!url) {
  console.error(
    "\n[Error] Google Sheet ka published CSV link nahi mila.\n" +
      "Tareeka: node scripts/fetch-sheet.mjs \"<published-csv-url>\"\n" +
      "Sheet publish karne ka tareeka README.md mein 'Google Sheet Setup' section mein hai.\n"
  );
  process.exit(1);
}

try {
  console.log(`Fetching episodes from Google Sheet...\n${url}`);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Sheet fetch fail hui: HTTP ${response.status}. Kya sheet "Published to web" hai?`);
  }

  const csvText = await response.text();
  const outputPath = path.resolve("content/episodes.csv");
  await fs.writeFile(outputPath, csvText, "utf-8");

  console.log(`\n✅ Saved to ${outputPath}`);
  console.log(`Ab 'npm run csv-to-json' chalayein taake dashboard mein data update ho jaye.`);
} catch (err) {
  console.error(`\n[Error] ${err.message}`);
  process.exit(1);
}
