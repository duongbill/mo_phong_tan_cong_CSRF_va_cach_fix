import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import NewsItem from './NewsItem';
import { newsList, categories } from './dataNews';
import './CategoryPage.css';

// Ảnh nền cao cấp cho trang chuyên mục
const heroBackground = 'url("https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=2000&q=80")';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const foundCategory = categories.find((cat) => cat.id === categoryId);
        if (!foundCategory) {
          navigate('/news');
          return;
        }
        setCategory(foundCategory);

        const allNews = await newsList();
        const filteredNews = allNews.filter(item =>
          item.category.toLowerCase().includes(foundCategory.title.toLowerCase().split(' ')[0]) ||
          foundCategory.id === 'news'
        );

        setNews(filteredNews.length > 0 ? filteredNews : allNews.slice(0, 3));
      } catch (error) {
        console.error('Lỗi tải tin tức chuyên mục:', error);
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };

    if (categoryId) {
      fetchData();
    }
  }, [categoryId, navigate]);

  if (loading) {
    return (
      <div className="category-page__loading">
        <div className="news-detail__spinner-box">
          <div className="news-detail__spinner"></div>
          <p className="mt-4 text-slate-600 font-medium">Đang chuẩn bị nội dung...</p>
        </div>
      </div>
    );
  }

  if (!category) return null;

  return (
    <section className="category-page">
      {/* Cinematic Hero */}
      <div className="category-page__hero">
        <div className="category-page__hero-background">
          <div
            className="category-page__hero-image"
            style={{ backgroundImage: heroBackground }}
          />
          <div className="category-page__hero-overlay" />
        </div>

        <div className="category-page__hero-content">
          <p className="category-page__hero-subtitle">Chuyên mục</p>
          <h1 className="category-page__hero-title">{category.title}</h1>
          <p className="category-page__hero-description">
            {category.description} Khám phá những bài viết sâu sắc nhất về chủ đề này tại Smovie.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="category-page__breadcrumb-bar">
        <div className="category-page__breadcrumb-container">
          <nav className="category-page__breadcrumb">
            <Link to="/" className="category-page__breadcrumb-link">Trang chủ</Link>
            <span className="category-page__breadcrumb-separator">/</span>
            <Link to="/news" className="category-page__breadcrumb-link">Tin tức</Link>
            <span className="category-page__breadcrumb-separator">/</span>
            <span className="category-page__breadcrumb-current">{category.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Stream */}
      <div className="category-page__content">
        <div className="category-page__container">
          <div className="category-page__main-stream">
            <div className="category-page__header">
              <div>
                <p className="category-page__header-subtitle">Category</p>
                <h2 className="category-page__header-title">{category.title}</h2>
              </div>
              <div className="category-page__count">
                {news.length} bài viết
              </div>
            </div>

            {news.length > 0 ? (
              <div className="category-page__list">
                {news.map((item) => (
                  <NewsItem key={item.id} {...item} />
                ))}
              </div>
            ) : (
              <div className="category-page__empty">
                <p className="category-page__empty-text">Chưa có bài viết nào trong chuyên mục này.</p>
                <Link to="/news" className="category-page__back-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg)' }}>
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Quay lại trang tin tức
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
