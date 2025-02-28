"use client";

import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Pagination } from "@mui/material";
import Link from "next/link";
import { Link as LinkType } from "@/types/link";
import LinkItem from "@/components/LinkItem";

export default function LinksPage() {
  const [search, setSearch] = useState<string>("");
  const [links, setLinks] = useState<LinkType[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("active");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10); // Số link mỗi trang
  const [total, setTotal] = useState<number>(0); // Tổng số link

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(() => {
    async function fetchLinks() {
      try {
        const response = await fetch(`${API_URL}/links?page=${page}&limit=${limit}`, {
          headers: { "X-Requested-With": "XMLHttpRequest" },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch links");
        }
        const data = await response.json();
        console.log("Links fetched:", data);

        if (data.links && Array.isArray(data.links)) {
          setLinks(data.links);
          setFilteredLinks(data.links);
          setTotal(data.total || 0);
        } else {
          throw new Error("Invalid response format: Expected an array of links");
        }
        setLoading(false);
      } catch (err) {
        console.error("Fetch Links Error:", err);
        setError("Không thể tải danh sách link.");
        setLoading(false);
      }
    }

    fetchLinks();
  }, [page, limit]); // Gọi lại API khi page thay đổi

  // Lọc link theo search và filter
  useEffect(() => {
    let result = links;

    // Lọc theo trạng thái (active/inactive)
    if (filter === "active") {
      result = result.filter((link) => !link.expiresAt || new Date(link.expiresAt) > new Date());
    } else if (filter === "inactive") {
      result = result.filter((link) => link.expiresAt && new Date(link.expiresAt) <= new Date());
    }

    // Lọc theo search
    result = result.filter(
      (link) =>
        (link.title?.toLowerCase().includes(search.toLowerCase()) || false) ||
        link.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
        link.shortCode.includes(search) ||
        (link.slug && link.slug.includes(search))
    );

    setFilteredLinks(result);
  }, [search, filter, links]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">Đang tải danh sách link...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Tiêu đề + Tìm kiếm */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        BB Links
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
        <TextField
          label="Search links..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Show</InputLabel>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} label="Show">
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="all">All</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary">
          <Link href="/dashboard/create-link">Create link</Link>
        </Button>
      </Box>

      {/* Danh sách link */}
      {filteredLinks.length > 0 ? (
        filteredLinks.map((link) => <LinkItem key={link.id} link={link} />)
      ) : (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            You have no links yet.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your first short link to start tracking.
          </Typography>
        </Box>
      )}

      {/* Phân trang */}
      {filteredLinks.length > 0 && total > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={Math.ceil(total / limit)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}