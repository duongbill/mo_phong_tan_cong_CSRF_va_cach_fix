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
} from '@mui/material';
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

  const fetchProfile = async () => {
    try {
      const data = await profileService.getProfile();
  console.log('Dữ liệu hồ sơ:', JSON.stringify(data));
      setFormData({
        username: data.username,
        email: data.email,
        bio: data.bio || '',
      });
      setError('');
    } catch (error) {
      setError('Không thể tải hồ sơ');
    }
  };

  useEffect(() => {
    fetchProfile();
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
      setSuccess('Hồ sơ được cập nhật thành công');
    } catch (error) {
      setError(error.response?.data?.message || 'Không thể cập nhật hồ sơ');
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
              Hồ Sơ
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
              label="Tên người dùng"
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
              label="Tiểu sử"
              name="bio"
              multiline
              rows={4}
              margin="normal"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Hãy kể về bạn..."
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3 }}
            >
              Cập Nhật Hồ Sơ
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile;