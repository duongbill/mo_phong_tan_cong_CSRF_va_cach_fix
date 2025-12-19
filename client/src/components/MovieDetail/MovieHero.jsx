import React from 'react';
import { useNavigate } from 'react-router-dom';

const formatDate = (value) => {
  if (!value) return 'Đang cập nhật';
  return new Date(value).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export default function MovieHero({ movie }) {
  const navigate = useNavigate();
  const rating = typeof movie.rating === 'number' ? movie.rating : 0;
  const ratingPercent = Math.round((rating / 10) * 100);

  const handleBooking = () => {
    navigate(`/coming-soon`);
  };

  return (
    <section className="movie-hero">
      <div
        className="movie-hero__backdrop"
        style={{
          backgroundImage: `url(${movie.backdrop || movie.poster})`,
        }}
        aria-hidden
      />
      <div className="movie-hero__overlay" />

      <div className="movie-hero__content container">
        <div className="movie-hero__poster-card">
          <img src={movie.poster} alt={movie.title} loading="lazy" />
          <span className="movie-hero__badge">ĐƯỢC TÀI TRỢ</span>
          <button
            type="button"
            className="movie-hero__favorite"
            aria-label="Thêm vào danh sách yêu thích"
          >
            ♡
          </button>
        </div>

        <div className="movie-hero__info">
          <p className="movie-hero__eyebrow">Phim đang chiếu tại Moveek</p>
          <h1 className="movie-hero__title">{movie.title}</h1>
          {(movie.tagline || movie.description) && (
            <p className="movie-hero__description">
              {movie.tagline || movie.description}
            </p>
          )}

          <div className="movie-hero__stats">
            <div className="stat-card">
              <span>Đánh giá</span>
              <strong>{rating.toFixed(1)}/10</strong>
              <small>{movie.ratingCount || 'Chưa có'} lượt đánh giá</small>
            </div>
            <div className="stat-card">
              <span>Mức độ yêu thích</span>
              <strong>{ratingPercent || 0}%</strong>
              <small>Dựa trên cộng đồng Moveek</small>
            </div>
            {movie.ageRating && (
              <div className="stat-card">
                <span>Kiểm duyệt</span>
                <strong>{movie.ageRating}</strong>
                <small>Giới hạn độ tuổi</small>
              </div>
            )}
          </div>

          <div className="movie-hero__tags">
            {movie.genres?.map((genre) => (
              <span key={genre}>{genre}</span>
            ))}
            {movie.language && <span>{movie.language}</span>}
            {movie.format && <span>{movie.format}</span>}
          </div>

          <div className="movie-hero__highlights">
            <div>
              <span>Khởi chiếu</span>
              <strong>{formatDate(movie.releaseDate)}</strong>
            </div>
            <div>
              <span>Thời lượng</span>
              <strong>{movie.duration ? `${movie.duration} phút` : 'Đang cập nhật'}</strong>
            </div>
            {movie.director && (
              <div>
                <span>Đạo diễn</span>
                <strong>{movie.director}</strong>
              </div>
            )}
          </div>

          <div className="movie-hero__actions">
            <button
              type="button"
              className="movie-btn movie-btn--primary"
              onClick={handleBooking}
            >
              🎫 Đặt vé nhanh
            </button>
            <button type="button" className="movie-btn movie-btn--ghost" onClick={handleBooking}>
              📅 Xem lịch chiếu
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}