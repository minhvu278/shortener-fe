"use client";

import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  ToggleButtonGroup,
  Paper,
  Modal,
} from "@mui/material";
import axios from "axios";
import theme from "@/lib/theme";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import QrCodeIcon from "@mui/icons-material/QrCode";
import StatsSection from "@/components/home/stats-section";
import { useRouter } from "next/navigation";

const ShortenForm = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleShorten = async () => {
    if (!originalUrl) {
      setError("Vui lòng nhập URL hợp lệ");
      return;
    }

    if (!isLoggedIn) {
      setOpenModal(true);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/links`,
        { originalUrl },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setShortCode(response.data.shortUrl);
      setQrCode(response.data.qrCode);
    } catch (error) {
      setError("Không thể rút gọn URL. Vui lòng thử lại.");
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
          Sử dụng trình rút gọn URL, Mã QR và link đích của chúng tôi để thu hút khách hàng.
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

        <Paper sx={{ maxWidth: "500px", mx: "auto", p: 3, borderRadius: "16px" }}>
          <Typography variant="h5" fontWeight="bold">
            Rút ngắn một liên kết dài
          </Typography>
          <TextField
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            fullWidth
            placeholder="https://example.com/my-long-url"
            variant="outlined"
            sx={{ mb: 2, bgcolor: "white", borderRadius: "8px" }}
          />
          <Button
            variant="contained"
            sx={{ px: 4, borderRadius: "8px" }}
            onClick={handleShorten}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Nhận liên kết của bạn miễn phí →"}
          </Button>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          {shortCode && (
            <Box mt={3} textAlign="center">
              <Typography variant="h6">
                URL rút gọn: <a href={shortCode}>{shortCode}</a>
              </Typography>
              {qrCode && <img src={qrCode} alt="QR Code" width="180" height="180" />}
            </Box>
          )}
        </Paper>
      </Box>

      <StatsSection />

      {/* Modal yêu cầu đăng nhập */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 4,
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Vui lòng đăng nhập hoặc đăng ký để tạo link
          </Typography>
          <Button
            variant="contained"
            sx={{ mr: 2 }}
            onClick={() => router.push("/login")}
          >
            Đăng nhập
          </Button>
          <Button variant="outlined" onClick={() => router.push("/register")}>
            Đăng ký
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ShortenForm;
