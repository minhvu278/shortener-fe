"use client";

import { Box, Typography, IconButton } from "@mui/material";
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import theme from '@/lib/theme'


const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        color: theme.palette.secondary.main,
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: theme.palette.primary.main,
        borderBottom: '1px solid',
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FF6D00" }}>
        Better bytes
      </Typography>
      {/* Left Content */}
      <Box display="flex" alignItems="center" gap={2}>
        <Typography variant="body2" flex={1} textAlign="center">
          © 2025 Better bytes
        </Typography>
      </Box>

      {/* Social Icons */}
      <Box display="flex" gap={1}>
        <IconButton color="inherit">
          <TwitterIcon />
        </IconButton>
        <IconButton color="inherit">
          <InstagramIcon />
        </IconButton>
        <IconButton color="inherit">
          <FacebookIcon />
        </IconButton>
        <IconButton color="inherit">
          <LinkedInIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Footer;
