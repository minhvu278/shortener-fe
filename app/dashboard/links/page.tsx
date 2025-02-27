"use client";

import { useState } from "react";
import { Box, Typography, TextField, Button, Card, CardContent, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AddIcon from "@mui/icons-material/Add";
import LinkItem from "@/components/LinkItem";
import Link from "next/link";

export default function LinksPage() {
  const [search, setSearch] = useState("");
  const [links, setLinks] = useState([
    {
      id: 1,
      title: "PHP: News Archive - 2025",
      shortUrl: "bit.ly/php0938",
      fullUrl: "https://www.php.net/archive/2025.php#2025-02-13-2",
      createdAt: "Feb 18, 2025",
    },
  ]);

  const filteredLinks = links.filter((link) =>
    link.title.toLowerCase().includes(search.toLowerCase()) || link.shortUrl.includes(search)
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Tiêu đề + Tìm kiếm */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Bitly Links
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Search links..."
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="contained" startIcon={<FilterAltIcon />}>
          Filters
        </Button>
        <Button variant="contained" startIcon={<AddIcon />} color="primary">
        <Link href="/dashboard/create-link">Create</Link>
        </Button>
      </Box>

      {/* Danh sách link */}
      {filteredLinks.length > 0 ? (
        filteredLinks.map((link) => <LinkItem key={link.id} link={link} />)
      ) : (
        <Card>
          <CardContent>
            <Typography variant="h6" color="textSecondary">
              You have no links yet.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Create your first short link to start tracking.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
