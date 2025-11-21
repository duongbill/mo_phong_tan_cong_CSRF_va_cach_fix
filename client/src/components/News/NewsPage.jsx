import { useState, useEffect } from 'react';
import NewsItem from './NewsItem';
import CategoryCard from './CategoryCard';
import { newsList, categories } from './dataNews';
import './NewsPage.css';

const heroBackground =
  'linear-gradient(180deg, rgba(3, 6, 23, 0.95) 0%, rgba(3, 6, 23, 0.80) 50%, rgba(238, 242, 248, 1) 100%), url("https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=2000&q=80")';

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
      <div className="news-page__hero">
        <div
          className="news-page__hero-background"
          style={{
            backgroundImage: heroBackground,
          }}
        />
        <div className="news-page__hero-overlay" />
        <div className="news-page__hero-content">
          <p className="news-page__hero-subtitle">
            Tin tức điện ảnh Việt Nam & thế giới
          </p>
          <h1 className="news-page__hero-title">Tin điện ảnh</h1>
          <p className="news-page__hero-description">
            Cập nhật nhanh những câu chuyện nổi bật, đánh giá và trailer mới nhất của làng điện ảnh.
          </p>
        </div>
      </div>

      <div className="news-page__content">
        <div className="news-page__container">
          <div className="news-page__grid">
            <div className="news-page__main-card">
              <div className="news-page__main-header">
                <div className="news-page__main-header-content">
                  <p className="news-page__main-label">
                    Mới nhất
                  </p>
                  <h2 className="news-page__main-title">Tin điện ảnh hôm nay</h2>
                </div>
                <span className="news-page__article-count">
                  {news.length} bài viết
                </span>
              </div>

              <div className="news-page__news-list">
                {news.map((item) => (
                  <NewsItem key={item.id} {...item} />
                ))}
              </div>
            </div>

            <aside className="news-page__sidebar">
              <h3 className="news-page__sidebar-title">Chuyên mục</h3>
              <p className="news-page__sidebar-description">
                Khám phá các bài viết theo từng chủ đề yêu thích của bạn.
              </p>

              <div className="news-page__categories-list">
                {categories.map((cat) => (
                  <CategoryCard key={cat.id} {...cat} />
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

