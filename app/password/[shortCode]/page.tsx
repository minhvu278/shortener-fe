"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Typography, Container } from "@mui/material";
import { api } from "@/utils/api"; // Chắc chắn bạn đã có file này

export default function PasswordPage({ params }: { params: Promise<{ shortCode: string }> }) {
  const router = useRouter();
  const [shortCode, setShortCode] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Lấy shortCode từ params (giải Promise)
  useEffect(() => {
    params.then((resolvedParams) => setShortCode(resolvedParams.shortCode));
  }, [params]);

  const handleSubmit = async () => {
    if (!shortCode) return;
    try {
      const response = await api.get(`/${shortCode}?password=${password}`);
      if (response.data.originalUrl) {
        router.replace(response.data.originalUrl);
      } else {
        setError(response.data.message || "Mật khẩu không đúng.");
      }
    } catch (err) {
      setError("Mật khẩu không đúng.");
    }
  };

  if (!shortCode) {
    return <Typography textAlign="center" mt={4}>Đang tải...</Typography>;
  }

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
