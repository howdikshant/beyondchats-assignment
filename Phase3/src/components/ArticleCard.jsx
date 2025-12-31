import "./ArticleCard.css";

function ArticleCard({ article, onViewDetails }) {
  const isUpdated = article.version === "updated";
  const content = article.updatedContent || article.originalContent || "";
  const preview =
    content.substring(0, 150) + (content.length > 150 ? "..." : "");

  // For original articles, redirect to source URL
  const handleClick = () => {
    if (!isUpdated && article.sourceUrl) {
      window.open(article.sourceUrl, "_blank", "noopener,noreferrer");
    } else {
      onViewDetails(article);
    }
  };

  return (
    <div className={`article-card ${isUpdated ? "updated" : "original"}`}>
      <div className="article-header">
        <div className="article-badge">
          {isUpdated ? "Enhanced" : "Original"}
        </div>
        <h2 className="article-title">{article.title}</h2>
      </div>

      <div className="article-meta">
        {article.author && (
          <span className="meta-item">By {article.author}</span>
        )}
        {article.publishedAt && (
          <span className="meta-item">{article.publishedAt}</span>
        )}
        {article.createdAt && (
          <span className="meta-item">
            {new Date(article.createdAt).toLocaleDateString()}
          </span>
        )}
      </div>

      {isUpdated && preview && <p className="article-preview">{preview}</p>}

      {article.references && article.references.length > 0 && isUpdated && (
        <div className="article-references">
          <span className="references-label">References</span>
          <span className="references-count">{article.references.length}</span>
        </div>
      )}

      <div className="article-actions">
        <button onClick={handleClick} className="btn-primary">
          {isUpdated ? "Read Article" : "View Original →"}
        </button>
      </div>
    </div>
  );
}

export default ArticleCard;
