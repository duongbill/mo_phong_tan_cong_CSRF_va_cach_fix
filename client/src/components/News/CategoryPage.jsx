import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import NewsItem from './NewsItem';
import { newsList, categories } from './dataNews';

const heroBackground =
  'linear-gradient(180deg, rgba(3, 6, 23, 0.95) 0%, rgba(3, 6, 23, 0.80) 50%, rgba(238, 242, 248, 1) 100%), url("https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=2000&q=80")';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Tìm category
        const foundCategory = categories.find((cat) => cat.id === categoryId);
        if (!foundCategory) {
          navigate('/news');
          return;
        }
        setCategory(foundCategory);

        // Lấy tất cả tin tức và lọc theo category
        const allNews = await newsList();
        // Vì hiện tại dataNews không có category mapping chính xác,
        // chúng ta sẽ hiển thị tất cả tin tức hoặc có thể filter theo logic khác
        setNews(allNews);
      } catch (error) {
        console.error('Error fetching category news:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchData();
    }
  }, [categoryId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eef2f8] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <section className="relative min-h-screen bg-[#eef2f8]">
      {/* Header */}
      <div className="relative isolate w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-top"
          style={{
            backgroundImage: heroBackground,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-[#eef2f8]" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center text-white sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-primary-100">
            Chuyên mục
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">{category.title}</h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-slate-100/90 sm:text-lg">
            {category.description}
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-600">
            <Link to="/" className="transition hover:text-primary-600">
              Trang chủ
            </Link>
            <span>/</span>
            <Link to="/news" className="transition hover:text-primary-600">
              Tin tức
            </Link>
            <span>/</span>
            <span className="text-slate-400">{category.title}</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="relative -mt-16 pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-white/60 bg-white/95 p-6 shadow-2xl shadow-slate-200/70 ring-1 ring-slate-100/70 backdrop-blur-sm sm:p-8">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.45em] text-primary-500">
                  {category.title}
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                  Tất cả bài viết trong chuyên mục
                </h2>
              </div>
              <span className="rounded-full bg-slate-100 px-4 py-1 text-sm font-medium text-slate-600">
                {news.length} bài viết
              </span>
            </div>

            {news.length > 0 ? (
              <div className="space-y-5">
                {news.map((item) => (
                  <NewsItem key={item.id} {...item} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-slate-600">Chưa có bài viết nào trong chuyên mục này.</p>
                <Link
                  to="/news"
                  className="mt-4 inline-flex items-center gap-2 text-primary-600 transition hover:text-primary-700"
                >
                  <span>←</span>
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

