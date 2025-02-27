"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/utils/api";
import { TextField, Button, Typography, Container, CircularProgress } from "@mui/material";

api.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

export default function RedirectPage() {
  const router = useRouter();
  const pathname = usePathname();
  const shortCode = pathname.split("/").pop(); // Lấy mã short từ URL

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUrl() {
      try {
        const response = await api.get(`/${shortCode}`);
        setLoading(false);

        if (response.data.requiresPassword) {
          setRequiresPassword(true);
        } else if (response.data.originalUrl) {
          router.replace(response.data.originalUrl);
        } else {
          setError("Lỗi không xác định.");
        }
      } catch {
        setLoading(false);
        setError("Link không tồn tại hoặc đã hết hạn.");
      }
    }

    if (shortCode) {
      fetchUrl();
    }
  }, [router, shortCode]);

  const handleSubmit = async () => {
    try {
      const response = await api.get(`/${shortCode}?password=${password}`);

      if (response.data.originalUrl) {
        router.replace(response.data.originalUrl);
      } else {
        setError("Mật khẩu không đúng.");
      }
    } catch {
      setError("Mật khẩu không đúng.");
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
        <CircularProgress />
        <Typography mt={2}>Đang kiểm tra link...</Typography>
      </Container>
    );
  }

  if (requiresPassword) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center", padding: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          Nhập mật khẩu để truy cập link
        </Typography>
        <TextField
          label="Mật khẩu"
          type="password"
          fullWidth
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
          Xác nhận
        </Button>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
      <Typography color="error">{error || "Lỗi không xác định."}</Typography>
    </Container>
  );
}
