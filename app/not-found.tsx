"use client"

import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 10000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f5f7fa", // Màu nền giống giao diện hiện tại
        textAlign: "center",
        p: 3,
      }}
    >
      <Typography variant="h1" color="error" fontWeight="bold" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" color="text.primary" gutterBottom>
        Trang không được tìm thấy
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Ối! Có vẻ như trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Hãy thử quay lại trang chủ hoặc kiểm tra lại URL.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        component={Link}
        href="/"
        sx={{ mt: 2 }}
      >
        Back to Home
      </Button>
    </Box>
  );
}
