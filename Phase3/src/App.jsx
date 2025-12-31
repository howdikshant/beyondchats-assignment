import { useState, useEffect } from "react";
import { fetchAllArticles } from "./services/api";
import ArticleCard from "./components/ArticleCard";
import ArticleDetail from "./components/ArticleDetail";
import "./App.css";

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all', 'original', 'updated'

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllArticles();
      setArticles(data);
    } catch (err) {
      setError(
        "Failed to load articles. Make sure Phase1 API is running on port 5000."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (article) => {
    setSelectedArticle(article);
  };

  const handleCloseDetail = () => {
    setSelectedArticle(null);
  };

  const filteredArticles = articles.filter((article) => {
    if (filter === "all") return true;
    if (filter === "original")
      return article.version === "original" || !article.version;
    if (filter === "updated") return article.version === "updated";
    return true;
  });

  // Group articles by title to show original and updated together
  const groupedArticles = filteredArticles.reduce((acc, article) => {
    const key = article.title;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(article);
    return acc;
  }, {});

  const articleGroups = Object.values(groupedArticles);

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1 className="app-title">BeyondChat</h1>
          <p className="app-subtitle">
            Discover original articles and their enhanced versions
          </p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="controls">
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All Articles ({articles.length})
              </button>
              <button
                className={`filter-btn ${
                  filter === "original" ? "active" : ""
                }`}
                onClick={() => setFilter("original")}
              >
                Original (
                {
                  articles.filter((a) => a.version === "original" || !a.version)
                    .length
                }
                )
              </button>
              <button
                className={`filter-btn ${filter === "updated" ? "active" : ""}`}
                onClick={() => setFilter("updated")}
              >
                Updated (
                {articles.filter((a) => a.version === "updated").length})
              </button>
            </div>
            <button
              className="refresh-btn"
              onClick={loadArticles}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading articles...</p>
            </div>
          )}

          {error && (
            <div className="error">
              <p>{error}</p>
              <button onClick={loadArticles}>Try Again</button>
            </div>
          )}

          {!loading && !error && articleGroups.length === 0 && (
            <div className="empty">
              <p>
                No articles found. Make sure Phase1 API is running and has
                articles.
              </p>
            </div>
          )}

          {!loading && !error && articleGroups.length > 0 && (
            <div className="articles-grid">
              {articleGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="article-group">
                  {group.map((article) => (
                    <ArticleCard
                      key={article._id}
                      article={article}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedArticle && (
        <ArticleDetail article={selectedArticle} onClose={handleCloseDetail} />
      )}

      <footer className="app-footer">
        <div className="container">
          <p>BeyondChat Article Viewer - Phase 3</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
