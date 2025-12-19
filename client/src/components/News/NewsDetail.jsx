import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getNewsById, newsList } from './dataNews';
import './NewsDetail.css';

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const newsData = await getNewsById(id);
        if (!newsData) {
          setError('Không tìm thấy bài viết');
          setLoading(false);
          return;
        }
        setNews(newsData);

        // Lấy tin tức liên quan
        const allNews = await newsList();
        const related = allNews
          .filter((item) => item.id !== newsData.id)
          .slice(0, 3);
        setRelatedNews(related);
        setError(null);
      } catch (err) {
        setError(err.message || 'Có lỗi xảy ra khi tải bài viết');
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };

    if (id) {
      fetchNews();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="news-detail__loading">
        <div className="news-detail__spinner-box">
          <div className="news-detail__spinner"></div>
          <p className="mt-4 text-slate-600 font-medium">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="news-detail__error">
        <div className="news-detail__error-card">
          <h2 className="news-detail__error-title">
            {error || 'Không tìm thấy bài viết'}
          </h2>
          <p className="news-detail__error-desc">
            Có vẻ như bài viết bạn tìm kiếm hiện không tồn tại hoặc đã bị gỡ bỏ.
          </p>
          <Link
            to="/news"
            className="news-detail__error-btn"
          >
            Quay lại trang tin tức
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="news-detail">
      {/* Breadcrumb bar */}
      <div className="news-detail__breadcrumb-bar">
        <div className="news-detail__breadcrumb-container">
          <nav className="news-detail__breadcrumb">
            <Link to="/" className="news-detail__breadcrumb-link">Trang chủ</Link>
            <span className="news-detail__breadcrumb-separator">/</span>
            <Link to="/news" className="news-detail__breadcrumb-link">Tin tức</Link>
            <span className="news-detail__breadcrumb-separator">/</span>
            <span className="news-detail__breadcrumb-current">{news.title}</span>
          </nav>
        </div>
      </div>

      <div className="news-detail__main">
        <div className="news-detail__grid">
          {/* Main content */}
          <article className="news-detail__article">
            <header className="news-detail__header">
              <div className="news-detail__meta">
                <span className="news-detail__category">{news.category}</span>
                <span className="news-detail__dot" />
                <span>{news.author}</span>
                <span className="news-detail__dot" />
                <span>{news.time}</span>
              </div>

              <h1 className="news-detail__title">{news.title}</h1>
            </header>

            <div className="news-detail__image-wrapper">
              <img
                src={news.image}
                alt={news.title}
                className="news-detail__image"
              />
            </div>

            <div className="news-detail__content">
              <p className="news-detail__description">
                {news.description?.replace('...', '')}
              </p>

              <div className="news-detail__paragraph">
                Đây là một bài phân tích sâu về <strong>{news.title}</strong> từ đội ngũ biên tập của Smovie.
                Chúng tôi cung cấp những góc nhìn đa chiều, cập nhật những diễn biến mới nhất cũng như
                những đồn đoán từ giới mộ điệu điện ảnh.
              </div>

              <div className="news-detail__paragraph">
                Làng điện ảnh gần đây đang chứng kiến nhiều bước chuyển mình mạnh mẽ. Các nhà sản xuất liên tục
                đưa ra những chiến lược mới để thu hút khán giả quay trở lại rạp. Trong đó, dự án được nhắc tới
                trong bài viết này chính là một trong những tiêu điểm không thể bỏ qua.
              </div>

              <div className="news-detail__paragraph">
                Dưới góc độ chuyên môn, bài viết khẳng định tầm quan trọng của việc cập nhật tin tức chính thống
                và tránh những thông tin giả mạo. Hãy luôn là người tiêu dùng thông tin thông minh trong kỷ nguyên
                số hiện nay.
              </div>
            </div>

            <footer className="news-detail__footer">
              <div className="news-detail__author-box">
                <div className="news-detail__author-avatar">
                  {news.author.charAt(0)}
                </div>
                <div>
                  <p className="news-detail__author-name">{news.author}</p>
                  <p className="news-detail__author-label">Biên tập viên Smovie</p>
                </div>
              </div>
            </footer>
          </article>

          {/* Sidebar */}
          <aside className="news-detail__sidebar">
            {relatedNews.length > 0 && (
              <div className="news-detail__sidebar-card">
                <h3 className="news-detail__sidebar-title">Tin tức liên quan</h3>
                <div className="news-detail__related-list">
                  {relatedNews.map((item) => (
                    <Link
                      key={item.id}
                      to={`/news/${item.id}`}
                      className="news-detail__related-item"
                    >
                      <div className="news-detail__related-image-wrapper">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="news-detail__related-image"
                        />
                      </div>
                      <h4 className="news-detail__related-title">{item.title}</h4>
                      <p className="news-detail__related-time">{item.time}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

