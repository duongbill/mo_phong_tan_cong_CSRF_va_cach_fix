import { Link } from 'react-router-dom';
import './CategoryCard.css';

// Icon component cho từng category
const CategoryIcon = ({ categoryId }) => {
  const icons = {
    review: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    news: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
    trailer: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  };

  return (
    <div className="category-card__icon">
      {icons[categoryId] || icons.news}
    </div>
  );
};

export default function CategoryCard({ id, title, description }) {
  return (
    <Link
      to={`/news/category/${id}`}
      className="category-card"
    >
      {/* Background gradient on hover */}
      <div className="category-card__gradient-overlay" />
      
      {/* Icon */}
      <div className="category-card__icon-wrapper">
        <CategoryIcon categoryId={id} />
      </div>

      {/* Content */}
      <div className="category-card__content">
        <h4 className="category-card__title">
          {title}
        </h4>
        <p className="category-card__description">
          {description}
        </p>
      </div>

      {/* Arrow icon */}
      <div className="category-card__arrow">
        <span className="category-card__arrow-button">
          →
        </span>
      </div>
    </Link>
  );
}