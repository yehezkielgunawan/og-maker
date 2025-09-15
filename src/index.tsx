import { Hono } from "hono";
import { renderer } from "./renderer";
import { FormComponent } from "./components/FormComponent";
import { PreviewComponent } from "./components/PreviewComponent";
import { InstructionsComponent } from "./components/InstructionsComponent";
import {
  generateOGImage,
  generateOGImageWebP,
  type OGImageData,
} from "./lib/takumi";
import { generateFallbackOGHTML } from "./lib/fallback-og";

const app = new Hono();

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
            Create beautiful Open Graph images with Takumi
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FormComponent />
          <PreviewComponent />
        </div>

        <InstructionsComponent />
      </div>

      {/* Client-side JavaScript for form handling */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          let debounceTimer;

          function updatePreviewAndURL() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
              const formData = new FormData(document.getElementById('og-form'));
              const params = new URLSearchParams();

              // Get form values
              const title = formData.get('title') || 'Title';
              const description = formData.get('description') || 'Description';
              const social = formData.get('social') || 'Twitter: @yehezgun';
              const siteName = formData.get('siteName') || 'yehezgun.com';
              const imageUrl = formData.get('imageUrl') || '';

              // Build query parameters
              params.set('title', title);
              params.set('description', description);
              params.set('social', social);
              params.set('siteName', siteName);
              if (imageUrl) params.set('imageUrl', imageUrl);

              // Update URL display
              const baseUrl = window.location.origin + '/api/og.png';
              const fullUrl = baseUrl + '?' + params.toString();
              document.getElementById('generated-url').value = fullUrl;

              // Update preview image
              updatePreviewImage(fullUrl);
            }, 500);
          }

          function updatePreviewImage(imageUrl) {
            const canvas = document.getElementById('og-canvas');
            const ctx = canvas.getContext('2d');

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Show loading state
            ctx.fillStyle = '#f3f4f6';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#6b7280';
            ctx.font = '24px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Generating preview...', canvas.width / 2, canvas.height / 2);

            // Load and display the generated image
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.onerror = () => {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.fillStyle = '#fef2f2';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.fillStyle = '#dc2626';
              ctx.font = '20px Arial, sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('Error loading preview', canvas.width / 2, canvas.height / 2);
            };
            img.src = imageUrl + '&t=' + Date.now(); // Add timestamp to prevent caching
          }

          // Copy URL to clipboard
          function copyToClipboard() {
            const urlInput = document.getElementById('generated-url');
            urlInput.select();
            document.execCommand('copy');

            const copyBtn = document.getElementById('copy-url-btn');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.backgroundColor = '#10b981';

            setTimeout(() => {
              copyBtn.textContent = originalText;
              copyBtn.style.backgroundColor = '#2563eb';
            }, 2000);
          }

          // Download image
          function downloadImage() {
            const url = document.getElementById('generated-url').value;
            if (!url) return;

            const link = document.createElement('a');
            link.href = url;
            link.download = 'og-image.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }

          // Event listeners
          document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('og-form');
            const inputs = form.querySelectorAll('input, textarea');

            // Add event listeners to all form inputs
            inputs.forEach(input => {
              input.addEventListener('input', updatePreviewAndURL);
            });

            // Copy button
            document.getElementById('copy-url-btn').addEventListener('click', copyToClipboard);

            // Download button
            document.getElementById('download-btn').addEventListener('click', downloadImage);

            // Initial load
            updatePreviewAndURL();
          });
        `,
        }}
      />
    </div>,
  );
});

// PNG endpoint for OG image generation
app.get("/api/og.png", async (c) => {
  try {
    const { title, description, social, siteName, imageUrl } = c.req.query();

    const ogData: OGImageData = {
      title: title || "Title",
      description: description || "Description",
      social: social || "Twitter: @yehezgun",
      siteName: siteName || "yehezgun.com",
      imageUrl: imageUrl || undefined,
    };

    try {
      // Try Takumi first
      const imageBuffer = await generateOGImage(ogData);

      // Return PNG image with proper headers
      c.header("Content-Type", "image/png");
      c.header("Cache-Control", "public, max-age=3600"); // Cache for 1 hour

      return c.body(imageBuffer);
    } catch (takumiError) {
      console.warn("Takumi failed, falling back to HTML:", takumiError);

      // Fallback to HTML rendering
      const htmlContent = generateFallbackOGHTML(ogData);

      // Return HTML with proper headers for image preview
      c.header("Content-Type", "text/html");
      return c.html(htmlContent);
    }
  } catch (error) {
    console.error("Error generating OG image:", error);
    c.status(500);
    return c.text("Error generating image");
  }
});

// WebP endpoint for OG image generation
app.get("/api/og.webp", async (c) => {
  try {
    const { title, description, social, siteName, imageUrl } = c.req.query();

    const ogData: OGImageData = {
      title: title || "Title",
      description: description || "Description",
      social: social || "Twitter: @yehezgun",
      siteName: siteName || "yehezgun.com",
      imageUrl: imageUrl || undefined,
    };

    try {
      // Try Takumi first
      const imageBuffer = await generateOGImageWebP(ogData);

      // Return WebP image with proper headers
      c.header("Content-Type", "image/webp");
      c.header("Cache-Control", "public, max-age=3600"); // Cache for 1 hour

      return c.body(imageBuffer);
    } catch (takumiError) {
      console.warn("Takumi failed, falling back to HTML:", takumiError);

      // Fallback to HTML rendering
      const htmlContent = generateFallbackOGHTML(ogData);

      // Return HTML with proper headers
      c.header("Content-Type", "text/html");
      return c.html(htmlContent);
    }
  } catch (error) {
    console.error("Error generating OG image:", error);
    c.status(500);
    return c.text("Error generating image");
  }
});

// Legacy HTML endpoint for backward compatibility
app.get("/api/og", async (c) => {
  const { title, description, social, siteName, imageUrl } = c.req.query();

  // Redirect to PNG endpoint with same parameters
  const params = new URLSearchParams();
  if (title) params.set("title", title);
  if (description) params.set("description", description);
  if (social) params.set("social", social);
  if (siteName) params.set("siteName", siteName);
  if (imageUrl) params.set("imageUrl", imageUrl);

  const redirectUrl = `/api/og.png?${params.toString()}`;
  return c.redirect(redirectUrl);
});

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok", service: "og-maker", engine: "takumi" });
});

export default app;
