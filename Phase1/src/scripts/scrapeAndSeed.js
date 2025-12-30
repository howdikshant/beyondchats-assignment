// One-time script to scrape and seed MongoDB
// Connect to database
// Run scraper to fetch oldest blogs with content
// Save results to DB
// Exit process safely without starting the server
require("dotenv").config();
const connectDB = require("../db");
const scrapeAllBlogs = require("../scraper/scrapeAllBlogs");
const saveToDB = require("../scraper/saveToDB");

(async () => {
  await connectDB();

  const oldestBlogs = await scrapeAllBlogs();
  await saveToDB(oldestBlogs);

  console.log("✅ Scraping & seeding completed");
  process.exit(0);
})();
