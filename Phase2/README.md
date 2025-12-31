# Phase 2 - AI Article Enhancement Pipeline

Phase 2 takes articles from Phase 1, finds similar content from across the web, and uses AI to rewrite and enhance them. The enhanced articles are then saved back to the database.

## What Phase 2 Does

- Fetches original articles from Phase 1 API
- Searches Google for similar articles using SerpAPI
- Scrapes content from top search results
- Uses OpenAI to rewrite and enhance articles with insights from references
- Saves enhanced versions back to Phase 1 database

## Prerequisites

- Phase 1 API must be running (see Phase1/README.md)
- Node.js (v18 or higher)
- API keys for:
  - **OpenAI** - Get from https://platform.openai.com/api-keys
  - **SerpAPI** - Get from https://serpapi.com/dashboard (free tier available)

## Installation

1. Navigate to the Phase2 directory:
```bash
cd Phase2
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Phase2 directory:
```env
PHASE1_API_BASE=http://127.0.0.1:5000/api/articles
OPENAI_API_KEY=sk-your-openai-api-key-here
SERPAPI_KEY=your-serpapi-key-here
```

Replace the placeholder values:
- `PHASE1_API_BASE` - Should match your Phase 1 server URL and port
- `OPENAI_API_KEY` - Your OpenAI API key (starts with `sk-`)
- `SERPAPI_KEY` - Your SerpAPI key

## Project Structure

```
Phase2/
├── src/
│   ├── index.js                 # Main pipeline entry point
│   ├── fetchArticles.js         # Fetches articles from Phase 1
│   ├── googleSearch.js          # SerpAPI integration
│   ├── scrapeArticleContent.js  # Scrapes reference articles
│   └── llmRewrite.js            # OpenAI rewriting logic
├── package.json
└── README.md
```

## Usage

### Step 1: Ensure Phase 1 is Running

Before running Phase 2, make sure:
- Phase 1 server is running on port 5000 (or your configured port)
- Articles exist in the database (run Phase 1 scraper first)
- Phase 1 API is accessible at the URL in your `.env` file

### Step 2: Run the Enhancement Pipeline

Start the pipeline:

```bash
npm run dev
```

The pipeline will:
1. Fetch all articles from Phase 1 API
2. For each article:
   - Search Google for similar articles
   - Scrape the top 2 reference articles
   - Send to OpenAI for rewriting
   - Save enhanced version back to Phase 1
3. Process articles sequentially to avoid rate limits

### What You'll See

The console will show progress for each article:
```
Phase 2 Pipeline Started

Processing article 1: Article Title
Updated article published

Processing article 2: Another Title
Updated article published

Phase 2 completed for all articles
```

### Processing Time

- Each article takes approximately 30-60 seconds
- Depends on:
  - Google search response time
  - Website scraping speed
  - OpenAI API response time
- 5 articles typically take 3-5 minutes total

## How It Works

### 1. Article Fetching

`fetchArticles.js` makes a GET request to Phase 1 API and retrieves all articles.

### 2. Google Search

`googleSearch.js` uses SerpAPI to search Google for articles similar to the original title. It filters out results from the same domain and returns the top 2 results.

### 3. Content Scraping

`scrapeArticleContent.js` uses JSDOM and Mozilla Readability to extract clean article content from the reference URLs. It handles:
- HTML parsing
- Content extraction
- Text cleaning

### 4. AI Rewriting

`llmRewrite.js` sends the original article and reference articles to OpenAI with instructions to:
- Rewrite using insights from references
- Improve clarity and structure
- Maintain SEO-friendly headings
- Avoid copying sentences
- Add a References section

### 5. Saving Enhanced Articles

The enhanced content is posted back to Phase 1 API as a new article with:
- `version: "updated"`
- `parentArticle: original_article_id`
- `references: [array of URLs]`
- `updatedContent: enhanced_markdown_content`

## Configuration

### Environment Variables

- `PHASE1_API_BASE` - Base URL for Phase 1 API
  - Default: `http://127.0.0.1:5000/api/articles`
  - Must match your Phase 1 server configuration

- `OPENAI_API_KEY` - Your OpenAI API key
  - Required for article rewriting
  - Get from https://platform.openai.com/api-keys
  - Ensure you have available credits

- `SERPAPI_KEY` - Your SerpAPI key
  - Required for Google searches
  - Get from https://serpapi.com/dashboard
  - Free tier includes 100 searches/month

### OpenAI Model

The pipeline uses `gpt-4o-mini` by default. You can change this in `src/llmRewrite.js`:

```javascript
model: "gpt-4o-mini"  // Change to "gpt-4" or other models
```

### Number of References

By default, the pipeline uses the top 2 search results. You can modify this in `src/index.js`:

```javascript
const topResults = searchResults.slice(0, 2);  // Change 2 to desired number
```

## Troubleshooting

**"Failed to fetch articles" error:**
- Verify Phase 1 server is running
- Check `PHASE1_API_BASE` in `.env` matches Phase 1's URL
- Test Phase 1 API directly: `curl http://127.0.0.1:5000/api/articles`

**"Invalid OpenAI API key" error:**
- Verify your API key in `.env` is correct
- Check you have credits/quota in your OpenAI account
- Ensure the key starts with `sk-`

**"Invalid SerpAPI key" error:**
- Verify your SerpAPI key in `.env` is correct
- Check your SerpAPI account has remaining searches
- Verify your account is active

**"Not enough Google results" message:**
- The search didn't find enough relevant articles
- This is normal for some niche topics
- The article will be skipped and processing continues

**"Could not scrape enough reference content" message:**
- Some websites block scrapers or have complex structures
- The pipeline requires at least 2 successfully scraped references
- Article will be skipped if not enough content is found

**Rate limit errors:**
- The pipeline processes sequentially to avoid this
- If you still hit limits, add delays between requests
- Check your API quotas in OpenAI and SerpAPI dashboards

**CSS parsing warnings:**
- These are harmless warnings from jsdom
- They don't affect functionality
- Can be safely ignored

## Output

Enhanced articles are saved to Phase 1 database with:
- Same title as original
- `updatedContent` field containing the enhanced markdown
- `version: "updated"`
- `references` array with source URLs
- `parentArticle` linking to original article ID
- Unique `sourceUrl` (original URL + "-updated" suffix)

## Running Multiple Times

You can run Phase 2 multiple times:
- It will process all articles from Phase 1 each time
- New enhanced versions will be created
- Original articles remain unchanged
- Each run creates new enhanced articles in the database

## Next Steps

After Phase 2 completes:
1. Enhanced articles are available in Phase 1 database
2. View them through Phase 1 API
3. Use Phase 3 frontend to see original vs enhanced side by side

## Notes

- Processing is sequential to respect API rate limits
- Each article requires successful Google search and scraping
- OpenAI rewriting can take 10-30 seconds per article
- Enhanced articles are saved as separate database entries
- Original articles are never modified

