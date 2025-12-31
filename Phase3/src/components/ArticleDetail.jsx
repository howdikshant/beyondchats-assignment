import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./ArticleDetail.css";

function ArticleDetail({ article, onClose }) {
  const isUpdated = article.version === "updated";
  let content = article.updatedContent || article.originalContent || "";

  // Remove References section from markdown content (we'll show it separately below)
  // Handle different heading levels: # References, ## References, ### References
  const referencesPatterns = [
    /\n#{1,3}\s+references\s*\n/i,
    /\n#{1,3}\s+References\s*\n/,
    /\n##\s+References\s*\n/,
    /\n#\s+References\s*\n/,
  ];

  for (const pattern of referencesPatterns) {
    const match = content.match(pattern);
    if (match) {
      const index = match.index;
      content = content.substring(0, index).trim();
      break;
    }
  }

  // Redirect original articles to source URL
  if (!isUpdated && article.sourceUrl) {
    window.open(article.sourceUrl, "_blank", "noopener,noreferrer");
    onClose();
    return null;
  }

  return (
    <div className="article-detail-overlay" onClick={onClose}>
      <div
        className="article-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-button" onClick={onClose}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="article-detail-header">
          <div className={`article-detail-badge updated`}>Enhanced Version</div>
          <h1 className="article-detail-title">{article.title}</h1>

          <div className="article-detail-meta">
            {article.author && <span>By {article.author}</span>}
            {article.publishedAt && <span>{article.publishedAt}</span>}
            {article.createdAt && (
              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>

        <div className="article-detail-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="markdown-content"
          >
            {content}
          </ReactMarkdown>
        </div>

        {article.references && article.references.length > 0 && (
          <div className="article-detail-references">
            <h3>References</h3>
            <ul>
              {article.references.map((ref, idx) => (
                <li key={idx}>
                  <a href={ref} target="_blank" rel="noopener noreferrer">
                    {ref}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticleDetail;
