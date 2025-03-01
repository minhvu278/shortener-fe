// app/create-short-link/page.tsx
"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { ContentCopy, Close } from "@mui/icons-material";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation"; // Sửa import

const CreateShortLink = () => {
  const router = useRouter();
  const [originalUrl, setOriginalUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [generateQrCode, setGenerateQrCode] = useState(false);
  const [title, setTitle] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [openPopup, setOpenPopup] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShorten = async () => {
    setLoading(true);
    setGeneralError(null);
    setFieldErrors({});

    try {
      const response = await api.post("/links", {
        originalUrl,
        slug: slug || undefined,
        password: password || undefined,
        expiresAt: expiresAt || undefined,
        generateQrCode,
        title: title || undefined,
      });

      setShortUrl(response.data.shortUrl);
      setQrCode(response.data.qrCode || "");
      setOpenPopup(true);
    } catch (err: any) {
      if (err.response && err.response.data) {
        const { message, errors } = err.response.data;

        if (errors) {
          setFieldErrors(errors);
        } else if (message) {
          setGeneralError(message);
        }
      } else {
        setGeneralError("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shortUrl).then(() => {
        setCopySuccess(true);
      }).catch((err) => {
        console.error("Copy Error:", err);
        alert("Không thể sao chép link. Vui lòng sao chép thủ công.");
      });
    } else {
      alert("Clipboard API không được hỗ trợ. Vui lòng sao chép thủ công: " + shortUrl);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Tạo mới link rút gọn
      </Typography>

      <TextField
        label="URL dài"
        fullWidth
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        error={!!fieldErrors.originalUrl}
        helperText={fieldErrors.originalUrl}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Tiêu đề (Tùy chọn)"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={!!fieldErrors.title}
        helperText={fieldErrors.title}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Slug (Tùy chọn)"
        fullWidth
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        error={!!fieldErrors.slug}
        helperText={fieldErrors.slug}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Mật khẩu bảo vệ (Tùy chọn)"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!fieldErrors.password}
        helperText={fieldErrors.password}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Ngày hết hạn (Tùy chọn)"
        type="datetime-local"
        fullWidth
        value={expiresAt}
        onChange={(e) => setExpiresAt(e.target.value)}
        error={!!fieldErrors.expiresAt}
        helperText={fieldErrors.expiresAt}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 2 }}
      />

      <FormControlLabel
        control={<Switch checked={generateQrCode} onChange={(e) => setGenerateQrCode(e.target.checked)} />}
        label="Tạo QR code"
      />

      <Button variant="contained" color="primary" fullWidth onClick={handleShorten} disabled={loading} sx={{ mt: 2 }}>
        {loading ? "Đang tạo..." : "Tạo link"}
      </Button>

      {generalError && (
        <Typography color="error" sx={{ mt: 2, textAlign: "center", fontWeight: "bold" }}>
          {generalError}
        </Typography>
      )}

      <Dialog open={openPopup} onClose={() => setOpenPopup(false)} sx={{ "& .MuiDialog-paper": { borderRadius: 4, maxWidth: "500px", p: 2 } }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 20, fontWeight: "bold", color: "#333" }}>
          🎉 Link rút gọn thành công
          <IconButton onClick={() => setOpenPopup(false)}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", pb: 2 }}>
          <Box sx={{ p: 2, borderRadius: 2, background: "#f7f7f7", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              <a href={shortUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", textDecoration: "none", fontWeight: "bold" }}>
                {shortUrl}
              </a>
            </Typography>
            <IconButton onClick={handleCopy}>
              <ContentCopy />
            </IconButton>
          </Box>

          {generateQrCode && qrCode && (
            <Box mt={3} sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Typography variant="body1" sx={{ fontWeight: "bold", color: "#444" }}>
                📲 Quét QR để truy cập:
              </Typography>
              <img src={qrCode} alt="QR Code" width="180" height="180" style={{ borderRadius: 8, boxShadow: "0px 4px 6px rgba(0,0,0,0.1)" }} />
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar open={copySuccess} autoHideDuration={2000} onClose={() => setCopySuccess(false)}>
        <Alert severity="success">Đã sao chép link!</Alert>
      </Snackbar>
    </Paper>
  );
};

export default CreateShortLink;
