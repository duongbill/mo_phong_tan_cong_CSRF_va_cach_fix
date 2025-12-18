import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Reviews from './components/Reviews';
import MovieGrid from './components/MovieGrid';
import ProtectedRoute from './components/ProtectedRoute';
import MovieDetail from './components/MovieDetail/MovieDetail';
import NewsPage from './components/News/NewsPage';
import NewsDetail from './components/News/NewsDetail';
import CategoryPage from './components/News/CategoryPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#cd1417',
      light: '#ff4d4f',
      dark: '#a70d10',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1f2937',
      light: '#374151',
      dark: '#111827',
    },
    background: {
      default: '#f3f4f6',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontSize: '2rem', 
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    }
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '8px 16px',
          fontSize: '0.9375rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05), 0px 4px 6px -1px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#111827',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <div className="app">
          <Navbar />
          <Box 
            component="main" 
            sx={{ 
              mt: '64px', 
              minHeight: 'calc(100vh - 64px)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<MovieGrid />} />
                <Route path="/movies" element={<MovieDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/movie/:movieId" element={<MovieDetail />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/category/:categoryId" element={<CategoryPage />} />
                <Route path="/news/:id" element={<NewsDetail />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
