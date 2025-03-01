"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { List, ListItem, ListItemIcon, ListItemText, Box, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LinkIcon from "@mui/icons-material/Link";
import QrCodeIcon from "@mui/icons-material/QrCode";

const menuItems = [
  { text: "Home", icon: <HomeIcon />, path: "/dashboard" },
  { text: "Links", icon: <LinkIcon />, path: "/dashboard/links" },
  { text: "QR Codes", icon: <QrCodeIcon />, path: "/dashboard/qr-codes" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        width: 200,
        bgcolor: "white",
        borderRight: "1px solid #e0e0e0",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          py: 2,
          px: 3,
          borderBottom: "1px solid #e0e0e0",
          mb: 2,
        }}
      >
        <Link href="/dashboard" passHref>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#FF6D00",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Better bytes
          </Typography>
        </Link>
      </Box>

      {/* Menu Items */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link key={item.text} href={item.path} passHref legacyBehavior>
              <ListItem
                component="a"
                sx={{
                  py: 1.5,
                  px: 3,
                  bgcolor: isActive ? "#e3f2fd" : "transparent",
                  color: isActive ? "#1976d2" : "black",
                  "&:hover": {
                    bgcolor: "#f5f5f5",
                  },
                  borderRadius: "0 16px 16px 0",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "#1976d2" : "black",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? "bold" : "normal",
                  }}
                />
              </ListItem>
            </Link>
          );
        })}
      </List>
    </Box>
  );
}
