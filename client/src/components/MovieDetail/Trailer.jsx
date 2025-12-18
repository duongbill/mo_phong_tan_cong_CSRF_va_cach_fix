const isYoutubeUrl = (url = '') =>
  url.includes('youtube.com') || url.includes('youtu.be');

const getEmbedUrl = (url) => {
  if (!url) return '';
  if (!isYoutubeUrl(url)) return url;
  const videoId = url.includes('youtube.com')
    ? new URL(url).searchParams.get('v')
    : url.split('/').pop();
  return `https://www.youtube.com/embed/${videoId}`;
};

export default function Trailer({ videoUrl }) {
  return (
    <section className="movie-section">
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Trailer</p>
          <h2>Xem trước</h2>
        </div>
        <a
          className="movie-btn movie-btn--link"
          href={videoUrl}
          target="_blank"
          rel="noreferrer"
        >
          Mở trên YouTube
        </a>
      </div>

      <div className="trailer-frame">
        {isYoutubeUrl(videoUrl) ? (
          <iframe
            src={getEmbedUrl(videoUrl)}
            title="Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            controls
            src={videoUrl}
            title="Trailer"
            poster="/poster"
            autoPlay
            playsInline
          />
        )}
      </div>
    </section>
  );
}