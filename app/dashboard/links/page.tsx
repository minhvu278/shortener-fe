"use client";

import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Pagination } from "@mui/material";
import Link from "next/link";
import { Link as LinkType } from "@/types/link";
import LinkItem from "@/components/LinkItem";
import { api } from "@/utils/api";

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

  useEffect(() => {
    async function fetchLinks() {
      try {
        const response = await api.get(`/links?page=${page}&limit=${limit}`);

        if (response.data.links && Array.isArray(response.data.links)) {
          setLinks(response.data.links);
          setFilteredLinks(response.data.links);
          setTotal(response.data.total || 0);
        } else {
          throw new Error("Invalid response format: Expected an array of links");
        }
        setLoading(false);
      } catch (err: any) {
        console.error("Fetch Links Error:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        setError("Không thể tải danh sách link.");
        setLoading(false);
      }
    }

    fetchLinks();
  }, [page, limit]);

  // Lọc link theo search và filter
  useEffect(() => {
    let result = links;

    if (filter === "active") {
      result = result.filter((link) => !link.expiresAt || new Date(link.expiresAt) > new Date());
    } else if (filter === "inactive") {
      result = result.filter((link) => link.expiresAt && new Date(link.expiresAt) <= new Date());
    }

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
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Bitly Links
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