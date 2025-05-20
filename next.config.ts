/** @type {import('next').NextConfig} */
const path = require("path");
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  transpilePackages: ["@odoo/o-spreadsheet"],
  webpack: (config) => {
    
    // Handle x-data-spreadsheet LESS files
    config.module.rules.push({
      test: /\.less$/,
      include: [path.resolve(__dirname, "node_modules/x-data-spreadsheet")],
      use: [
        "style-loader",
        "css-loader",
        {
          loader: "less-loader",
          options: {
            lessOptions: {
              javascriptEnabled: true,
              math: "always",
              relativeUrls: false,
            },
          },
        },
      ],
    });

    // Handle regular CSS files
    config.module.rules.push({
      test: /\.css$/,
      use: ["style-loader", "css-loader"],
      exclude: /node_modules\/x-data-spreadsheet/,
    });

    return config;
  },
  // Add transpilePackages to handle o-spreadsheet
};

export default nextConfig;
