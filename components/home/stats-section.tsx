"use client";

import { Box, Typography, Grid } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import LinkIcon from "@mui/icons-material/Link";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";

const stats = [
  { icon: <PublicIcon fontSize="large" />, value: "500K+", label: "Khách hàng trả tiền toàn cầu" },
  { icon: <LinkIcon fontSize="large" />, value: "256M", label: "Links & QR Codes được tạo ra hàng tháng" },
  { icon: <AppRegistrationIcon fontSize="large" />, value: "800+", label: "Tích hợp ứng dụng" },
  { icon: <DonutLargeIcon fontSize="large" />, value: "10B", label: "Kết nối (lượt nhấp và quét hàng tháng)" },
];

export default function StatsSection() {
  return (
    <Box sx={{ textAlign: "center", p: 6 }}>

      <Typography variant="h5" fontWeight="bold">
        Được hàng triệu người dùng chấp nhận và yêu thích trong hơn một thập kỷ
      </Typography>

      <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "16px",
                minHeight: "150px",
                boxShadow: 1,
              }}
            >
              {stat.icon}
              <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {stat.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
