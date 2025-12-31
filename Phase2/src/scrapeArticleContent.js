import axios from "axios";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export default async function scrapeArticleContent(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const dom = new JSDOM(response.data, {
      url
    });

    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article || !article.textContent) {
      return null;
    }

    return {
      title: article.title,
      content: article.textContent.trim(),
      excerpt: article.excerpt
    };
  } catch (err) {
    console.error(`Failed to scrape ${url}:`, err.message);
    return null;
  }
}
