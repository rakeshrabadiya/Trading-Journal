/** @type {import('next').NextConfig} */
const isGithubPages =
  process.env.GITHUB_ACTIONS === "true" &&
  process.env.GITHUB_REPOSITORY === "rakeshrabadiya/Trading-Journal";

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
