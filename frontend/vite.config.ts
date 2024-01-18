import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://34.73.53.91",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/file-docs": {
        target: "http://34.73.53.91/file-docs",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/file-docs/, ""),
      },
    },
  },
})
