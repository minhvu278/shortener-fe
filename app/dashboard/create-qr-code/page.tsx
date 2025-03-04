"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  Paper,
  Button,
  Tabs,
  Tab,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { QRCodeCanvas } from "qrcode.react";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";
import theme from "@/lib/theme";
import axios from "axios";
import { getCookie } from "@/lib/cookie";

export default function CreateQrCodePage() {
  const router = useRouter();
  const [originalUrl, setOriginalUrl] = useState("");
  const [title, setTitle] = useState("");
  const [createShortLink, setCreateShortLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [previewQrCode, setPreviewQrCode] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [openLimitPopup, setOpenLimitPopup] = useState(false);
  const [remainingLinks, setRemainingLinks] = useState<number | null>(null);

  const defaultQrCodeUrl = "http://103.221.221.110:5000";

  useEffect(() => {
    const fetchRemainingLinks = async () => {
      const token = getCookie("token");
      if (!token) return;

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/remaining-links`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRemainingLinks(response.data.remaining === Infinity ? null : response.data.remaining);
      } catch (err) {
        console.error("Failed to fetch remaining links:", err);
      }
    };

    fetchRemainingLinks();
  }, []);

  useEffect(() => {
    if (originalUrl) {
      setPreviewQrCode(originalUrl);
    } else {
      setPreviewQrCode(defaultQrCodeUrl);
    }
  }, [originalUrl]);

  const handleCreate = async () => {
    setLoading(true);
    setGeneralError(null);
    setFieldErrors({});

    try {
      await api.post("/qr-codes", {
        originalUrl,
        title: title || undefined,
        createShortLink,
      });

      router.push("/dashboard/qr-codes");

      const remainingResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/remaining-links`, {
        headers: { Authorization: `Bearer ${getCookie("token")}` },
      });
      setRemainingLinks(remainingResponse.data.remaining === Infinity ? null : remainingResponse.data.remaining);
    } catch (err: any) {
      if (err.response && err.response.data) {
        const { message, errors } = err.response.data;

        if (errors) {
          setFieldErrors(errors);
        } else if (message) {
          if (message.includes("giới hạn 5 link")) {
            setOpenLimitPopup(true);
          } else {
            setGeneralError(message);
          }
        }
      } else {
        setGeneralError("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleUpgrade = () => {
    router.push("/upgrade");
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#ffffff", minHeight: "100vh", color: "black" }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Create a Code
      </Typography>
      {remainingLinks !== null && (
        <Typography variant="body2" color="text.secondary" mb={3}>
          Bạn còn {remainingLinks} link có thể tạo trong tháng này.{" "}
          <a href="#" style={{ color: "#007bff", textDecoration: "none" }} onClick={handleUpgrade}>
            Nâng cấp để tạo không giới hạn.
          </a>
        </Typography>
      )}

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Configure code" />
        <Tab label="Custom design" disabled />
      </Tabs>

      <Box sx={{ display: "flex", gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3, mb: 3, borderRadius: "16px" }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Destination
            </Typography>
            <TextField
              label="https://example.com/my-long-url"
              fullWidth
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="Hit [ENTER] to quick create"
              error={!!fieldErrors.originalUrl}
              helperText={fieldErrors.originalUrl}
              sx={{ mb: 2 }}
            />
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Title (optional)
            </Typography>
            <TextField
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!fieldErrors.title}
              helperText={fieldErrors.title}
              sx={{ mb: 2 }}
            />
          </Paper>

          <Paper sx={{ p: 3, borderRadius: "16px" }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Ways to share
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={createShortLink}
                  onChange={(e) => setCreateShortLink(e.target.checked)}
                />
              }
              label={
                <Box>
                  <Typography variant="body1">Short link</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create a link that directs users to the same destination as your QR Code
                    <br />
                    <Typography component="span" color="text.secondary" fontSize="0.8rem">
                      {remainingLinks !== null ? `${remainingLinks} left` : "Không giới hạn"}
                    </Typography>
                  </Typography>
                </Box>
              }
            />
          </Paper>

          {generalError && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography color="error" sx={{ mb: 1, fontWeight: "bold" }}>
                {generalError}
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            width: 300,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Preview
          </Typography>
          {previewQrCode ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: 150,
              }}
            >
              <QRCodeCanvas value={previewQrCode} size={150} />
            </Box>
          ) : (
            <Box
              sx={{
                width: 150,
                height: 150,
                backgroundColor: "#e0e0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                QR Code Preview
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="outlined" onClick={() => router.push("/dashboard/qr-codes")}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleCreate} disabled={loading}>
          {loading ? "Đang tạo..." : "Create"}
        </Button>
      </Box>

      <Dialog open={openLimitPopup} onClose={() => setOpenLimitPopup(false)} sx={{ "& .MuiDialog-paper": { borderRadius: "16px", maxWidth: "500px", p: 0 } }}>
        <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", borderTopLeftRadius: "16px", borderTopRightRadius: "16px" }}>
          <Typography fontWeight="bold">
            Đạt giới hạn link
          </Typography>
          <IconButton onClick={() => setOpenLimitPopup(false)} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Bạn đã tạo tối đa 5 link trong tháng này!
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Nâng cấp lên gói Pro để tạo không giới hạn link và QR code.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button variant="outlined" onClick={() => setOpenLimitPopup(false)}>
              Hủy
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpgrade}
              sx={{ bgcolor: theme.palette.primary.main }}
            >
              Nâng cấp ngay
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
