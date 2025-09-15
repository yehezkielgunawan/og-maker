import { initSync, Renderer } from "@takumi-rs/wasm";
import { container, text, image } from "@takumi-rs/helpers";

// Initialize WASM module once
let isInitialized = false;
let renderer: Renderer | null = null;

// Dynamic import approach that works in Cloudflare Workers
async function getWasmModule() {
  try {
    // Use dynamic import with proper WASM handling
    const wasmModule = await import("@takumi-rs/wasm/takumi_wasm_bg.wasm");
    return wasmModule.default || wasmModule;
  } catch (error) {
    console.error("Failed to import WASM module:", error);
    throw new Error("WASM module not available");
  }
}

export async function initializeTakumi(): Promise<Renderer> {
  if (!isInitialized) {
    try {
      const wasmModule = await getWasmModule();
      initSync({ module: wasmModule });
      renderer = new Renderer();
      isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize Takumi:", error);
      throw error;
    }
  }

  if (!renderer) {
    throw new Error("Takumi renderer not initialized");
  }

  return renderer;
}

export interface OGImageData {
  title: string;
  description: string;
  social: string;
  siteName: string;
  imageUrl?: string;
}

// Convert default icon to data URI
async function getDefaultIconDataUri(): Promise<string> {
  try {
    // Create a simple SVG for the default icon
    const defaultIconSvg = `<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="256" height="256" rx="128" fill="#64748b"/>
      <text x="128" y="144" text-anchor="middle" font-size="96" fill="white">👤</text>
    </svg>`;

    return "data:image/svg+xml;base64," + btoa(defaultIconSvg);
  } catch (error) {
    console.warn("Could not create default icon, using fallback");
    return "";
  }
}

// OG Image template using Takumi helpers
function createOGImageTemplate(data: OGImageData) {
  const { title, description, social, siteName, imageUrl } = data;

  // Create the main container
  return container({
    style: {
      width: 1200,
      height: 630,
      backgroundImage: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
      display: "flex",
      flexDirection: "column",
      fontFamily: "Inter, Arial, sans-serif",
      color: "#ffffff",
      position: "relative",
    },
    children: [
      // Main content area
      container({
        style: {
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "48px 96px",
          height: 530,
        },
        children: [
          // Left side - Text content
          container({
            style: {
              display: "flex",
              flexDirection: "column",
              maxWidth: 768,
              gap: 32,
            },
            children: [
              // Title
              text(title, {
                fontSize: 60,
                fontWeight: "bold",
                lineHeight: 1.2,
                color: "#ffffff",
                wordBreak: "break-word",
              }),
              // Description
              text(description, {
                fontSize: 36,
                fontWeight: "300",
                lineHeight: 1.4,
                color: "#ffffff",
                wordBreak: "break-word",
              }),
            ],
          }),
          // Right side - Avatar/Image
          container({
            style: {
              width: 256,
              height: 256,
              borderRadius: "50%",
              backgroundColor: "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              position: "relative",
            },
            children: imageUrl
              ? [
                  image({
                    src: imageUrl,
                    width: 256,
                    height: 256,
                    style: {
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    },
                  }),
                ]
              : [
                  text("👤", {
                    fontSize: 96,
                    textAlign: "center",
                    color: "#ffffff",
                    lineHeight: 1,
                  }),
                ],
          }),
        ],
      }),
      // Footer
      container({
        style: {
          height: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 96px",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        },
        children: [
          // Site name
          text(siteName, {
            fontSize: 24,
            fontWeight: "500",
            color: "#ffffff",
          }),
          // Social
          text(social, {
            fontSize: 24,
            fontWeight: "400",
            color: "#ffffff",
          }),
        ],
      }),
    ],
  });
}

export async function generateOGImage(data: OGImageData): Promise<Uint8Array> {
  const takumiRenderer = await initializeTakumi();

  // Handle default icon
  let processedData = { ...data };
  if (!processedData.imageUrl) {
    processedData.imageUrl = await getDefaultIconDataUri();
  }

  try {
    // Create Takumi node tree
    const node = createOGImageTemplate(processedData);

    // Render to PNG
    const imageBuffer = takumiRenderer.render(node, 1200, 630, "png");

    return imageBuffer;
  } catch (error) {
    console.error("Error generating OG image:", error);

    // Fallback: try without image
    const fallbackData = { ...processedData, imageUrl: undefined };
    const node = createOGImageTemplate(fallbackData);
    const imageBuffer = takumiRenderer.render(node, 1200, 630, "png");

    return imageBuffer;
  }
}

export async function generateOGImageWebP(
  data: OGImageData,
): Promise<Uint8Array> {
  const takumiRenderer = await initializeTakumi();

  // Handle default icon
  let processedData = { ...data };
  if (!processedData.imageUrl) {
    processedData.imageUrl = await getDefaultIconDataUri();
  }

  try {
    // Create Takumi node tree
    const node = createOGImageTemplate(processedData);

    // Render to WebP
    const imageBuffer = takumiRenderer.render(node, 1200, 630, "webp");

    return imageBuffer;
  } catch (error) {
    console.error("Error generating OG image:", error);

    // Fallback: try without image
    const fallbackData = { ...processedData, imageUrl: undefined };
    const node = createOGImageTemplate(fallbackData);
    const imageBuffer = takumiRenderer.render(node, 1200, 630, "webp");

    return imageBuffer;
  }
}
