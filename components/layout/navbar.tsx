"use client";

import { AppBar, Toolbar, Typography, InputBase, Box, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#fff", color: "#000", boxShadow: "none", borderBottom: "1px solid #ddd" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          Your Connections Platform
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", backgroundColor: "#f1f1f1", borderRadius: "8px", px: 2, py: 1 }}>
          <SearchIcon />
          <InputBase placeholder="Search…" sx={{ ml: 1 }} />
        </Box>

        <IconButton>
          <NotificationsIcon />
        </IconButton>
        <IconButton>
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
