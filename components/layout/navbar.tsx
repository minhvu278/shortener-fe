"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { getCookie, deleteCookie } from "@/lib/cookie";

const Navbar = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const open = Boolean(anchorEl);

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const token = getCookie("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    deleteCookie("token");
    setIsLoggedIn(false);
    handleMenuClose();
    router.push("/");
  };

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#fff", color: "#000", boxShadow: "none", borderBottom: "1px solid #ddd" }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          Your Connections Platform
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#f1f1f1",
            borderRadius: "8px",
            px: 2,
            py: 1,
          }}
        >
          <SearchIcon />
          <InputBase placeholder="Search…" sx={{ ml: 1 }} />
        </Box>

        <IconButton>
          <NotificationsIcon />
        </IconButton>
        <IconButton onClick={handleMenuOpen}>
          <AccountCircleIcon />
        </IconButton>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
