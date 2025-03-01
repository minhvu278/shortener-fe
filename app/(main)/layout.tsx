"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/lib/theme";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const publicPaths = ["/login", "/register"];

    if (token && publicPaths.includes(pathname)) {
      router.push("/dashboard"); // Chuyển hướng nếu đã đăng nhập mà vào /login hoặc /register
    } else if (!token && pathname === "/dashboard") {
      router.push("/login"); // Chuyển về /login nếu chưa đăng nhập mà vào /dashboard
    }
  }, [pathname, router]);

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}