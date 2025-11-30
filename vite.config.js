import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    base: "/",

    css: {
      postcss: {
        plugins: [tailwindcss(), autoprefixer()],
      },
    },

    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          secure: true,
        },
      },
    },

    // server: {
    //   port: 5173, // your dev port
    //   strictPort: true,
    //   // allow all hosts (Ngrok and others)
    //   host: true,
    //   allowedHosts: ["transitionary-lavera-subtransversely.ngrok-free.dev"],
    // },

    build: {
      outDir: "dist",
    },
  };
});
