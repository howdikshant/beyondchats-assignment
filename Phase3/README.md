# Phase 3 - React Frontend

A professional React frontend for displaying original and AI-enhanced articles from Phase1 API.

## Features

- 📄 Display original and updated articles
- 🎨 Professional, responsive UI design
- 📝 Markdown to HTML conversion for article content
- 🔍 Filter articles by type (All, Original, Updated)
- 📱 Mobile-responsive design
- ✨ Modern, clean interface

## Prerequisites

- Node.js installed
- Phase1 API running on port 5000
- Articles available in the database

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file (optional, defaults to `http://127.0.0.1:5000/api/articles`):

```env
VITE_API_BASE_URL=http://127.0.0.1:5000/api/articles
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser to the URL shown (usually `http://localhost:5173`)

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
Phase3/
├── src/
│   ├── components/
│   │   ├── ArticleCard.jsx      # Article card component
│   │   ├── ArticleCard.css
│   │   ├── ArticleDetail.jsx     # Full article view modal
│   │   └── ArticleDetail.css
│   ├── services/
│   │   └── api.js                # API service for fetching articles
│   ├── App.jsx                   # Main app component
│   ├── App.css
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── package.json
└── vite.config.js
```

## Usage

1. Make sure Phase1 API is running
2. Start the React app with `npm run dev`
3. Browse articles in the main view
4. Click "View Full Article" to see the complete article with markdown rendered as HTML
5. Use filter buttons to view only original or updated articles

## Technologies Used

- React 19
- Vite
- react-markdown (for markdown rendering)
- remark-gfm (GitHub Flavored Markdown support)
- Axios (for API calls)
- CSS3 (responsive design)
