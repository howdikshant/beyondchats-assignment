const axios = require("axios");
const cheerio = require("cheerio");

// Scrape all blog listing pages by incrementing page number
// Stop pagination when no blog cards are found
// Collect all blogs and return only the oldest 5 articles
async function scrapeAllBlogs() {
  let page = 1;
  const allBlogs = [];

  while (true) {
    const url =
      page === 1
        ? "https://beyondchats.com/blogs/"
        : `https://beyondchats.com/blogs/page/${page}/`;

    console.log("Scraping listing page:", url);

    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    });

    const $ = cheerio.load(data);

    const blogsOnPage = [];

    $("article.entry-card").each((i, el) => {
      const title = $(el).find("h2.entry-title").text().trim();
      const link = $(el).find("a").attr("href");

      if (title && link) {
        blogsOnPage.push({ title, link });
      }
    });

    if (blogsOnPage.length === 0) break;

    allBlogs.push(...blogsOnPage);
    page++;
  }

  // After collecting blog titles and links from pagination,
  // visit each blog URL sequentially
  // Scrape the full article content for each blog
  // Attach the scraped content as `originalContent`
  // Do not scrape in parallel to avoid rate-limiting
  const results = [];

  // Only fetch the last 5 blogs' content to avoid fetching everything
  const toFetch = allBlogs.slice(-5);
  for (const blog of toFetch) {
    console.log("Fetching article:", blog.link);
    const html = await fetchArticleContent(blog.link);
    results.push({ title: blog.title, link: blog.link, originalContent: html });
    // small delay to be polite
    await new Promise((r) => setTimeout(r, 500));
  }

  // Return only the oldest 5 articles (already limited above)
  return results;
}

// Fetch a single BeyondChats blog article page using axios
// Use a browser-like User-Agent header
// Load the HTML using cheerio
// Extract the full main article body from the `.entry-content` container
// Return the article content as HTML (not plain text)
// Add basic try/catch error handling
async function fetchArticleContent(url) {
  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      timeout: 10000,
    });

    const $ = cheerio.load(data);

    // Try multiple possible selectors to be robust if the site markup varies
    const selectors = [
      ".entry-content",
      ".post-content",
      ".article-content",
      "article .entry-content",
      "article.post",
      "main",
      "#content",
    ];

    for (const sel of selectors) {
      const node = $(sel);
      if (node && node.length) {
        const html = node.html();
        if (html && html.trim().length > 0) {
          console.log(`Fetched content using selector ${sel}:`, html.length);
          return html;
        }
      }
    }

    // Fallback: try to return the whole article tag or body HTML
    const articleHtml = $("article").first().html();
    if (articleHtml && articleHtml.trim().length > 0) {
      console.log("Fetched content from <article> fallback, length:", articleHtml.length);
      return articleHtml;
    }

    const bodyHtml = $("body").html();
    console.warn("Could not find article content for", url, "— returning empty string. Body length:", bodyHtml ? bodyHtml.length : 0);
    return "";
  } catch (err) {
    console.error("Error fetching article", url, err.message);
    return "";
  }
}

module.exports = scrapeAllBlogs;
