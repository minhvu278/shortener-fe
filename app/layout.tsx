import type { Metadata } from "next";
import "./globals.css";
import theme from '@/lib/theme'
import { ThemeProvider } from '@mui/system'
import { CssBaseline } from '@mui/material'

export const metadata: Metadata = {
  title: "Better Bytes Link",
  description: "App short link",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
      </body>
    </html>
  );
}
