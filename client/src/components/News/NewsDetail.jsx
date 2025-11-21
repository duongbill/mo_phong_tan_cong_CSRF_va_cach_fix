import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getNewsById, newsList } from './dataNews';

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
          .filter((item) => item.id !== parseInt(id))
          .slice(0, 3);
        setRelatedNews(related);
      } catch (err) {
        setError(err.message || 'Có lỗi xảy ra khi tải bài viết');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNews();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eef2f8] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-600">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-[#eef2f8] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              {error || 'Không tìm thấy bài viết'}
            </h2>
            <p className="text-slate-600 mb-6">
              Có vẻ như bài viết bạn tìm kiếm hiện không tồn tại.
            </p>
            <button
              onClick={() => navigate('/news')}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              <span>←</span>
              Quay lại trang tin tức
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#eef2f8]">
      {/* Header với breadcrumb */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-600">
            <Link
              to="/"
              className="transition hover:text-primary-600"
            >
              Trang chủ
            </Link>
            <span>/</span>
            <Link
              to="/news"
              className="transition hover:text-primary-600"
            >
              Tin tức
            </Link>
            <span>/</span>
            <span className="text-slate-400 truncate max-w-xs">{news.title}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          {/* Nội dung chính */}
          <article className="rounded-[32px] border border-white/60 bg-white/95 p-6 shadow-2xl shadow-slate-200/70 ring-1 ring-slate-100/70 backdrop-blur-sm sm:p-8 lg:p-10">
            {/* Header bài viết */}
            <header className="mb-8">
              <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                <span className="rounded-full bg-primary-100 px-3 py-1 text-primary-700">
                  {news.category}
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="normal-case tracking-normal">{news.author}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="normal-case tracking-normal">{news.time}</span>
              </div>

              <h1 className="mb-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                {news.title}
              </h1>
            </header>

            {/* Hình ảnh chính */}
            <div className="mb-8 overflow-hidden rounded-2xl bg-slate-100">
              <img
                src={news.image}
                alt={news.title}
                className="aspect-video w-full object-cover"
              />
            </div>

            {/* Nội dung bài viết */}
            <div className="prose prose-slate max-w-none">
              <div className="space-y-4 text-base leading-relaxed text-slate-700">
                <p className="text-lg font-medium text-slate-900">
                  {news.description?.replace('...', '')}
                </p>
                <p>
                  Đây là một bài viết chi tiết về {news.title}. Nội dung này cung cấp thông tin
                  đầy đủ và chi tiết về chủ đề được đề cập, giúp độc giả có cái nhìn toàn diện
                  về vấn đề.
                </p>
                <p>
                  Trong bài viết này, chúng ta sẽ khám phá các khía cạnh khác nhau của chủ đề,
                  từ những điểm nổi bật đến những chi tiết thú vị mà bạn có thể chưa biết.
                </p>
                <p>
                  Hy vọng rằng thông qua bài viết này, bạn sẽ có thêm nhiều thông tin hữu ích
                  và góc nhìn mới về chủ đề được đề cập.
                </p>
              </div>
            </div>

            {/* Footer bài viết */}
            <footer className="mt-10 border-t border-slate-200 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold">
                    {news.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{news.author}</p>
                    <p className="text-xs text-slate-500">Tác giả</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                    Chia sẻ
                  </button>
                  <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                    Lưu
                  </button>
                </div>
              </div>
            </footer>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Tin tức liên quan */}
            {relatedNews.length > 0 && (
              <div className="rounded-[32px] border border-white/60 bg-white/95 p-6 shadow-xl shadow-slate-200/80 ring-1 ring-slate-100/70 backdrop-blur-sm sm:p-8">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Tin tức liên quan</h3>
                <div className="space-y-4">
                  {relatedNews.map((item) => (
                    <Link
                      key={item.id}
                      to={`/news/${item.id}`}
                      className="group block rounded-xl border border-slate-200/80 bg-white/90 p-4 transition hover:border-primary-200 hover:shadow-md"
                    >
                      <div className="mb-3 overflow-hidden rounded-lg bg-slate-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="aspect-video w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>
                      <h4 className="mb-2 line-clamp-2 text-sm font-semibold text-slate-900 transition group-hover:text-primary-600">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500">{item.time}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Quảng cáo hoặc thông tin bổ sung */}
            <div className="rounded-[32px] border border-white/60 bg-gradient-to-br from-primary-50 to-primary-100/50 p-6 shadow-xl shadow-slate-200/80 ring-1 ring-slate-100/70 backdrop-blur-sm sm:p-8">
              <h3 className="mb-2 text-lg font-semibold text-slate-900">Đăng ký nhận tin</h3>
              <p className="mb-4 text-sm text-slate-600">
                Nhận thông báo về các bài viết mới nhất từ chúng tôi
              </p>
              <button className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700">
                Đăng ký ngay
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

