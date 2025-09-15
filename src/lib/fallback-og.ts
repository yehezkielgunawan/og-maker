export interface OGImageData {
  title: string;
  description: string;
  social: string;
  siteName: string;
  imageUrl?: string;
}

// Fallback HTML-to-image approach for development
export function generateFallbackOGHTML(data: OGImageData): string {
  const { title, description, social, siteName, imageUrl } = data;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=1200, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            width: 1200px;
            height: 630px;
            background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
            color: white;
            font-family: 'Inter', Arial, sans-serif;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }
          .main-content {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 48px 96px;
            height: 530px;
          }
          .content {
            display: flex;
            flex-direction: column;
            max-width: 768px;
            gap: 32px;
          }
          .title {
            font-size: 60px;
            font-weight: bold;
            line-height: 1.2;
            word-wrap: break-word;
            color: white;
            margin: 0;
          }
          .description {
            font-size: 36px;
            font-weight: 300;
            line-height: 1.4;
            word-wrap: break-word;
            color: white;
            margin: 0;
          }
          .avatar {
            width: 256px;
            height: 256px;
            border-radius: 50%;
            background: #64748b;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
          }
          .avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .avatar-placeholder {
            font-size: 96px;
            color: white;
            line-height: 1;
            text-align: center;
          }
          .footer {
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 96px;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
          }
          .site-name {
            font-size: 24px;
            font-weight: 500;
            color: white;
          }
          .social {
            font-size: 24px;
            font-weight: 400;
            color: white;
          }
        </style>
      </head>
      <body>
        <div class="main-content">
          <div class="content">
            <h1 class="title">${escapeHtml(title)}</h1>
            <p class="description">${escapeHtml(description)}</p>
          </div>
          <div class="avatar">
            ${imageUrl
              ? `<img src="${escapeHtml(imageUrl)}" alt="avatar" />`
              : '<div class="avatar-placeholder">👤</div>'
            }
          </div>
        </div>
        <div class="footer">
          <div class="site-name">${escapeHtml(siteName)}</div>
          <div class="social">${escapeHtml(social)}</div>
        </div>
      </body>
    </html>
  `;
}

// Simple HTML escaping
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Canvas-based fallback for generating actual image data
export function generateCanvasOGImage(data: OGImageData): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    // This would only work in a browser environment with Canvas API
    // For server-side, we'll need to use a different approach

    if (typeof window === 'undefined') {
      // Server-side fallback - return a simple PNG placeholder
      reject(new Error('Canvas not available in server environment'));
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(1, '#475569');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Draw text content
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px Inter, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // Title (with basic word wrapping)
    const titleLines = wrapText(ctx, data.title, 768, 60);
    let currentY = 80;
    titleLines.forEach(line => {
      ctx.fillText(line, 96, currentY);
      currentY += 72;
    });

    // Description
    currentY += 32;
    ctx.font = '36px Inter, Arial, sans-serif';
    ctx.fontWeight = '300';

    const descLines = wrapText(ctx, data.description, 768, 36);
    descLines.slice(0, 2).forEach(line => {
      ctx.fillText(line, 96, currentY);
      currentY += 50;
    });

    // Avatar placeholder
    const avatarX = 1200 - 256 - 96;
    const avatarY = (530 - 256) / 2 + 48;

    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(avatarX + 128, avatarY + 128, 128, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '96px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👤', avatarX + 128, avatarY + 128);

    // Footer
    const footerY = 580;
    ctx.font = 'bold 24px Inter, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(data.siteName, 96, footerY);

    ctx.textAlign = 'right';
    ctx.font = '24px Inter, Arial, sans-serif';
    ctx.fillText(data.social, 1200 - 96, footerY);

    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        blob.arrayBuffer().then(buffer => {
          resolve(new Uint8Array(buffer));
        });
      } else {
        reject(new Error('Failed to create blob'));
      }
    }, 'image/png');
  });
}

// Helper function for text wrapping
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, fontSize: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  ctx.font = `${fontSize}px Arial, sans-serif`;

  for (const word of words) {
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
