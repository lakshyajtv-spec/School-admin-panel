import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
const seoRoutes = {
  name: "seo-xml-routes",
  configureServer(server: import("vite").ViteDevServer) {
    server.middlewares.use((req, res, next) => {
      const route = (req.url || "").split("?")[0];
      if (route !== "/sitemap.xml" && route !== "/robots.txt") return next();
      const host = String(req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim();
      if (!/^[a-z0-9.-]+(?::\d{1,5})?$/i.test(host)) { res.statusCode = 400; res.end("Invalid host"); return; }
      res.setHeader("Cache-Control", "public, max-age=3600");
      if (route === "/robots.txt") {
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end(`User-agent: *\nAllow: /\nDisallow: /Lakshya-admin\nDisallow: /Lakshya-admin/\nSitemap: https://${host}/sitemap.xml\n`);
      } else {
        res.setHeader("Content-Type", "application/xml; charset=utf-8");
        res.end(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://${host}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url></urlset>`);
      }
    });
  },
};

export default defineConfig({
  server: { host: "0.0.0.0", allowedHosts: true },
  preview: { host: "0.0.0.0", allowedHosts: true },
  plugins: [react(), tailwindcss(), viteSingleFile(), seoRoutes],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
