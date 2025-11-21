import { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Container,
  Stack,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LocalPlayIcon from '@mui/icons-material/LocalPlay';
import { movieService } from '../services/api';
import image1 from '../assets/1.jpg';
import image2 from '../assets/2.jpg';
import image3 from '../assets/3.jpg';
import image4 from '../assets/4.jpg';

const MovieGrid = () => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);
  const [movies, setMovies] = useState([]); // was using hardcoded movies
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreMenuAnchor, setGenreMenuAnchor] = useState(null);

  // map fallback images if API poster missing
  const fallbacks = [image1, image2, image3, image4];

  useEffect(() => {
    let mounted = true;
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await movieService.getMovies();
        if (!mounted) return;

        const mapped = data.map((m, idx) => ({
          id: m._id || m.id || idx,
          title: m.title || m.name || 'Untitled',
          releaseDate: m.releaseDate
            ? new Date(m.releaseDate).toLocaleDateString('vi-VN')
            : m.release || m.year || '',
          rating: Math.round((m.rating || 0) * 10), // convert 0-10 to percentage if needed
          imageUrl: m.poster || m.posterUrl || m.imageUrl || fallbacks[idx % fallbacks.length],
          genres: m.genres || [],
        }));

        setMovies(mapped);
        setError(null);
      } catch (err) {
        console.error('Fetch movies error:', err);
        setError('Không thể tải danh sách phim');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
    return () => {
      mounted = false;
    };
  }, []);

  // Lấy danh sách tất cả các thể loại duy nhất từ movies
  // Phải đặt trước các câu lệnh return sớm để tuân thủ Rules of Hooks
  const allGenres = useMemo(() => {
    const genreSet = new Set();
    movies.forEach((movie) => {
      if (movie.genres && Array.isArray(movie.genres)) {
        movie.genres.forEach((genre) => genreSet.add(genre));
      }
    });
    return Array.from(genreSet).sort();
  }, [movies]);

  // Lọc phim theo thể loại đã chọn
  const filteredMovies = useMemo(() => {
    if (!selectedGenre) return movies;
    return movies.filter((movie) => 
      movie.genres && 
      Array.isArray(movie.genres) && 
      movie.genres.includes(selectedGenre)
    );
  }, [movies, selectedGenre]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography>Đang tải phim...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  const enhanceMovies = filteredMovies.map((movie, idx) => ({
    ...movie,
    badge: idx === 0 ? 'Được tài trợ' : idx % 3 === 0 ? 'Hot' : '',
    supportText: idx === 0 ? '97%' : undefined,
  }));

  const handleGenreMenuOpen = (event) => {
    setGenreMenuAnchor(event.currentTarget);
  };

  const handleGenreMenuClose = () => {
    setGenreMenuAnchor(null);
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre === selectedGenre ? null : genre);
    handleGenreMenuClose();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f8fbff 0%, #ffffff 60%)',
          p: { xs: 3, md: 4 },
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography sx={{ color: 'primary.main', fontWeight: 600, mb: 1 }}>
              Đặt vé phim chiếu rạp
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Phim đang chiếu
            </Typography>
            <Typography color="text.secondary">
              Danh sách các phim hiện đang chiếu rộng rãi. Xem lịch chiếu, giá vé tiện lợi, đặt vé
              nhanh với 1 bước!
            </Typography>
          </Box>
          <Button
            variant="contained"
            endIcon={<LocalPlayIcon />}
            sx={{ alignSelf: { xs: 'flex-start', md: 'center' } }}
          >
            Đặt vé nhanh
          </Button>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            variant="outlined"
            endIcon={<KeyboardArrowDownIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              color: 'text.primary',
              borderColor: '#dfe3eb',
              flex: { xs: '1 1 auto', sm: '0 0 auto' },
            }}
          >
            Phổ biến
          </Button>
          <Button
            variant={selectedGenre ? "contained" : "outlined"}
            endIcon={<KeyboardArrowDownIcon />}
            onClick={handleGenreMenuOpen}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              color: selectedGenre ? 'white' : 'text.primary',
              borderColor: '#dfe3eb',
              flex: { xs: '1 1 auto', sm: '0 0 auto' },
            }}
          >
            {selectedGenre ? `Thể loại: ${selectedGenre}` : 'Thể loại'}
          </Button>
          <Menu
            anchorEl={genreMenuAnchor}
            open={Boolean(genreMenuAnchor)}
            onClose={handleGenreMenuClose}
            PaperProps={{
              sx: {
                maxHeight: 400,
                width: '250px',
              },
            }}
          >
            <MenuItem 
              onClick={() => handleGenreSelect(null)}
              selected={!selectedGenre}
            >
              Tất cả thể loại
            </MenuItem>
            {allGenres.map((genre) => (
              <MenuItem
                key={genre}
                onClick={() => handleGenreSelect(genre)}
                selected={genre === selectedGenre}
              >
                {genre}
              </MenuItem>
            ))}
          </Menu>
          <Button
            variant="outlined"
            endIcon={<KeyboardArrowDownIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              color: 'text.primary',
              borderColor: '#dfe3eb',
              flex: { xs: '1 1 auto', sm: '0 0 auto' },
            }}
          >
            Ngôn ngữ
          </Button>
        </Stack>
      </Box>

      <Box
        component="section"
        sx={{
          display: 'grid',
          gap: { xs: 2, md: 3 },
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        }}
      >
        {enhanceMovies.map((movie) => (
          <Card
            key={movie.id}
            onMouseEnter={() => setHoveredId(movie.id)}
            onMouseLeave={() => setHoveredId(null)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              boxShadow: '0 20px 50px rgba(15,23,42,0.08)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              minHeight: 420,
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: '0 35px 65px rgba(15,23,42,0.15)',
              },
            }}
          >
            <Box sx={{ position: 'relative' }}>
              {movie.badge && (
                <Chip
                  label={movie.badge}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    backgroundColor: movie.badge === 'Được tài trợ' ? '#ff4757' : '#ffa502',
                    color: '#fff',
                    zIndex: 2,
                    fontWeight: 600,
                  }}
                />
              )}

              <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>
                <IconButton size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
                  <FavoriteBorderIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
                  <BookmarkBorderIcon fontSize="small" />
                </IconButton>
              </Stack>

              <CardMedia
                component="img"
                image={movie.imageUrl}
                alt={movie.title}
                sx={{
                  width: '100%',
                  aspectRatio: '2 / 3',
                  objectFit: 'cover',
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  backgroundColor: '#0f172a',
                }}
              />

              {hoveredId === movie.id && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 2,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  >
                    Xem chi tiết
                  </Button>
                </Box>
              )}
            </Box>

            <CardContent sx={{ flexGrow: 1, pt: 3 }}>
              <Typography
                gutterBottom
                variant="h6"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  mb: 1,
                  minHeight: '3rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {movie.title}
              </Typography>

              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {movie.releaseDate}
                  </Typography>
                  <Chip
                    label={`${movie.rating}%`}
                    size="small"
                    color={movie.rating >= 70 ? 'success' : movie.rating >= 50 ? 'warning' : 'error'}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                {movie.supportText && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: 'success.main',
                      }}
                    />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {movie.supportText} người thích
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default MovieGrid;