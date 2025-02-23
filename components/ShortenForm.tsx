'use client';

import { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Paper
} from '@mui/material';
import { api } from '@/utils/api';
import theme from '@/lib/theme';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import QrCodeIcon from '@mui/icons-material/QrCode';
import StatsSection from '@/components/home/stats-section';

const ShortenForm = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState('');

  const handleShorten = async () => {
    if (!originalUrl) {
      setError('Vui lòng nhập URL hợp lệ');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.post('/links', { originalUrl });
      console.log(response);
      
      setShortCode(response.data.shortUrl);
      setQrCode(response.data.qrCode);
    } catch (error) {
      console.error('Lỗi:', error);
      setError('Không thể rút gọn URL. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const [selectedOption, setSelectedOption] = useState("short-link");

  return (
    <>
      <Box sx={{ textAlign: "center", backgroundColor: theme.palette.primary.main, color: "white", py: 6 }}>
        <Typography variant="h4" fontWeight="bold">
          Xây dựng kết nối kỹ thuật số mạnh mẽ hơn
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, mb: 3, maxWidth: "620px", mx: "auto" }}>
          Sử dụng trình rút gọn URL, Mã QR và link đích của chúng tôi để thu hút khách hàng và kết nối họ với thông tin phù hợp.
          Xây dựng, chỉnh sửa và theo dõi mọi thứ.
        </Typography>

        <ToggleButtonGroup
          value={selectedOption}
          exclusive
          onChange={(event, newValue) => newValue && setSelectedOption(newValue)}
          sx={{ mb: 3 }}
        >
          <Button value="short-link" sx={{ px: 3, color: theme.palette.primary.main, backgroundColor: theme.palette.secondary.main }}>
            <InsertLinkIcon sx={{ mr: 1 }} />
            Link ngắn
          </Button>
          <Button value="qr-code" sx={{ px: 3, color: theme.palette.secondary.main }}>
            <QrCodeIcon sx={{ mr: 1 }} />
            QR Code
          </Button>
        </ToggleButtonGroup>

        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "500px",
            mx: "auto",
            p: 3,
            borderRadius: "16px",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Rút ngắn một liên kết dài
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Không cần thẻ tín dụng.
          </Typography>

          <TextField
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            fullWidth
            placeholder="https://example.com/my-long-url"
            variant="outlined"
            sx={{ mb: 2, bgcolor: "white", borderRadius: "8px" }}
          />
          <Button variant="contained" sx={{ px: 4, borderRadius: "8px" }} onClick={handleShorten} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Nhận liên kết của bạn miễn phí →'}
          </Button>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          {shortCode && (
            <Box mt={3} textAlign="center">
              <Typography variant="h6">
                URL rút gọn: <a href={shortCode} target="_blank" rel="noopener noreferrer">{shortCode}</a>
              </Typography>

              {qrCode && (
                <Box mt={2}>
                  <Typography variant="body1">📲 Quét QR để truy cập:</Typography>
                  <img src={qrCode} alt="QR Code" width="180" height="180" />
                </Box>
              )}
            </Box>
          )}
        </Paper>

        <Typography variant="body2" sx={{ mt: 4 }}>
          Đăng ký miễn phí. Gói miễn phí của bạn bao gồm:
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "14px", mt: 1 }}>
          🔗 5 link ngắn/tháng &nbsp;&nbsp; | &nbsp;&nbsp; 🎨 Chỉnh thời gian hết hạn link &nbsp;&nbsp; | &nbsp;&nbsp; 📊 Nhấp vào liên kết không giới hạn
        </Typography>
      </Box>

      <StatsSection />
    </>
  );
};

export default ShortenForm;
