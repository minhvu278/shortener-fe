"use client";

import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import QrCodeIcon from "@mui/icons-material/QrCode";

export default function DashboardPage() {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 3 }}>
      <Card sx={{ p: 2 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold">
            Make it short
          </Typography>
          <Typography variant="body2">Create a short and easy-to-share link.</Typography>
          <Button variant="contained" sx={{ mt: 2 }} startIcon={<InsertLinkIcon />}>
            Go to links
          </Button>
        </CardContent>
      </Card>

      <Card sx={{ p: 2 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold">
            Make it scannable
          </Typography>
          <Typography variant="body2">Generate a QR Code for your link.</Typography>
          <Button variant="contained" sx={{ mt: 2 }} startIcon={<QrCodeIcon />}>
            Go to Codes
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
