// pages/upgrade.tsx
"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Button, Grid, Card, CardContent, CardActions, Chip } from "@mui/material";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "@/lib/cookie";

export default function UpgradePage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const plans = [
    {
      name: "Core",
      price: 10,
      annualPrice: 120,
      planType: "basic",
      qrCodes: 5,
      links: 100,
      landingPages: 5,
      features: [
        "QR Code customizations",
        "30 days of click & scan data",
        "Link & QR Code redirects",
      ],
    },
    {
      name: "Growth",
      price: 29,
      annualPrice: 348,
      planType: "growth",
      qrCodes: 10,
      links: 500,
      landingPages: 10,
      features: [
        "Complimentary custom domain*",
        "Branded links",
        "4 months of click & scan data",
        "Bulk link shortening",
      ],
      recommended: true,
    },
    {
      name: "Premium",
      price: 199,
      annualPrice: 2388,
      planType: "premium",
      qrCodes: 200,
      links: 3000,
      landingPages: 20,
      features: [
        "1 year of click & scan data",
        "Custom campaign-level tracking",
        "City-level & device type click & scan data",
        "Mobile deep linking",
        "99.9% SLA uptime",
      ],
    },
    {
      name: "Enterprise",
      price: null,
      annualPrice: null,
      planType: "enterprise",
      qrCodes: "Custom",
      links: "Custom",
      landingPages: "Custom",
      features: [
        "Multiple users, group permissions & SSO",
        "AI-scale link & QR Code generation",
        "High-volume API & webhook access",
        "Advanced performance tracking",
        "Dedicated customer success manager, customized onboarding & priority support",
      ],
    },
  ];

  const handlePayment = (plan: string, amount: number) => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`;
    script.async = true;
    script.onload = () => {
      if (window.paypal) {
        window.paypal
          .Buttons({
            createOrder: async () => {
              try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/paypal/create-order`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ amount, plan }),
                });
                const orderData = await response.json();
                if (orderData.id) return orderData.id;
                throw new Error("Không thể tạo order.");
              } catch (err) {
                setError("Không thể tạo thanh toán. Vui lòng thử lại.");
                return null;
              }
            },
            onApprove: async (data: any) => {
              try {
                const captureResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/paypal/capture-order`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ orderID: data.orderID }),
                });
                const captureResult = await captureResponse.json();

                if (captureResult.status === "COMPLETED") {
                  const token = getCookie("token");
                  if (!token) throw new Error("Không tìm thấy token.");

                  const upgradeResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upgrade-plan`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ plan }),
                  });
                  const upgradeResult = await upgradeResponse.json();

                  if (upgradeResult.success) {
                    const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                      },
                    });
                    const refreshResult = await refreshResponse.json();
                    if (refreshResult.access_token) {
                      setCookie("token", refreshResult.access_token, 1);
                      window.dispatchEvent(new Event("upgrade-complete"));
                      router.push("/dashboard");
                    } else {
                      setError("Không thể làm mới token.");
                    }
                  } else {
                    setError("Thanh toán thành công nhưng nâng cấp thất bại. Liên hệ hỗ trợ.");
                  }
                } else {
                  setError("Thanh toán không thành công.");
                }
              } catch (err) {
                setError("Lỗi xử lý thanh toán.");
              }
            },
            onError: () => setError("Lỗi PayPal. Vui lòng thử lại."),
          })
          .render(`#paypal-button-${plan}`);
      }
    };
    script.onerror = () => setError("Không thể tải PayPal SDK.");
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#f5f7fa", minHeight: "100vh", color: "black" }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
        Chọn gói phù hợp với bạn
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {plans.map((plan) => (
          <Grid item xs={12} sm={6} md={3} key={plan.name}>
            <Card
              sx={{
                textAlign: "center",
                borderRadius: "16px",
                boxShadow: 3,
                border: plan.recommended ? "2px solid #1976d2" : "none",
                position: "relative",
                bgcolor: plan.recommended ? "#e3f2fd" : "white",
              }}
            >
              {plan.recommended && (
                <Chip
                  label="RECOMMENDED"
                  color="primary"
                  sx={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)" }}
                />
              )}
              <CardContent sx={{ pt: plan.recommended ? 6 : 3 }}>
                <Typography variant="h5" fontWeight="bold" color={plan.recommended ? "primary" : "inherit"}>
                  {plan.name}
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ my: 1 }}>
                  {plan.price ? (
                    <>
                      ${plan.price}/month
                      <Typography variant="body2" color="text.secondary" component="p">
                        annual charge of ${plan.annualPrice}
                      </Typography>
                    </>
                  ) : (
                    "Let's talk"
                  )}
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="text.primary">
                  {plan.qrCodes} QR Codes/month
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="text.primary">
                  {plan.links} links/month
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="text.primary">
                  {plan.landingPages} custom landing pages
                </Typography>
                <Box sx={{ mt: 2, textAlign: "left" }}>
                  <Typography variant="body2" color="text.secondary" fontWeight="bold">
                    {plan.name === "Core"
                      ? "Everything in Free test, plus:"
                      : `Everything in ${plans[plans.findIndex((p) => p.name === plan.name) - 1]?.name || "Free"}, plus:`}
                  </Typography>
                  {plan.features.map((feature, index) => (
                    <Typography key={index} variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <span style={{ marginRight: 8 }}>✓</span> {feature}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                {plan.price ? (
                  <Box sx={{ width: "80%" }}>
                    <Button
                      variant={plan.recommended ? "contained" : "outlined"}
                      color="primary"
                      fullWidth
                      onClick={() => handlePayment(plan.planType, plan.price)}
                      sx={{ mb: 2 }}
                    >
                      Upgrade to {plan.name}
                    </Button>
                    <div id={`paypal-button-${plan.planType}`}></div>
                  </Box>
                ) : (
                  <Button variant="contained" color="primary" href="/contact">
                    Get a Quote
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {error && (
        <Typography color="error" textAlign="center" sx={{ mt: 3 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
