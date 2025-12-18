import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { MovieFilter as MovieIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    handleClose();
  };

  return (
    <AppBar position="fixed">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: '64px' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1,
              gap: 4
            }}
          >
            <Typography
              variant="h6"
              component="div"
              onClick={() => navigate('/')}
              sx={{
                fontWeight: 700,
                fontSize: '1.5rem',
                color: 'primary.main',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              Smovie
            </Typography>

            <Box sx={{ display: 'flex', gap: 3 }}>
              <Button
                color="inherit"
                onClick={() => navigate('/movies')}
                sx={{ 
                  color: 'text.primary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                Phim đang chiếu
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/news')}
                sx={{ 
                  color: 'text.primary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                Tin tức  
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/reviews')}
                sx={{ 
                  color: 'text.primary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                Giới thiệu
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user ? (
              <>
                <IconButton
                  onClick={handleMenu}
                  size="small"
                  sx={{ 
                    ml: 2,
                    border: '1.5px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'primary.main',
                      fontSize: '0.875rem',
                      fontWeight: 500
                    }}
                  >
                    {user.username?.[0]}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  PaperProps={{
                    elevation: 2,
                    sx: {
                      mt: 1,
                      minWidth: 180,
                      borderRadius: 2,
                      '& .MuiMenuItem-root': {
                        px: 2,
                        py: 1,
                        fontSize: '0.875rem',
                      }
                    }
                  }}
                >
                  <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                    Tài khoản của tôi
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/bookings'); handleClose(); }}>
                    Đơn đặt vé
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    Đăng xuất
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  color="inherit"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    color: 'text.primary',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  Đăng nhập
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/register')}
                >
                  Đăng ký
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;