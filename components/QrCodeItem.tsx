import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Snackbar,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link as LinkType } from "@/types/link";

interface QrCodeItemProps {
  qrCode: LinkType;
}

export default function QrCodeItem({ qrCode }: QrCodeItemProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const cleanedApiUrl = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
  const shortUrl = `${cleanedApiUrl}/${qrCode.shortCode}`;
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const handleDownload = () => {
    if (qrCode.qrCode) {
      const link = document.createElement("a");
      link.href = qrCode.qrCode;
      link.download = `qrcode-${qrCode.shortCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadMessage("Đã tải QR Code!");
    } else {
      setDownloadMessage("Không tìm thấy QR Code để tải.");
    }
  };

  const handleViewDetails = () => {
    setOpenDetailsDialog(true);
  };

  return (
    <>
      <Card sx={{ mb: 2, display: "flex", alignItems: "center" }}>
        <Box sx={{ p: 2 }}>
          {qrCode.qrCode ? (
            <img src={qrCode.qrCode} alt="QR Code" width="60" height="60" />
          ) : (
            <Typography variant="body2" color="text.secondary">
              No QR Code
            </Typography>
          )}
        </Box>
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="body1" fontWeight="bold">
            {qrCode.title || "No Title"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {qrCode.originalUrl}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Scan data: 0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {qrCode.createdAt ? new Date(qrCode.createdAt).toLocaleDateString() : "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {shortUrl}
            </Typography>
          </Box>
        </CardContent>
        <Box sx={{ display: "flex", gap: 1, pr: 2 }}>
          <IconButton onClick={handleDownload}>
            <FileDownloadIcon />
          </IconButton>
          <IconButton onClick={handleViewDetails}>
            <VisibilityIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Card>

      {/* Snackbar cho thông báo tải */}
      <Snackbar open={!!downloadMessage} autoHideDuration={2000} onClose={() => setDownloadMessage(null)}>
        <Alert
          severity={downloadMessage?.includes("Không tìm thấy") ? "error" : "success"}
          onClose={() => setDownloadMessage(null)}
        >
          {downloadMessage}
        </Alert>
      </Snackbar>

      {/* Dialog để xem chi tiết */}
      <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)}>
        <DialogTitle>Chi tiết QR Code</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Title: {qrCode.title || "No Title"}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Original URL: {qrCode.originalUrl}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Short URL: {shortUrl}
          </Typography>
          {qrCode.qrCode && (
            <Box sx={{ textAlign: "center" }}>
              <img src={qrCode.qrCode} alt="QR Code" width="180" height="180" />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}