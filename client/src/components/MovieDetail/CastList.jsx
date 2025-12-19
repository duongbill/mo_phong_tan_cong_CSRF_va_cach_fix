const getInitials = (name = '') =>
  name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export default function CastList({ cast }) {
  return (
    <section className="movie-section">
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Dàn diễn viên</p>
          <h2>Diễn Viên & Êkip</h2>
        </div>
        <button type="button" className="movie-btn movie-btn--link">
          Xem tất cả
        </button>
      </div>

      <div className="cast-carousel">
        {cast.map((actor, idx) => (
          <div key={`${actor.name}-${idx}`} className="cast-card">
            <div className="cast-card__avatar">
              {actor.avatar ? (
                <img src={actor.avatar} alt={actor.name} loading="lazy" />
              ) : (
                <span>{getInitials(actor.name)}</span>
              )}
            </div>
            <p className="cast-card__name">{actor.name}</p>
            <p className="cast-card__role">
              {actor.character || actor.role || 'Diễn viên'}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}