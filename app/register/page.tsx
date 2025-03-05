"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, TextField, Button, Typography, CircularProgress, Paper } from "@mui/material";
import theme from "@/lib/theme";
import axios from "axios";
import Link from "next/link";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        email,
        username,
        password,
      });
      const { access_token } = response.data;

      // Lưu token vào cookies
      document.cookie = `token=${access_token}; path=/; max-age=3600`;

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: theme.palette.primary.main, py: 6 }}>
      <Paper sx={{ maxWidth: 400, mx: "auto", p: 4, borderRadius: "16px" }}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" color={theme.palette.primary.main}>
          Đăng ký
        </Typography>
        <Typography variant="body2" textAlign="center" sx={{ mb: 3 }}>
          Tạo tài khoản miễn phí ngay hôm nay!
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
          label="Tên người dùng"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          onClick={handleRegister}
          disabled={loading}
          sx={{ mb: 2, borderRadius: "8px" }}
        >
          {loading ? <CircularProgress size={24} /> : "Đăng ký"}
        </Button>

        <Typography textAlign="center">
          Đã có tài khoản? <Link href="/login">Đăng nhập</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
