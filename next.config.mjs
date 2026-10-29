// The browser calls /api/... on this Next.js server (port 3000) and Next forwards
// the request to the Spring Boot API. Because the browser only talks to one origin,
// no CORS configuration is needed in the backend.
const API_URL = process.env.API_URL || "http://localhost:8080";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
