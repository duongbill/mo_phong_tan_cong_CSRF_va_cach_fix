import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Snackbar,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../context/AuthContext';

const RewardBanner = () => {
  const { user } = useAuth();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Chỉ hiển thị banner nếu user đã đăng nhập
    if (!user) {
      setShowBanner(false);
      return;
    }

    // Hiển thị banner mỗi 3 giây liên tục nếu user không đóng
    const timer = setInterval(() => {
      setShowBanner(true);
    }, 3000);

    return () => clearInterval(timer);
  }, [user]);

  const handleBannerClick = () => {
    // Mở form attack hoặc xử lý thưởng
    console.log('User clicked on reward banner');
    // Có thể thêm logic tại đây nếu cần
  };

  return (
    <Snackbar
      open={showBanner}
      autoHideDuration={3000}
      onClose={() => setShowBanner(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        '& .MuiSnackbarContent-root': {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
        },
      }}
    >
      <Paper
        onClick={handleBannerClick}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px 30px',
          borderRadius: '15px',
          border: '3px solid #FFD700',
          maxWidth: '450px',
          cursor: 'pointer',
          position: 'relative',
          marginTop: '20px',
          boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)',
          transition: 'all 0.3s ease',
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
  );
};

export default RewardBanner;
