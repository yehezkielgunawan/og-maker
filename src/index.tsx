import { Hono } from "hono";
import { renderer } from "./renderer";
import { FormComponent } from "./components/FormComponent";
import { PreviewComponent } from "./components/PreviewComponent";
import { InstructionsComponent } from "./components/InstructionsComponent";

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
            Create beautiful Open Graph images with Satori-inspired layout
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

// API endpoint for generating OG images
app.get("/api/og", async (c) => {
  const { title, description, social, siteName, imageUrl } = c.req.query();

  // Return a clean HTML page that renders only the OG image
  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OG Image Generator</title>
        <link rel="icon" type="image/svg+xml" href="/yehez-icon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta property="og:title" content="${title || "Title"}" />
        <meta property="og:description" content="${description || "Description"}" />
        <meta property="og:image" content="${c.req.url}" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${title || "Title"}" />
        <meta name="twitter:description" content="${description || "Description"}" />
        <meta name="twitter:image" content="${c.req.url}" />
        <style>
          body {
            margin: 0;
            padding: 0;
            background: #334155;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: Arial, sans-serif;
          }
          canvas {
            display: block;
            max-width: 100%;
            height: auto;
          }
        </style>
      </head>
      <body>
        <canvas id="og-canvas" width="1200" height="600"></canvas>

        <script>
          const canvas = document.getElementById('og-canvas');
          const ctx = canvas.getContext('2d');

          const params = new URLSearchParams(window.location.search);
          const data = {
            title: params.get('title') || 'Title',
            description: params.get('description') || 'Description',
            social: params.get('social') || 'Twitter: @yehezgun',
            siteName: params.get('siteName') || 'yehezgun.com',
            imageUrl: params.get('imageUrl') || ''
          };

          async function generateImage() {
            // Clear canvas and draw gradient background
            const gradient = ctx.createLinearGradient(0, 0, 1200, 600);
            gradient.addColorStop(0, '#1e293b');  // slate-800
            gradient.addColorStop(1, '#475569');  // slate-600
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1200, 600);

            // Draw image placeholder on the right side
            await drawImage(data.imageUrl);

            // Draw text content
            drawTextContent(data);
          }

          async function drawImage(imageUrl) {
            try {
              let img;

              if (imageUrl) {
                // Load custom image
                img = new Image();
                img.crossOrigin = 'anonymous';
                await new Promise((resolve, reject) => {
                  img.onload = resolve;
                  img.onerror = () => {
                    img = null;
                    resolve();
                  };
                  img.src = imageUrl;
                });
              } else {
                // Load default yehez-icon.svg
                img = new Image();
                await new Promise((resolve, reject) => {
                  img.onload = resolve;
                  img.onerror = () => {
                    img = null;
                    resolve();
                  };
                  img.src = '/yehez-icon.svg';
                });
              }

              if (!img) {
                // Draw default placeholder
                drawImagePlaceholder();
                return;
              }

              // Position image on the right side as a circle (256px like Satori)
              const imageSize = 256;
              const imageX = 1200 - imageSize - 96; // 96px padding like Satori
              const imageY = (420 - imageSize) / 2 + 48; // Center in main content area

              // Create circular clipping path
              ctx.save();
              ctx.beginPath();
              ctx.arc(
                imageX + imageSize / 2,
                imageY + imageSize / 2,
                imageSize / 2,
                0,
                Math.PI * 2
              );
              ctx.clip();

              // Fill background with lighter color
              ctx.fillStyle = '#64748b';
              ctx.fill();

              // Draw image
              ctx.drawImage(img, imageX, imageY, imageSize, imageSize);
              ctx.restore();
            } catch (error) {
              drawImagePlaceholder();
            }
          }

          function drawImagePlaceholder() {
            const imageSize = 256;
            const imageX = 1200 - imageSize - 96;
            const imageY = (420 - imageSize) / 2 + 48;

            // Draw circle
            ctx.save();
            ctx.fillStyle = '#64748b';
            ctx.beginPath();
            ctx.arc(
              imageX + imageSize / 2,
              imageY + imageSize / 2,
              imageSize / 2,
              0,
              Math.PI * 2
            );
            ctx.fill();

            // Draw placeholder icon
            ctx.fillStyle = '#ffffff';
            ctx.font = '72px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('👤', imageX + imageSize / 2, imageY + imageSize / 2);
            ctx.restore();
          }

          function drawTextContent(data) {
            const leftMargin = 96; // 24px * 4 for 1200px scale
            const maxWidth = 768; // max-w-3xl equivalent

            // Main content area (420px height, starting at y=48)
            const contentStartY = 48;
            const contentHeight = 420;

            // Draw title - large and prominent (5xl = 48px scaled up)
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 60px Inter, Arial, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';

            const titleLines = wrapText(data.title, maxWidth, 60);
            let currentY = contentStartY + 64; // pt-12 equivalent

            titleLines.forEach(line => {
              ctx.fillText(line, leftMargin, currentY);
              currentY += 72; // line height
            });

            // Draw description (3xl = 30px scaled up, mt-8 = 32px)
            currentY += 32;
            ctx.fillStyle = '#ffffff';
            ctx.font = '36px Inter, Arial, sans-serif';

            const descLines = wrapText(data.description, maxWidth, 36);
            descLines.slice(0, 2).forEach(line => {
              ctx.fillText(line, leftMargin, currentY);
              currentY += 50; // leading-snug
            });

            // Footer area (bottom 100px)
            const footerY = 520; // 600 - 100 + padding

            // Site name (bottom left) - bold xl
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 24px Inter, Arial, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(data.siteName, leftMargin, footerY);

            // Social media (bottom right) - medium xl
            ctx.textAlign = 'right';
            ctx.fillStyle = '#ffffff';
            ctx.font = '500 24px Inter, Arial, sans-serif';
            ctx.fillText(data.social, 1200 - leftMargin, footerY);
          }

          function wrapText(text, maxWidth, fontSize) {
            const words = text.split(' ');
            const lines = [];
            let currentLine = '';

            ctx.font = fontSize + 'px Arial, sans-serif';

            for (let word of words) {
              const testLine = currentLine + (currentLine ? ' ' : '') + word;
              const metrics = ctx.measureText(testLine);

              if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
              } else {
                currentLine = testLine;
              }
            }

            if (currentLine) {
              lines.push(currentLine);
            }

            return lines;
          }

          generateImage();
        </script>
      </body>
    </html>
  `);
});

// PNG endpoint for direct image serving
app.get("/api/og.png", async (c) => {
  const { title, description, social, siteName, imageUrl } = c.req.query();

  // Return HTML that renders to image for social media crawlers
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OG Image Generator</title>
        <link rel="icon" type="image/svg+xml" href="/yehez-icon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            width: 1200px;
            height: 600px;
            background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
            color: white;
            font-family: Inter, Arial, sans-serif;
            position: relative;
            overflow: hidden;
          }
          .main-content {
            height: 420px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 48px 96px 0 96px;
            box-sizing: border-box;
          }
          .content {
            display: flex;
            flex-direction: column;
            max-width: 768px;
          }
          .title {
            font-size: 60px;
            font-weight: bold;
            line-height: 1.2;
            margin-bottom: 32px;
            word-wrap: break-word;
          }
          .description {
            font-size: 36px;
            font-weight: 300;
            color: white;
            line-height: 1.4;
            word-wrap: break-word;
          }
          .footer {
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 96px;
            box-sizing: border-box;
          }
          .siteName {
            font-size: 24px;
            font-weight: 500;
          }
          .social {
            font-size: 24px;
            font-weight: 400;
          }
          .avatar {
            width: 256px;
            height: 256px;
            border-radius: 50%;
            background: #64748b;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 96px;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <div class="main-content">
          <div class="content">
            <div class="title">${title || "Title"}</div>
            <div class="description">${description || "Description"}</div>
          </div>
          <div class="avatar">
            ${imageUrl ? `<img src="${imageUrl}" alt="avatar" style="width: 100%; height: 100%; object-fit: cover;">` : "👤"}
          </div>
        </div>
        <div class="footer">
          <div class="siteName">${siteName || "yehezgun.com"}</div>
          <div class="social">${social || "Twitter: @yehezgun"}</div>
        </div>
      </body>
    </html>
  `;

  return c.html(html);
});

export default app;
