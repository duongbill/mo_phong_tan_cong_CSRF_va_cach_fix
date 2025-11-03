import { Box, Container, Typography, Grid, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              color="primary"
              sx={{ fontWeight: 700, mb: 2 }}
            >
              Smovie
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Nền tảng đặt vé xem phim và kiểm soát phòng chiếu hàng đầu Việt Nam
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Liên kết
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/about" color="text.secondary" underline="hover">
                Về chúng tôi
              </Link>
              <Link href="/faq" color="text.secondary" underline="hover">
                Câu hỏi thường gặp
              </Link>
              <Link href="/terms" color="text.secondary" underline="hover">
                Điều khoản sử dụng
              </Link>
              <Link href="/privacy" color="text.secondary" underline="hover">
                Chính sách bảo mật
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Liên hệ
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Email: support@moveek.com
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Hotline: 1900 xxxx
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Giờ làm việc: 8:00 - 22:00
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Smovie. Tất cả quyền được bảo lưu.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;