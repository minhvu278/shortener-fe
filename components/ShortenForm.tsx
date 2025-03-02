"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Modal,
} from "@mui/material";
import theme from "@/lib/theme";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import QrCodeIcon from "@mui/icons-material/QrCode";
import StatsSection from "@/components/home/stats-section";
import { useRouter } from "next/navigation";

const ShortenForm = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const router = useRouter();

  const handleShorten = async () => {
    if (!originalUrl) {
      setError("Vui lòng nhập URL hợp lệ");
      return;
    }

    setOpenModal(true);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <Box sx={{ textAlign: "center", backgroundColor: theme.palette.primary.main, color: "white", py: 6 }}>
        <Typography variant="h4" fontWeight="bold">
          Xây dựng kết nối kỹ thuật số mạnh mẽ hơn
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, mb: 3, maxWidth: "620px", mx: "auto" }}>
          Sử dụng trình rút gọn URL, Mã QR và link đích của chúng tôi để thu hút khách hàng.
        </Typography>

        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          centered
          sx={{
            mb: 3,
            "& .MuiTab-root": {
              color: "white",
              fontWeight: "bold",
              textTransform: "none",
              "&.Mui-selected": {
                color: theme.palette.primary.dark,
                bgcolor: "white",
                borderRadius: "8px 8px 0 0",
              },
            },
            "& .MuiTabs-indicator": {
              display: "none",
            },
          }}
        >
          <Tab
            icon={<InsertLinkIcon />}
            iconPosition="start"
            label="Link ngắn"
            sx={{ px: 3 }}
          />
          <Tab
            icon={<QrCodeIcon />}
            iconPosition="start"
            label="QR Code"
            sx={{ px: 3 }}
          />
        </Tabs>

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
            sx={{ px: 4, borderRadius: "8px", bgcolor: theme.palette.primary.main }}
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
        </Paper>
      </Box>

      <StatsSection />

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
          <Button variant="contained" sx={{ mr: 2 }} onClick={() => router.push("/login")}>
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
