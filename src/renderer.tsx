import { jsxRenderer } from "hono/jsx-renderer";
import { Link, ViteClient, Script } from "vite-ssr-components/hono";

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>OG Image Generator - Create Beautiful Open Graph Images</title>
        <meta
          name="description"
          content="Generate beautiful, customizable OG images with Satori-inspired layout using modern JSX components. Perfect for social media sharing."
        />
        <meta
          name="keywords"
          content="OG image generator, Open Graph, social media, image generation, Hono.js, JSX, Canvas API"
        />
        <meta name="author" content="Yehez" />

        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/yehez-icon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/yehez-icon.svg" />
        <link rel="manifest" href="/manifest.json" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://og-maker.yehezgun.com/" />
        <meta
          property="og:title"
          content="OG Image Generator - Create Beautiful Open Graph Images"
        />
        <meta
          property="og:description"
          content="Generate beautiful, customizable OG images with Satori-inspired layout using modern JSX components. Perfect for social media sharing."
        />
        <meta
          property="og:image"
          content="https://og-maker.yehezgun.com/api/og?title=OG%20Image%20Generator&description=Create%20beautiful%20Open%20Graph%20images"
        />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://og-maker.yehezgun.com/" />
        <meta
          property="twitter:title"
          content="OG Image Generator - Create Beautiful Open Graph Images"
        />
        <meta
          property="twitter:description"
          content="Generate beautiful, customizable OG images with Satori-inspired layout using modern JSX components. Perfect for social media sharing."
        />
        <meta
          property="twitter:image"
          content="https://og-maker.yehezgun.com/api/og?title=OG%20Image%20Generator&description=Create%20beautiful%20Open%20Graph%20images"
        />
        <meta property="twitter:creator" content="@yehezgun" />

        {/* Theme Color */}
        <meta name="theme-color" content="#1e293b" />
        <meta name="msapplication-TileColor" content="#1e293b" />

        <ViteClient />
        <Link href="/src/style.css" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Script src="/src/og-generator.js" />
      </body>
    </html>
  );
});
