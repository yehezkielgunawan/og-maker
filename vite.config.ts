import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import ssrPlugin from "vite-ssr-components/plugin";

export default defineConfig({
  plugins: [
    cloudflare({
      persist: {
        path: ".wrangler/state/v3",
      },
    }),
    ssrPlugin(),
    tailwindcss(),
  ],
  server: {
    fs: {
      allow: [".."],
    },
  },
  optimizeDeps: {
    exclude: ["@takumi-rs/wasm"],
  },
  build: {
    target: "esnext",
    rollupOptions: {
      external: [],
    },
  },
  worker: {
    format: "es",
  },
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      "@takumi-rs/wasm/takumi_wasm_bg.wasm":
        "@takumi-rs/wasm/takumi_wasm_bg.wasm?url",
    },
  },
});
