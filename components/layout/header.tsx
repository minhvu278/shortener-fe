"use client";

import { AppBar, Toolbar, Typography, Button, IconButton, Box } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import { useState, useEffect } from "react";
import theme from "@/lib/theme";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <AppBar position="static" sx={{ boxShadow: "none", padding: "8px 24px" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#FF6D00", cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          Better bytes
        </Typography>

        {/* <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          <Button sx={{ color: "white", textTransform: "none" }}>Nền tảng</Button>
          <Button sx={{ color: "white", textTransform: "none" }}>Giải pháp</Button>
          <Button sx={{ color: "white", textTransform: "none" }}>Giá</Button>
          <Button sx={{ color: "white", textTransform: "none" }}>Tài nguyên</Button>
        </Box> */}

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* <IconButton color="inherit">
            <PublicIcon />
          </IconButton> */}

          {isLoggedIn ? (
            <Button sx={{ color: "white", textTransform: "none" }} onClick={handleLogout}>
              Đăng xuất
            </Button>
          ) : (
            <>
              <Button sx={{ color: "white", textTransform: "none" }} onClick={() => router.push("/login")}>
                Đăng nhập
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "white",
                  textTransform: "none",
                  color: theme.palette.primary.main,
                }}
                onClick={() => router.push("/register")}
              >
                Đăng ký miễn phí
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
