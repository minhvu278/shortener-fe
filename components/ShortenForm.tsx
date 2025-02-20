'use client';

import { useState } from 'react';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { api } from '@/utils/api';

const ShortenForm = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [loading, setLoading] = useState(false);
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
    } catch (error) {
      console.error('Lỗi:', error);
      setError('Không thể rút gọn URL. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box textAlign="center" sx={{ maxWidth: 500, margin: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom>Rút gọn URL</Typography>
      <TextField
        fullWidth
        label="Nhập URL"
        variant="outlined"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleShorten} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Rút gọn'}
      </Button>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {shortCode && (
        <Typography variant="h6" sx={{ mt: 3 }}>
          URL rút gọn: <a href={shortCode} target="_blank" rel="noopener noreferrer">{shortCode}</a>
        </Typography>
      )}
    </Box>
  );
};

export default ShortenForm;
