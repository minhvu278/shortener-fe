// pages/qr-codes.tsx
"use client";

import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Pagination } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { Link as LinkType } from "@/types/link";
import QrCodeItem from "@/components/QrCodeItem";
import { api } from "@/utils/api";

export default function QrCodesPage() {
  const [search, setSearch] = useState<string>("");
  const [qrCodes, setQrCodes] = useState<LinkType[]>([]);
  const [filteredQrCodes, setFilteredQrCodes] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("active");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    async function fetchQrCodes() {
      try {
        const response = await api.get(`/qr-codes?page=${page}&limit=${limit}`);
        console.log("QR Codes fetched:", response.data);

        if (response.data.qrCodes && Array.isArray(response.data.qrCodes)) {
          setQrCodes(response.data.qrCodes);
          setFilteredQrCodes(response.data.qrCodes);
          setTotal(response.data.total || 0);
        } else {
          throw new Error("Invalid response format: Expected an array of QR codes");
        }
        setLoading(false);
      } catch (err: any) {
        console.error("Fetch QR Codes Error:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        setError("Không thể tải danh sách QR Code.");
        setLoading(false);
      }
    }

    fetchQrCodes();
  }, [page, limit]);

  useEffect(() => {
    let result = qrCodes;

    if (filter === "active") {
      result = result.filter((qrCode) => !qrCode.expiresAt || new Date(qrCode.expiresAt) > new Date());
    } else if (filter === "inactive") {
      result = result.filter((qrCode) => qrCode.expiresAt && new Date(qrCode.expiresAt) <= new Date());
    }

    result = result.filter(
      (qrCode) =>
        (qrCode.title?.toLowerCase().includes(search.toLowerCase()) || false) ||
        qrCode.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
        qrCode.shortCode.includes(search) ||
        (qrCode.slug && qrCode.slug.includes(search))
    );

    setFilteredQrCodes(result);
  }, [search, filter, qrCodes]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">Đang tải danh sách QR Code...</Typography>
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
        QR Codes
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
        <TextField
          label="Search codes..."
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
        <Link href="/dashboard/create-qr-code">
          <Button variant="contained" color="primary">
            Create code
          </Button>
        </Link>
      </Box>

      {filteredQrCodes.length > 0 ? (
        filteredQrCodes.map((qrCode) => <QrCodeItem key={qrCode.id} qrCode={qrCode} />)
      ) : (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            You have no QR codes yet.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your first QR code to start tracking.
          </Typography>
        </Box>
      )}

      {filteredQrCodes.length > 0 && total > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={Math.ceil(total / limit)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {filteredQrCodes.length > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: "center" }}>
          You've reached the end of your QR codes
        </Typography>
      )}
    </Box>
  );
}
