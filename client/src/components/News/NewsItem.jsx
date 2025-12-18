import { Link } from 'react-router-dom';
import './NewsItem.css';

export default function NewsItem({ id, title, author, time, category, description, image }) {
  return (
    <article className="news-item">
      {/* Decorative gradient overlay on hover */}
      <div className="news-item__gradient-overlay" />
      
      {/* Image container */}
      <div className="news-item__image-container">
        <div className="news-item__image-overlay" />
        <img
          src={image}
          alt={title}
          className="news-item__image"
        />
        {/* Category badge on image */}
        <div className="news-item__category-badge">
          <span>{category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="news-item__content">
        {/* Metadata */}
        <div className="news-item__metadata">
          <div className="news-item__author">
            <div className="news-item__author-avatar">
              {author.charAt(0).toUpperCase()}
            </div>
            <span className="news-item__author-name">{author}</span>
          </div>
          <span className="news-item__dot" />
          <span className="news-item__time">{time}</span>
        </div>

        {/* Title */}
        <Link
          to={`/news/${id}`}
          className="news-item__title"
        >
          {title}
        </Link>

        {/* Description */}
        <p className="news-item__description">
          {description}
        </p>

        {/* Read more link */}
        <div className="news-item__read-more">
          <Link
            to={`/news/${id}`}
            className="news-item__read-more-link"
          >
            <span>Đọc tiếp</span>
            <span className="news-item__read-more-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}