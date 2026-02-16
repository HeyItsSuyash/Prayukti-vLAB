/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@repo/ui"],
    env: {
        // Automatically load and strip FRONTEND_ prefix from environment variables
        ...Object.keys(process.env).reduce((acc, key) => {
            if (key.startsWith('FRONTEND_')) {
                const strippedKey = key.replace(/^FRONTEND_/, '');
                acc[strippedKey] = process.env[key];
            }
            return acc;
        }, {})
    }
};

export default nextConfig;
