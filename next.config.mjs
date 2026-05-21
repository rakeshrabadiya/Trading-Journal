/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = isGithubPages
  ? {
      output: "export",
      images: {
        unoptimized: true,
      },
      basePath: "/Trading-Journal",
      assetPrefix: "/Trading-Journal/",
    }
  : {};

export default nextConfig;
