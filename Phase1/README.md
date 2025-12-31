# Phase 1 - Backend API & Article Scraper

Phase 1 is the foundation of the BeyondChat project. It handles article scraping, database storage, and provides a REST API for accessing articles.

## What Phase 1 Does

- Scrapes articles from configured blog sources
- Stores articles in MongoDB with metadata
- Provides REST API endpoints to fetch and manage articles
- Serves as the data layer for Phase 2 and Phase 3

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or remote connection)
- npm

## Installation

1. Navigate to the Phase1 directory:
```bash
cd Phase1
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Phase1 directory:
```env
MONGO_URI=mongodb://localhost:27017/beyondchat
PORT=5000
```

Adjust the `MONGO_URI` if you're using a remote MongoDB instance or different database name.

## Project Structure

```
Phase1/
├── src/
│   ├── controllers/
│   │   └── articleController.js    # Request handlers
│   ├── models/
│   │   └── Article.js              # Mongoose schema
│   ├── routes/
│   │   └── articleRoutes.js        # API route definitions
│   ├── scraper/
│   │   ├── scrapeAllBlogs.js        # Web scraping logic
│   │   └── saveToDB.js             # Database save operations
│   ├── scripts/
│   │   └── scrapeAndSeed.js        # One-time scraping script
│   ├── db.js                        # MongoDB connection
│   └── index.js                     # Express server entry point
├── package.json
└── README.md
```

## Usage

### Step 1: Start MongoDB

Make sure MongoDB is running on your system. If you're using a local installation, start the MongoDB service. For remote databases, ensure your connection string is correct in the `.env` file.

### Step 2: Scrape Articles

Run the scraping script to fetch articles from the configured source:

```bash
npm run scrape
```

This script will:
- Connect to MongoDB
- Scrape articles from the configured blog source
- Extract article content, titles, and metadata
- Save everything to the database
- Exit when complete

You should see progress messages and a "Scraping & seeding completed" message when done.

### Step 3: Start the API Server

Start the Express server:

```bash
npm start
```

Or for development with auto-reload (if you have nodemon):

```bash
npm run dev
```

The server will start on the port specified in your `.env` file (default: 5000). You should see "Server running on port 5000" in the console.

Keep this server running - it needs to stay up for Phase 2 and Phase 3 to work.

## API Endpoints

The API is available at `http://localhost:5000/api/articles` (or your configured port).

### GET /api/articles

Fetch all articles from the database.

**Response:**
```json
[
  {
    "_id": "...",
    "title": "Article Title",
    "author": "Author Name",
    "publishedAt": "2024-01-01",
    "originalContent": "Article content...",
    "updatedContent": "Enhanced content...",
    "sourceUrl": "https://example.com/article",
    "version": "original",
    "references": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET /api/articles/:id

Fetch a single article by ID.

**Response:**
```json
{
  "_id": "...",
  "title": "Article Title",
  ...
}
```

### POST /api/articles

Create a new article. Used by Phase 2 to save enhanced articles.

**Request Body:**
```json
{
  "title": "Article Title",
  "originalContent": "Content here",
  "updatedContent": "Enhanced content",
  "version": "updated",
  "sourceUrl": "https://example.com/article",
  "references": ["url1", "url2"],
  "parentArticle": "original_article_id"
}
```

**Response:** Created article object

### PUT /api/articles/:id

Update an existing article.

**Request Body:** Same as POST, with fields to update

**Response:** Updated article object

### DELETE /api/articles/:id

Delete an article.

**Response:**
```json
{
  "message": "Article deleted"
}
```

## Article Model Schema

```javascript
{
  title: String,
  author: String,
  publishedAt: String,
  originalContent: String,      // Original article content
  updatedContent: String,       // AI-enhanced content
  sourceUrl: String,            // Required, unique
  version: String,              // "original" or "updated"
  references: [String],         // Array of reference URLs
  createdAt: Date,             // Auto-generated
  updatedAt: Date              // Auto-generated
}
```

## Configuration

### Environment Variables

- `MONGO_URI` - MongoDB connection string
  - Format: `mongodb://[host]:[port]/[database]`
  - Example: `mongodb://localhost:27017/beyondchat`
  
- `PORT` - Server port number
  - Default: 5000
  - Example: `5000`

### Scraper Configuration

The scraper is configured in `src/scraper/scrapeAllBlogs.js`. You can modify:
- Target blog URL
- Number of pages to scrape
- Content extraction selectors
- Request headers and timeouts

## Troubleshooting

**MongoDB connection fails:**
- Verify MongoDB is running: `mongosh` or check service status
- Check your `MONGO_URI` in `.env` is correct
- Ensure MongoDB is accessible from your network if using remote connection

**Port already in use:**
- Change the `PORT` in `.env` to a different number
- Or stop the process using port 5000

**Scraper returns no articles:**
- Check the target website is accessible
- Verify the CSS selectors in `scrapeAllBlogs.js` match the website structure
- Check network connectivity and firewall settings

**Articles not saving:**
- Verify MongoDB connection is working
- Check database permissions
- Look for error messages in the console

## Development

### Adding New Endpoints

1. Add route handler in `src/controllers/articleController.js`
2. Register route in `src/routes/articleRoutes.js`
3. Test with your API client

### Modifying the Scraper

Edit `src/scraper/scrapeAllBlogs.js` to:
- Change target URLs
- Adjust scraping logic
- Modify content extraction

Then run `npm run scrape` again to test changes.

## Next Steps

Once Phase 1 is running:
1. Verify articles are in the database
2. Test API endpoints with a tool like Postman or curl
3. Move on to Phase 2 to enhance articles with AI
4. Use Phase 3 to view articles in the frontend

## Notes

- The server must stay running for Phase 2 and Phase 3 to work
- Articles are stored permanently in MongoDB
- The scraper can be run multiple times - it uses upsert logic to avoid duplicates
- Original articles have `version: "original"` or no version field
- Enhanced articles from Phase 2 have `version: "updated"`

