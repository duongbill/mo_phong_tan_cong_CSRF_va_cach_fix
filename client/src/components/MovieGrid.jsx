import { useState } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Container,
  Rating,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import image1 from '../assets/1.jpg';
import image2 from '../assets/2.jpg';
import image3 from '../assets/3.jpg';
import image4 from '../assets/4.jpg';
import image5 from '../assets/5.jpg';
import image6 from '../assets/6.jpg';
// Sample movie data (replace with actual data from your API)
const movies = [
  {
    id: 1,
    title: 'Phá Đảo',
    releaseDate: '31/10',
    rating: 60,
    imageUrl: image1,
    isNowShowing: true,
  },
  {
    id: 2,
    title: 'Cái Mã',
    releaseDate: '31/10',
    rating: 60,
    imageUrl: image2,
    isNowShowing: true,
  },
  {
    id: 3,
    title: 'Cực Vàng Cực Ngọt',
    releaseDate: '17/10',
    rating: 89,
    imageUrl: image3,
    isNowShowing: true,
  },
  {
    id: 4,
    title: 'Nhà Ma Xó',
    releaseDate: '24/10',
    rating: 64,
    imageUrl: image4,
    isNowShowing: true,
  }
];

const MovieGrid = () => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h2" sx={{ fontSize: '1.75rem', fontWeight: 600 }}>
          Đang chiếu
        </Typography>
        <Button variant="text" color="primary" sx={{ fontWeight: 500 }}>
          Xem tất cả
        </Button>
      </Box>

      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={3} key={movie.id}>
            <Card
              onMouseEnter={() => setHoveredId(movie.id)}
              onMouseLeave={() => setHoveredId(null)}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height={350}
                  image={movie.imageUrl}
                  alt={movie.title}
                  sx={{ 
                    backgroundColor: '#eee',
                    objectFit: 'cover',
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
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
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
                      Mua vé
                    </Button>
                  </Box>
                )}
              </Box>

              <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                <Typography
                  gutterBottom
                  variant="h6"
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    mb: 1,
                    height: '3rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {movie.title}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {movie.releaseDate}
                  </Typography>
                  <Chip
                    label={`${movie.rating}%`}
                    size="small"
                    color={movie.rating >= 70 ? "success" : movie.rating >= 50 ? "warning" : "error"}
                    sx={{ fontWeight: 500 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MovieGrid;