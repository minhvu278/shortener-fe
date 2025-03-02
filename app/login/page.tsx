"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, TextField, Button, Typography, CircularProgress, Paper } from "@mui/material";
import theme from "@/lib/theme";
import axios from "axios";
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password });
      const { access_token } = response.data;

      // Lưu token vào cookies
      document.cookie = `token=${access_token}; path=/; max-age=3600`;

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: theme.palette.primary.main, py: 6 }}>
      <Paper sx={{ maxWidth: 400, mx: "auto", p: 4, borderRadius: "16px" }}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" color={theme.palette.primary.main}>
          Đăng nhập
        </Typography>
        <Typography variant="body2" textAlign="center" sx={{ mb: 3 }}>
          Chào mừng bạn trở lại!
        </Typography>

        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Mật khẩu"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          disabled={loading}
          sx={{ mb: 2, borderRadius: "8px" }}
        >
          {loading ? <CircularProgress size={24} /> : "Đăng nhập"}
        </Button>

        <Typography textAlign="center">
          Chưa có tài khoản? <Link href="/register">Đăng ký ngay</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;
