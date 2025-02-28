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
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link as LinkType } from "@/types/link";

interface LinkItemProps {
  link: LinkType;
}

export default function LinkItem({ link }: LinkItemProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const shortUrl = `${API_URL}/${link.shortCode}`;
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [openCopyDialog, setOpenCopyDialog] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(shortUrl)
        .then(() => {
          setCopyMessage("Đã sao chép link!");
        })
        .catch((err) => {
          console.error("Copy Error:", err);
          setCopyMessage("Không thể sao chép link.");
          setOpenCopyDialog(true); // Mở dialog để sao chép thủ công
        });
    } else {
      console.log("Clipboard API not supported");
      setOpenCopyDialog(true); // Mở dialog để sao chép thủ công
    }
  };

  const handleShare = async () => {
    if (!navigator.share) {
      setShareMessage("Chia sẻ không được hỗ trợ trên trình duyệt này. Bạn có thể sao chép link để chia sẻ!");
      return;
    }

    try {
      await navigator.share({
        title: link.title || "Short Link",
        url: shortUrl,
      });
      setShareMessage("Chia sẻ thành công!");
    } catch (err: any) {
      if (err.name === "AbortError") {
        setShareMessage("Đã hủy chia sẻ.");
        return;
      }
      console.error("Share Error:", err);
      setShareMessage("Có lỗi khi chia sẻ.");
    }
  };

  return (
    <>
      <Card sx={{ mb: 2, display: "flex", alignItems: "center" }}>
        <CardContent sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {link.title || "No Title"}
            </Typography>
            {link.title && (
              <Typography variant="body2" color="text.secondary">
                (Custom Tag)
              </Typography>
            )}
          </Box>
          <Typography variant="body1" fontWeight="bold" color="primary">
            {shortUrl}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {link.originalUrl}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {link.createdAt ? new Date(link.createdAt).toLocaleDateString() : "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No tags
            </Typography>
          </Box>
        </CardContent>
        <Box sx={{ display: "flex", gap: 1, pr: 2 }}>
          <IconButton onClick={handleCopy}>
            <ContentCopyIcon />
          </IconButton>
          <IconButton onClick={handleShare}>
            <ShareIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Card>

      {/* Snackbar cho thông báo sao chép */}
      <Snackbar open={!!copyMessage} autoHideDuration={2000} onClose={() => setCopyMessage(null)}>
        <Alert
          severity={copyMessage?.includes("Không thể sao chép") ? "error" : "success"}
          onClose={() => setCopyMessage(null)}
        >
          {copyMessage}
        </Alert>
      </Snackbar>

      {/* Snackbar cho thông báo chia sẻ */}
      <Snackbar open={!!shareMessage} autoHideDuration={2000} onClose={() => setShareMessage(null)}>
        <Alert
          severity={shareMessage?.includes("Có lỗi") ? "error" : "success"}
          onClose={() => setShareMessage(null)}
        >
          {shareMessage}
        </Alert>
      </Snackbar>

      {/* Dialog để sao chép thủ công */}
      <Dialog open={openCopyDialog} onClose={() => setOpenCopyDialog(false)}>
        <DialogTitle>Sao chép thủ công</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Clipboard API không được hỗ trợ. Vui lòng sao chép link dưới đây:
          </Typography>
          <TextField
            fullWidth
            value={shortUrl}
            InputProps={{
              readOnly: true,
            }}
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCopyDialog(false)} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}