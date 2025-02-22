"use client";
import { Box, CssBaseline } from '@mui/material'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import React from 'react'

export default function MainLayout({children}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <CssBaseline />
      <Box>
        <Header />
      </Box>
      <Box flex={1} component="main">
        {children}
      </Box>
      <Box>
        <Footer/>
      </Box>
    </Box>
  );
}