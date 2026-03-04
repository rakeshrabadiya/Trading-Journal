export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/history/:path*",
    "/analytics/:path*",
    "/settings/:path*",
    "/add-trade/:path*"
  ]
};
