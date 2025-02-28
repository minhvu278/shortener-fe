import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link as LinkType } from "@/types/link";
import { useState } from "react";

interface LinkItemProps {
  link: LinkType;
}

export default function LinkItem({ link }: LinkItemProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const shortUrl = `${API_URL}/${link.shortCode}`;
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    alert("Link copied!");
  };

  const handleShare = async () => {
    if (!navigator.share) {
      alert("Chia sẻ không được hỗ trợ trên trình duyệt này. Bạn có thể sao chép link để chia sẻ!");
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
        {shareMessage && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {shareMessage}
          </Typography>
        )}
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
  );
}
