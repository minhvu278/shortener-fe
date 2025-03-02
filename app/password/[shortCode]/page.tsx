"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Typography, Paper, Box } from "@mui/material";
import { api } from "@/utils/api";

export default function PasswordPage({ params }: { params: Promise<{ shortCode: string }> }) {
  const router = useRouter();
  const [shortCode, setShortCode] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Lấy shortCode từ params
  useEffect(() => {
    params.then((resolvedParams) => setShortCode(resolvedParams.shortCode));
  }, [params]);

  const handleSubmit = async () => {
    if (!shortCode) return;

    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/${shortCode}?password=${password}`);
      if (response.data.originalUrl) {
        window.location.href = response.data.originalUrl; // Chuyển hướng trực tiếp
      } else if (response.data.redirectTo) {
        router.push(response.data.redirectTo);
      } else {
        setError(response.data.message || "Mật khẩu không đúng.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Mật khẩu không đúng.");
    } finally {
      setLoading(false);
    }
  };

  if (!shortCode) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">Đang tải...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#ffffff", display: "flex", justifyContent: "center", alignItems: "center", p: 3 }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: "100%", borderRadius: "16px", textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Nhập mật khẩu để truy cập link
        </Typography>
        <TextField
          label="Mật khẩu"
          type="password"
          fullWidth
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Xác nhận"}
        </Button>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}