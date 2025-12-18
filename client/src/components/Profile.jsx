import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  Alert,
  Snackbar,
  Slide,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/api';

const Profile = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showBanner, setShowBanner] = useState(false);

  const fetchProfile = async () => {
    try {
      const data = await profileService.getProfile();
  console.log('Profile data:', JSON.stringify(data));
      setFormData({
        username: data.username,
        email: data.email,
        bio: data.bio || '',
      });
      setError('');
    } catch (error) {
      setError('Failed to load profile');
    }
  };

  useEffect(() => {
    fetchProfile();
    
    // Hiển thị banner sau 3 giây
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const updatedProfile = await profileService.updateProfile(formData);
      login({ ...user, ...updatedProfile });
      setSuccess('Profile updated successfully');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{ width: 100, height: 100, mb: 2 }}
              src={user?.avatar}
              alt={formData.username}
            />
            <Typography variant="h4" gutterBottom>
              Profile
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              sx={{ mt: 2 }}
              onClick={fetchProfile}
            >
              Làm mới
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              margin="normal"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              multiline
              rows={4}
              margin="normal"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3 }}
            >
              Update Profile
            </Button>
          </form>
        </Paper>
      </Box>

      {/* Notification Banner - Giả mạo quảng cáo */}
      <Snackbar
        open={showBanner}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Slide}
        sx={{ top: '20px !important' }}
      >
        <Paper
          onClick={() => {
            window.open('http://localhost:8080', '_blank');
            setShowBanner(false);
          }}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '20px 30px',
            borderRadius: '15px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            position: 'relative',
            minWidth: '400px',
            maxWidth: '500px',
            border: '3px solid #FFD700',
            animation: 'slideIn 0.5s ease-out, pulse 2s infinite 1s',
            '@keyframes slideIn': {
              from: {
                transform: 'translateY(-100%)',
                opacity: 0,
              },
              to: {
                transform: 'translateY(0)',
                opacity: 1,
              },
            },
            '@keyframes pulse': {
              '0%, 100%': {
                transform: 'scale(1)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
              },
              '50%': {
                transform: 'scale(1.02)',
                boxShadow: '0 15px 50px rgba(255,215,0,0.5)',
              },
            },
            '&:hover': {
              transform: 'scale(1.03)',
              boxShadow: '0 15px 50px rgba(255,215,0,0.6)',
            },
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setShowBanner(false);
            }}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              '&:hover': {
                background: 'rgba(255,255,255,0.2)',
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                fontSize: '50px',
                animation: 'rotate 3s linear infinite',
                '@keyframes rotate': {
                  from: { transform: 'rotate(0deg)' },
                  to: { transform: 'rotate(360deg)' },
                },
              }}
            >
              🎁
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  marginBottom: '5px',
                  fontSize: '1.3em',
                }}
              >
                🎉 CHÚC MỪNG! BẠN ĐÃ TRÚNG THƯỞNG!
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: '8px' }}>
                Bạn là người dùng thứ <strong>1000</strong> hôm nay
              </Typography>
              <Box
                sx={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '8px 15px',
                  borderRadius: '8px',
                  display: 'inline-block',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    color: '#FFD700',
                    fontSize: '1.4em',
                  }}
                >
                  💰 1.000.000 VNĐ
                </Typography>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  marginTop: '8px',
                  opacity: 0.9,
                }}
              >
                👆 Nhấn vào đây để nhận thưởng ngay!
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Snackbar>
    </Container>
  );
};

export default Profile;