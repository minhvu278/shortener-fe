import { NextRequest, NextResponse } from "next/server";

// Các route công khai (không cần đăng nhập)
const publicRoutes = ["/login", "/register", "/password/:path*"];
// Các route bảo vệ (cần đăng nhập)
const protectedRoutes = ["/dashboard", "/dashboard/links", "/dashboard/qr-codes"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lấy token từ cookies
  const token = request.cookies.get("token")?.value;

  // Trường hợp 1: Đã đăng nhập
  if (token) {
    // Nếu truy cập vào bất kỳ route nào ngoài protected routes và /password, chuyển hướng về /dashboard
    if (
      !protectedRoutes.some((route) => pathname.startsWith(route)) &&
      !pathname.startsWith("/password")
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Trường hợp 2: Chưa đăng nhập
  else {
    // Nếu truy cập vào protected routes, chuyển hướng sang /login
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Cho phép request tiếp tục nếu không có điều kiện nào khớp
  return NextResponse.next();
}

// Áp dụng middleware cho tất cả các route (trừ static files)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
