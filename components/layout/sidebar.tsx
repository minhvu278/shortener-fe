import Link from "next/link";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LinkIcon from "@mui/icons-material/Link";
import AddLinkIcon from "@mui/icons-material/AddLink";
import QrCodeIcon from "@mui/icons-material/QrCode";
import SettingsIcon from "@mui/icons-material/Settings";

const menuItems = [
  { text: "Home", icon: <HomeIcon />, path: "/dashboard" },
  { text: "Links", icon: <LinkIcon />, path: "/dashboard/links" },
  // { text: "Create New Link", icon: <AddLinkIcon />, path: "/dashboard/create-link" },
  { text: "QR Codes", icon: <QrCodeIcon />, path: "/dashboard/qrcode" },
  { text: "Settings", icon: <SettingsIcon />, path: "/dashboard/settings" },
];

export default function Sidebar() {
  return (
    <List>
      {menuItems.map((item) => (
        <Link key={item.text} href={item.path} passHref legacyBehavior>
          <ListItem component="a">
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        </Link>
      ))}
    </List>
  );
}
