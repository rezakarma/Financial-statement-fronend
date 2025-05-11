import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@syncfusion/ej2-base",
    "@syncfusion/ej2-react-base",
     "@syncfusion/ej2-spreadsheet",
    "@syncfusion/ej2-react-spreadsheet",
  ],
};

export default nextConfig;
