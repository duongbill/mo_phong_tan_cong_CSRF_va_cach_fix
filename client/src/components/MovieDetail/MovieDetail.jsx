import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import MovieHero from './MovieHero';
import MovieInfo from './MovieInfo';
import CastList from './CastList';
import Trailer from './Trailer';
import SimilarMovies from './SimilarMovies';
import './MovieDetail.css';
import { movieService } from '../../services/api';

export default function MovieDetail() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) {
      navigate('/');
      return;
    }

    let ignore = false;

    const fetchMovie = async () => {
      try {
        const movie = await movieService.getMovieById(movieId);
        const similarMovies = await movieService.getSimilarMovies(movieId);
        if (ignore) return;
        setMovie(movie);
        setSimilarMovies(similarMovies);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    fetchMovie();

    return () => {
      ignore = true;
    };
  }, [movieId, navigate]);

  if (loading) {
    return (
      <div className="movie-detail-page movie-detail-page--centered">
        <div className="movie-status-card">
          <span className="movie-status-card__label">Đang tải dữ liệu</span>
          <p className="movie-status-card__message">
            Vui lòng chờ trong giây lát...
          </p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="movie-detail-page movie-detail-page--centered">
        <div className="movie-status-card movie-status-card--error">
          <span className="movie-status-card__label">Không tìm thấy phim</span>
          <p className="movie-status-card__message">
            {error || 'Có vẻ như phim bạn tìm kiếm hiện không tồn tại.'}
          </p>
          <button
            type="button"
            className="movie-btn movie-btn--primary"
            onClick={() => navigate('/')}
          >
            Quay lại trang phim
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-detail-page">
      <MovieHero movie={movie} />
      <div className="movie-detail-shell">
        <div className="container">
          <div className="movie-detail-content">
            <MovieInfo movie={movie} />
            {movie.cast?.length > 0 && <CastList cast={movie.cast} />}
            {movie.videoUrl && <Trailer videoUrl={movie.videoUrl} />}
          </div>
        </div>
      </div>
      {similarMovies.length > 0 && <SimilarMovies movies={similarMovies} />}
    </div>
  );
}