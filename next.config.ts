/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */

const withNextIntl = require("next-intl/plugin")("./app/i18n/request.ts");

const nextConfig = {
	webpack(config: any) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"],
		});

		return config;
	},
	images: {
		domains: ["via.placeholder.com", "mfo.qissseee.tech", 'mfo.webalchemy.fun'],
	},
	reactStrictMode: false,
};

module.exports = withNextIntl(nextConfig);
