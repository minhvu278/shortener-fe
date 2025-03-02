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
} from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";

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

  const defaultQrCodeUrl = "http://103.221.221.110:5000";

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#ffffff", minHeight: "100vh", color: "black" }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Create a Code
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        You can create 1 more codes this month.{" "}
        <a href="#" style={{ color: "#007bff", textDecoration: "none" }}>
          Upgrade for more.
        </a>
      </Typography>

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

          {generalError && (
            <Typography color="error" sx={{ mt: 2, textAlign: "center", fontWeight: "bold" }}>
              {generalError}
            </Typography>
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
    </Box>
  );
}
