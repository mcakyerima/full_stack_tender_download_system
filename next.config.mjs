/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "clear-swordfish-343.convex.cloud",
            }
        ]
    }
};

export default nextConfig;
