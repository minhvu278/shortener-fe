"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import QrCodeIcon from "@mui/icons-material/QrCode";
import axios from "axios";
import theme from "@/lib/theme";
import Link from "next/link";
import { getCookie } from "@/lib/cookie";

const DashboardPage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getCookie("token");
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "#ffffff",
        minHeight: "100vh",
        color: "black",
      }}
    >
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Chào mừng, {user?.username}!
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: 3,
        }}
      >
        <Card sx={{ p: 2, bgcolor: "#f5f5f5", color: "black", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold">
              Make it short
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Create a short and easy-to-share link.
            </Typography>
            <Link href="/dashboard/links">
              <Button
                variant="contained"
                sx={{ mt: 2, bgcolor: theme.palette.primary.main, color: "white" }}
                startIcon={<InsertLinkIcon />}
              >
                Go to links
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card sx={{ p: 2, bgcolor: "#f5f5f5", color: "black", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold">
              Make it scannable
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Generate a QR Code for your link.
            </Typography>
            <Link href="/dashboard/qr-codes">
              <Button
                variant="contained"
                sx={{ mt: 2, bgcolor: theme.palette.primary.main, color: "white" }}
                startIcon={<QrCodeIcon />}
              >
                Go to Codes
              </Button>
            </Link>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardPage;
