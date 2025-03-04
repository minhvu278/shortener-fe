"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "@/lib/cookie";

export default function UpgradePage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Tải PayPal JavaScript SDK
    const script = document.createElement("script");
    // Sửa cú pháp tham số currency
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`;
    script.async = true;
    script.onload = () => {
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: async () => {
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/paypal/create-order`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  amount: 10,
                }),
              });

              const orderData = await response.json();
              if (orderData.id) {
                return orderData.id;
              } else {
                throw new Error("Không thể tạo order.");
              }
            } catch (err) {
              setError("Không thể tạo thanh toán. Vui lòng thử lại.");
              return null;
            }
          },
          onApprove: async (data: any, actions: any) => {
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/paypal/capture-order`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  orderID: data.orderID,
                }),
              });

              const result = await response.json();
              if (result.status === "COMPLETED") {
                const token = getCookie("token");
                if (!token) {
                  throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
                }

                const upgradeResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upgrade-to-pro`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                  },
                });

                const upgradeResult = await upgradeResponse.json();
                if (upgradeResult.success) {
                  const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${token}`,
                    },
                  });

                  const refreshResult = await refreshResponse.json();
                  if (refreshResult.access_token) {
                    setCookie("token", refreshResult.access_token, 1);
                  } else {
                    setError("Không thể làm mới token. Vui lòng đăng nhập lại.");
                    return;
                  }

                  window.dispatchEvent(new Event("upgrade-complete"));
                  router.push("/dashboard");
                } else {
                  setError("Thanh toán thành công nhưng không thể nâng cấp gói. Vui lòng liên hệ hỗ trợ.");
                }
              } else {
                setError("Thanh toán không thành công. Vui lòng thử lại.");
              }
            } catch (err) {
              setError("Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.");
            }
          },
          onError: (err: any) => {
            setError("Có lỗi xảy ra với PayPal. Vui lòng thử lại sau.");
          },
        }).render("#paypal-button-container");
      }
    };
    script.onerror = () => {
      setError("Không thể tải PayPal SDK. Vui lòng kiểm tra kết nối hoặc client-id.");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [router]);

  return (
    <Box sx={{ p: 3, bgcolor: "#ffffff", minHeight: "100vh", color: "black", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Paper sx={{ p: 4, maxWidth: 600, borderRadius: "16px", textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Nâng cấp lên gói Pro
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Gói Pro cho phép bạn tạo không giới hạn link và QR code mỗi tháng, cùng với các tính năng cao cấp khác.
        </Typography>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          Giá: 10 USD
        </Typography>
        <div id="paypal-button-container"></div>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
