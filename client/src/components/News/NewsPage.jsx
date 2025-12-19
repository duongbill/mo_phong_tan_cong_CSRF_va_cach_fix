import { useState, useEffect } from 'react';
import NewsItem from './NewsItem';
import CategoryCard from './CategoryCard';
import { newsList, categories } from './dataNews';
import './NewsPage.css';

// Ảnh nền cinematic chất lượng cao, sang trọng (Rạp phim hoặc không gian điện ảnh)
const heroBackground = 'url("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2000&q=80")';

export default function NewsPage() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      const data = await newsList();
      setNews(data);
    };

    fetchNews();
  }, []);

  return (
    <section className="news-page">
      {/* Cinematic Hero với ảnh nền mới và overlay chuyên dụng */}
      <div className="news-page__hero">
        <div className="news-page__hero-background">
          <div
            className="news-page__hero-image"
            style={{ backgroundImage: heroBackground }}
          />
          {/* Overlay tối dần về phía dưới để text trắng nổi bật và tiệp vào nội dung dưới */}
          <div className="news-page__hero-overlay" />
        </div>

        <div className="news-page__hero-shapes">
          <div className="news-page__hero-shape news-page__hero-shape--1" />
          <div className="news-page__hero-shape news-page__hero-shape--2" />
        </div>

        <div className="news-page__hero-content">
          <div className="news-page__hero-badge">
            <span className="news-page__hero-dot" />
            Spotlight 2026
          </div>
          <h1 className="news-page__hero-title">
            <span>Thế Giới Điện Ảnh</span>
            <span>Trong Tầm Tay</span>
          </h1>
          <p className="news-page__hero-description">
            Khám phá những tin tức sốt dẻo, đánh giá chuyên sâu và khoảnh khắc hậu trường chưa từng công bố từ Smovie Studio.
          </p>
        </div>
      </div>

      <div className="news-page__content">
        <div className="news-page__container">
          <div className="news-page__grid">
            {/* Luồng tin chính */}
            <div className="news-page__main-stream">
              <div className="news-page__main-header">
                <div>
                  <p className="news-page__main-label">Hot News</p>
                  <h2 className="news-page__main-title">Tin điện ảnh mới nhất</h2>
                </div>
                <div className="news-page__article-count">
                  {news.length} bài viết
                </div>
              </div>

              <div className="news-page__news-list">
                {news.map((item) => (
                  <NewsItem key={item.id} {...item} />
                ))}
              </div>
            </div>

            {/* Sidebar điều hướng */}
            <aside className="news-page__sidebar">
              <div className="news-page__sidebar-card">
                <h3 className="news-page__sidebar-section-title">Chuyên mục</h3>
                <p className="news-page__sidebar-intro">
                  Tìm kiếm bài viết theo chủ đề bạn đang quan tâm nhất.
                </p>

                <div className="news-page__categories-list">
                  {categories.map((cat) => (
                    <CategoryCard key={cat.id} {...cat} />
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
