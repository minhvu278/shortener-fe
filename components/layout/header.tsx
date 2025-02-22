"use client";

import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box } from "@mui/material";
import PublicIcon from '@mui/icons-material/Public';
import { useState } from "react";
import theme from '@/lib/theme'

const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ boxShadow: "none", padding: "8px 24px" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FF6D00", cursor: "pointer" }}>
          Better bytes
        </Typography>

        {/* Navigation */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          <Button sx={{ color: "white", textTransform: "none" }}>Nền tảng</Button>
          <Button sx={{ color: "white", textTransform: "none" }}>Giải pháp</Button>
          <Button sx={{ color: "white", textTransform: "none" }}>Giá</Button>
          <Button sx={{ color: "white", textTransform: "none" }}>Tài nguyên</Button>
        </Box>

        {/* Right Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Language Switcher */}
          <IconButton color="inherit" onClick={handleClick}>
            <PublicIcon />
          </IconButton>
          {/*<Menu anchorEl={anchorEl} open={open} onClose={handleClose}>*/}
          {/*  <MenuItem onClick={handleClose}>English</MenuItem>*/}
          {/*  <MenuItem onClick={handleClose}>Vietnamese</MenuItem>*/}
          {/*</Menu>*/}

          <Button sx={{ color: "white", textTransform: "none" }}>Đăng nhập</Button>
          <Button variant="outlined" sx={{ borderColor: "white", color: "white", textTransform: "none" }}>
            Nhận báo giá
          </Button>
          <Button variant="contained" sx={{ backgroundColor: "white", textTransform: "none", color: theme.palette.primary.main }}>
            Đăng ký miễn phí
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
