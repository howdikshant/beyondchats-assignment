# BeyondChat - Article Enhancement Pipeline

This project is a three-phase system that scrapes articles, enhances them using AI, and displays them in a modern web interface. Here's how everything works together.

## What This Project Does

The pipeline takes original blog articles, finds similar content from across the web, uses AI to rewrite and improve them, then serves everything up in a clean React frontend. You can view both the original articles and their enhanced versions side by side.

## Prerequisites

Before you start, make sure you have these installed:

- **Node.js** (v18 or higher)
- **MongoDB** (running locally or connection string ready)
- **npm** (comes with Node.js)

You'll also need API keys for:
- **OpenAI** (for article rewriting) - Get one at https://platform.openai.com/api-keys
- **SerpAPI** (for Google search) - Get one at https://serpapi.com/dashboard (free tier available)

## Project Structure

```
beyondchat/
├── Phase1/          # Backend API and scraper
├── Phase2/          # LLM enhancement pipeline
└── Phase3/          # React frontend
```

## Quick Start Guide

Follow these steps in order to get everything running.

### Step 1: Set Up Phase 1 (Backend & Scraper)

First, we need to scrape some articles and set up the database.

1. Navigate to Phase1:
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

Replace `mongodb://localhost:27017/beyondchat` with your MongoDB connection string if you're using a remote database or different setup.

4. Make sure MongoDB is running on your system.

5. Run the scraper to fetch articles:
```bash
npm run scrape
```

This will scrape articles from the configured source and save them to your MongoDB database. Wait for it to finish - you should see a "Scraping & seeding completed" message.

6. Start the backend server:
```bash
npm start
```

Or if you have nodemon installed and want auto-reload:
```bash
npm run dev
```

You should see "Server running on port 5000" in the console. Keep this terminal window open - the server needs to stay running.

### Step 2: Set Up Phase 2 (LLM Enhancement)

Now we'll enhance the scraped articles using AI. Open a new terminal window for this.

1. Navigate to Phase2:
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

Replace the placeholder values with your actual API keys:
- Get your OpenAI API key from https://platform.openai.com/api-keys
- Get your SerpAPI key from https://serpapi.com/dashboard

4. Make sure Phase 1 server is still running (from Step 1).

5. Run the enhancement pipeline:
```bash
npm run dev
```

This will:
- Fetch all articles from Phase 1 API
- Search Google for similar articles
- Scrape reference content
- Use OpenAI to rewrite and enhance each article
- Save the enhanced versions back to the database

The process runs sequentially to avoid rate limits, so it might take a few minutes depending on how many articles you have. You'll see progress messages in the console for each article being processed.

When it's done, you'll see "Phase 2 completed for all articles". You can close this terminal once it finishes.

### Step 3: Set Up Phase 3 (Frontend)

Finally, let's get the frontend running so you can view everything.

1. Open another new terminal window and navigate to Phase3:
```bash
cd Phase3
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file in Phase3 if you want to customize the API URL:
```env
VITE_API_BASE_URL=http://127.0.0.1:5000/api/articles
```

This is optional - it defaults to the same URL if you don't create the file.

4. Make sure Phase 1 server is still running.

5. Start the development server:
```bash
npm run dev
```

Vite will start the dev server and show you a URL (usually http://localhost:5173). Open that URL in your browser.

You should now see:
- A list of all articles (both original and enhanced versions)
- Filter buttons to view only originals or only enhanced articles
- Click "Read Article" on enhanced articles to see the full content
- Click "View Original" on original articles to open the source page

## Running the Complete Pipeline

Here's the typical workflow when you want to process new articles:

1. **Scrape articles** (Phase 1):
   ```bash
   cd Phase1
   npm run scrape
   ```

2. **Start the backend server** (Phase 1):
   ```bash
   cd Phase1
   npm start
   ```
   Keep this running in one terminal.

3. **Enhance articles with AI** (Phase 2):
   ```bash
   cd Phase2
   npm run dev
   ```
   Wait for this to complete, then you can close this terminal.

4. **View in frontend** (Phase 3):
   ```bash
   cd Phase3
   npm run dev
   ```
   Open the URL shown in your browser.

## How It All Works

**Phase 1** handles the backend:
- Scrapes articles from configured sources
- Stores them in MongoDB
- Provides a REST API to fetch articles
- Runs on port 5000

**Phase 2** does the AI enhancement:
- Fetches articles from Phase 1 API
- Uses SerpAPI to find similar articles via Google search
- Scrapes content from those reference articles
- Sends everything to OpenAI to rewrite and improve the original article
- Saves enhanced versions back through the Phase 1 API

**Phase 3** is the user interface:
- Fetches articles from Phase 1 API
- Displays them in a modern, responsive design
- Converts markdown content to HTML for reading
- Shows both original and enhanced versions side by side

## Troubleshooting

**Phase 1 server won't start:**
- Check that MongoDB is running
- Verify your MONGO_URI in the .env file is correct
- Make sure port 5000 isn't already in use

**Phase 2 fails with API errors:**
- Verify your OpenAI and SerpAPI keys are correct in Phase2/.env
- Check that Phase 1 server is running on port 5000
- Make sure you have credits/quota available in both API accounts

**Phase 3 can't load articles:**
- Ensure Phase 1 server is running
- Check the browser console for error messages
- Verify the API URL in Phase3/.env matches Phase 1's port

**No articles showing up:**
- Make sure you ran the scraper (npm run scrape in Phase1)
- Check that articles were successfully saved to MongoDB
- Verify Phase 1 API is accessible at http://127.0.0.1:5000/api/articles

**CSS parsing warnings in Phase 2:**
- These are harmless warnings from jsdom when scraping websites
- They don't affect functionality, you can ignore them

## Building for Production

**Phase 3 (Frontend):**
```bash
cd Phase3
npm run build
```

This creates an optimized production build in the `dist` folder that you can deploy to any static hosting service.

## Environment Variables Summary

**Phase1/.env:**
- `MONGO_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)

**Phase2/.env:**
- `PHASE1_API_BASE` - Phase 1 API URL
- `OPENAI_API_KEY` - Your OpenAI API key
- `SERPAPI_KEY` - Your SerpAPI key

**Phase3/.env (optional):**
- `VITE_API_BASE_URL` - Phase 1 API URL

## Notes

- The pipeline processes articles sequentially to respect API rate limits
- Enhanced articles are saved with `version: "updated"` in the database
- Original articles link directly to their source URLs
- The frontend uses a dark theme for better readability
- All markdown content is automatically converted to HTML for display

That's it! You should have everything up and running. If you run into issues, check the console output in each phase - the error messages are usually pretty helpful.

