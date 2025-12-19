import { Link } from 'react-router-dom';
import './NewsItem.css';

export default function NewsItem({ id, title, author, time, category, description, image }) {
  return (
    <article className="premium-news">
      <div className="premium-news__card">
        {/* Media Block */}
        <div className="premium-news__media">
          <img
            src={image}
            alt={title}
            className="premium-news__image"
          />
          <div className="premium-news__category">
            <span className="premium-news__badge">{category}</span>
          </div>
          <div className="premium-news__media-overlay" />
        </div>

        {/* Content Block */}
        <div className="premium-news__content">
          <div className="premium-news__meta">
            <div className="premium-news__author-group">
              <div className="premium-news__avatar">
                {author.charAt(0).toUpperCase()}
              </div>
              <span className="premium-news__author-name">{author}</span>
            </div>
            <div className="premium-news__divider" />
            <span className="premium-news__date">{time}</span>
          </div>

          <Link to={`/news/${id}`} className="premium-news__title-link">
            <h3 className="premium-news__title">{title}</h3>
          </Link>

          <p className="premium-news__excerpt">
            {description}
          </p>

          <div className="premium-news__footer">
            <Link to={`/news/${id}`} className="premium-news__cta">
              <span className="premium-news__cta-text">Đọc bài viết</span>
              <div className="premium-news__cta-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Blur Bloom */}
      <div className="premium-news__glow" />
    </article>
  );
}