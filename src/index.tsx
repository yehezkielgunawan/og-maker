import { Hono } from "hono";
import { renderer } from "./renderer";
import { FormComponent } from "./components/FormComponent";
import { PreviewComponent } from "./components/PreviewComponent";
import { InstructionsComponent } from "./components/InstructionsComponent";
import { generateOGImage, generateOGImageResponse, type OGImageData } from "./og-generator";
import { cache } from "@cf-wasm/og";

const app = new Hono<{
  Bindings: {
    // Add any environment bindings here if needed
  };
}>();

app.use(renderer);

app.get("/", (c) => {
  return c.render(
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">
            OG Image Generator
          </h1>
          <p class="text-lg text-gray-600">
            Create beautiful Open Graph images powered by @cf-wasm/og
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FormComponent />
          <PreviewComponent />
        </div>

        <InstructionsComponent />
      </div>
    </div>,
  );
});

// API endpoint for generating OG images using @cf-wasm/og (SVG format)
app.get("/api/og", async (c) => {
  // Set execution context for Cloudflare Workers
  cache.setExecutionContext(c.executionCtx);

  const { title, description, social, siteName, imageUrl } = c.req.query();

  const ogData: OGImageData = {
    title: title || "Title",
    description: description || "Description",
    social: social || "Twitter: @yehezgun",
    siteName: siteName || "yehezgun.com",
    imageUrl: imageUrl || undefined,
  };

  try {
    // For SVG format, we'll use the fallback function for now
    const svg = await generateOGImage(ogData);

    c.header("Content-Type", "image/svg+xml");
    c.header("Cache-Control", "public, max-age=31536000, immutable");

    return c.body(svg);
  } catch (error) {
    console.error("Error generating OG image:", error);
    return c.text("Error generating OG image", 500);
  }
});

// PNG endpoint for direct image serving using @cf-wasm/og
app.get("/api/og.png", async (c) => {
  // Set execution context for Cloudflare Workers
  cache.setExecutionContext(c.executionCtx);

  const { title, description, social, siteName, imageUrl } = c.req.query();

  const ogData: OGImageData = {
    title: title || "Title",
    description: description || "Description",
    social: social || "Twitter: @yehezgun",
    siteName: siteName || "yehezgun.com",
    imageUrl: imageUrl || undefined,
  };

  try {
    // Generate PNG using @cf-wasm/og ImageResponse
    const imageResponse = generateOGImageResponse(ogData);
    
    // Return the ImageResponse directly - it will be a PNG format
    return imageResponse;
  } catch (error) {
    console.error("Error generating OG image:", error);
    return c.text("Error generating OG image", 500);
  }
});

export default app;
