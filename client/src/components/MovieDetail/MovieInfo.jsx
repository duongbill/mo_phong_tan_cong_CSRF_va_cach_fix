const readable = (value, fallback = 'Đang cập nhật') => {
  if (!value || (Array.isArray(value) && value.length === 0)) return fallback;
  return Array.isArray(value) ? value.join(', ') : value;
};

export default function MovieInfo({ movie }) {
  const infoRows = [
    { label: 'Thể loại', value: readable(movie.genres) },
    { label: 'Định dạng', value: readable(movie.format || movie.resolution) },
    { label: 'Ngôn ngữ', value: readable(movie.language) },
    { label: 'Nhà sản xuất', value: readable(movie.producer) },
    { label: 'Quốc gia', value: readable(movie.country) },
    { label: 'Diễn viên chính', value: readable(movie.leadActors) },
  ];

  return (
    <section className="movie-section">
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Nội dung nổi bật</p>
          <h2>Giới thiệu</h2>
        </div>
        <button type="button" className="movie-btn movie-btn--link">
          Chia sẻ bạn bè
        </button>
      </div>

      {movie.description && (
        <p className="movie-section__lead">{movie.description}</p>
      )}

      <div className="movie-info__grid">
        {infoRows.map(({ label, value }) => (
          <div key={label} className="movie-info-card">
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}