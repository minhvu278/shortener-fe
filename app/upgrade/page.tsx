"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, Paper } from "@mui/material";
import { api } from "@/utils/api";

export default function UpgradePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);

    try {
      await api.post("/users/upgrade-to-pro");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể nâng cấp gói. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#ffffff", minHeight: "100vh", color: "black", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Paper sx={{ p: 4, maxWidth: 600, borderRadius: "16px", textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Nâng cấp lên gói Pro
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Gói Pro cho phép bạn tạo không giới hạn link và QR code mỗi tháng, cùng với các tính năng cao cấp khác.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpgrade}
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Nâng cấp ngay"}
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
