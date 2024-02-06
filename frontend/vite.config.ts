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
        target: "https://notebites.app",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/file-docs": {
        target: "https://notebites.app/file-docs",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/file-docs/, ""),
      },
      "/repos": {
        target: "https://notebites.app/repos",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/repos/, ""),
      },
    },
  },
})
