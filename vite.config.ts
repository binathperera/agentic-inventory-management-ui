import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    host: true, // Listen on all addresses
    allowedHosts: [".localhost"], // Allow any subdomain of localhost
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path, // Keep the /api path as is
      },
    },
  },
});
