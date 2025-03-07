// app/error.tsx
"use client";

import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f5f7fa",
        textAlign: "center",
        p: 3,
      }}
    >
      <Typography variant="h1" color="error" fontWeight="bold" gutterBottom>
        Oops!
      </Typography>
      <Typography variant="h5" color="text.primary" gutterBottom>
        Đã có lỗi xảy ra
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {error.message || "Có lỗi không xác định. Vui lòng thử lại."}
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
      <Button
        variant="outlined"
        color="primary"
        size="large"
        onClick={reset}
        sx={{ mt: 2 }}
      >
        Try Again
      </Button>
    </Box>
  );
}