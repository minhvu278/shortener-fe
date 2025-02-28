"use client";

import { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import Image from "next/image";

export default function CreateQRCodePage() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [customBackHalf, setCustomBackHalf] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);

  const generateQRCode = async () => {
    if (!url) return;
    setLoading(true);

    try {
      // Sử dụng API để tạo QR code (có thể dùng backend của bạn)
      const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}`;
      setQrCode(qrApi);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }

    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Create a Bitly Code
      </Typography>

      <Grid container spacing={3}>
        {/* Cột trái - Form (8 phần) */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Enter URL
            </Typography>
            <TextField
              label="Destination"
              fullWidth
              variant="outlined"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Title (Optional)
            </Typography>
            <TextField
              label="Title"
              fullWidth
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Custom Back-Half (Optional)
            </Typography>
            <TextField
              label="Custom back-half"
              fullWidth
              variant="outlined"
              value={customBackHalf}
              onChange={(e) => setCustomBackHalf(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              fullWidth
              startIcon={<QrCodeIcon />}
              onClick={generateQRCode}
              disabled={!url || loading}
            >
              {loading ? <CircularProgress size={24} /> : "Generate QR Code"}
            </Button>
          </Card>
        </Grid>

        {/* Cột phải - Hiển thị QR Code (4 phần) */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" fontWeight="bold">
              Preview
            </Typography>

            {qrCode ? (
              <Image src={qrCode} alt="QR Code" width={250} height={250} />
            ) : (
              <Typography sx={{ mt: 2, color: "gray" }}>
                QR Code will appear here after you generate it.
              </Typography>
            )}

            <Typography variant="body2" sx={{ mt: 2, color: "gray" }}>
              This code is preview only. Your code will be generated once you finish creating it.
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
