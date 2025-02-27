import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";

export default function LinkItem({ link }: any) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h6">{link.title}</Typography>
            <Typography variant="body2" color="primary">
              {link.shortUrl}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {link.fullUrl}
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={() => navigator.clipboard.writeText(link.shortUrl)}>
              <ContentCopyIcon />
            </IconButton>
            <IconButton>
              <ShareIcon />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="caption" color="textSecondary">
          {link.createdAt}
        </Typography>
      </CardContent>
    </Card>
  );
}
