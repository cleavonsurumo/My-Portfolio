/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		// Skip ESLint during production builds on Vercel to avoid incompatible CLI option errors.
		// Allows the deployment to succeed while keeping linting available locally.
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
