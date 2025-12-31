import "dotenv/config";
import axios from "axios";

import fetchArticles from "./fetchArticles.js";
import googleSearch from "./googleSearch.js";
import scrapeArticleContent from "./scrapeArticleContent.js";
import rewriteArticle from "./llmRewrite.js";

const PHASE1_API_BASE = "http://127.0.0.1:5000/api/articles";

async function processArticle(article, index) {
  console.log(`\nProcessing article ${index + 1}: ${article.title}`);

  // Google search
  const searchResults = await googleSearch(article.title);
  if (searchResults.length < 2) {
    console.log("Not enough Google results, skipping");
    return;
  }

  const topResults = searchResults.slice(0, 2);

  // Scrape reference articles
  const scrapedReferences = [];
  for (const ref of topResults) {
    const scraped = await scrapeArticleContent(ref.link);
    if (scraped) {
      scrapedReferences.push({
        title: scraped.title,
        content: scraped.content,
        url: ref.link
      });
    }
  }

  if (scrapedReferences.length < 2) {
    console.log("Could not scrape enough reference content");
    return;
  }

  // Rewrite with LLM
  const rewrittenContent = await rewriteArticle({
    originalTitle: article.title,
    originalContent: article.originalContent,
    referenceArticles: scrapedReferences
  });

  // Publish updated article
  await axios.post(PHASE1_API_BASE, {
    title: article.title,
    updatedContent: rewrittenContent,
    version: "updated",
    parentArticle: article._id,
    references: scrapedReferences.map(r => r.url),
    sourceUrl: article.sourceUrl ? `${article.sourceUrl}-updated` : `updated-${article._id}`
  });
  
  



  console.log("Updated article published");
}

async function main() {
  console.log("Phase 2 Pipeline Started");

  const articles = await fetchArticles();

  if (!articles.length) {
    console.log("No articles found");
    return;
  }

  // Process ALL 5 (sequentially to avoid rate limits)
  for (let i = 0; i < articles.length; i++) {
    try {
      await processArticle(articles[i], i);
    } catch (err) {
      console.error(`Failed article ${i + 1}:`, err.message);
    }
  }

  console.log("\nPhase 2 completed for all articles");
}

main().catch(err => console.error("Fatal:", err));
