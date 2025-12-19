import { Link } from 'react-router-dom';

const filters = [
  { label: 'Phổ biến' },
  { label: 'Thể loại' },
  { label: 'Ngôn ngữ' },
];

const formatDate = (value) => {
  if (!value) return 'Đang cập nhật';
  return new Date(value).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
  });
};

export default function SimilarMovies({ movies }) {
  return (
    <section className="similar-movies">
      <div className="container">
        <div className="section-header section-header--light">
          <div>
            <p className="section-eyebrow section-eyebrow--light">Phim tương tự</p>
            <h2>Gợi ý cho bạn</h2>
          </div>
        </div>

        {/* <div className="similar-movies__controls">
          {filters.map((filter, index) => (
            <button
              type="button"
              key={filter.label}
              className={`filter-pill ${index === 0 ? 'is-active' : ''}`}
            >
              {filter.label}
              <span aria-hidden>▾</span>
            </button>
          ))}
        </div> */}

        <div className="similar-movies__grid">
          {movies.map((movie) => {
            const rating = typeof movie.rating === 'number' ? movie.rating : 0;
            const ratingPercent = Math.round((rating / 10) * 100);

            return (
              <Link key={movie._id} to={`/movie/${movie._id}`} className="movie-card">
                <div className="movie-card__media">
                  <img src={movie.poster} alt={movie.title} loading="lazy" />
                  <span className="movie-card__badge">{formatDate(movie.releaseDate)}</span>
                  <button
                    type="button"
                    className="movie-card__favorite"
                    aria-label="Thêm vào danh sách yêu thích"
                  >
                    ♡
                  </button>
                </div>
                <div className="movie-card__body">
                  <p className="movie-card__title">{movie.title}</p>
                  <div className="movie-card__meta">
                    <span>{movie.genres?.[0] || 'Phim chiếu rạp'}</span>
                    <strong>{ratingPercent}%</strong>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}