/**
 * OG Image Generator - Modern ES6+ Client-Side Implementation
 * Handles Canvas-based OG image generation with Satori-inspired layout
 */

class OGImageGenerator {
  constructor() {
    this.canvas = document.getElementById("og-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.form = document.getElementById("og-form");
    this.generatedUrlInput = document.getElementById("generated-url");
    this.copyUrlBtn = document.getElementById("copy-url-btn");
    this.downloadBtn = document.getElementById("download-btn");

    this.debounceTimer = null;
    this.defaultImage = null;
    this.config = {
      canvas: {
        width: 1200,
        height: 600,
      },
      layout: {
        leftMargin: 96,
        contentStartY: 48,
        contentHeight: 420,
        footerY: 520,
        maxWidth: 768,
        imageSize: 256,
      },
      typography: {
        title: { size: 60, weight: "bold", lineHeight: 72 },
        description: { size: 36, weight: "normal", lineHeight: 50 },
        footer: { size: 24, weight: "bold" },
      },
      colors: {
        background: {
          start: "#1e293b", // slate-800
          end: "#475569", // slate-600
        },
        text: {
          primary: "#ffffff",
          secondary: "#ffffff",
        },
        image: {
          background: "#64748b",
        },
      },
    };

    this.init();
  }

  async init() {
    try {
      await this.loadDefaultImage();
      this.setupEventListeners();
      await this.generateImage();
      this.updateURL();
    } catch (error) {
      console.error("Failed to initialize OG Generator:", error);
    }
  }

  async loadDefaultImage() {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.defaultImage = img;
        resolve();
      };
      img.onerror = () => {
        console.warn("Failed to load default image");
        resolve();
      };
      img.src = "/yehez-icon.svg";
    });
  }

  setupEventListeners() {
    // Form input listeners with debouncing
    const inputs = this.form.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.addEventListener("input", this.handleFormInput.bind(this));
    });

    // Control button listeners
    this.copyUrlBtn.addEventListener("click", this.copyURL.bind(this));
    this.downloadBtn.addEventListener("click", this.downloadImage.bind(this));

    // Load parameters from URL if present
    this.loadFromURL();
  }

  handleFormInput() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.generateImage();
      this.updateURL();
    }, 500);
  }

  getFormData() {
    return {
      title: document.getElementById("title").value || "Title",
      description:
        document.getElementById("description").value || "Description",
      social: document.getElementById("social").value || "Twitter: @yehezgun",
      siteName: document.getElementById("siteName").value || "yehezgun.com",
      imageUrl: document.getElementById("imageUrl").value || "",
    };
  }

  async generateImage() {
    const data = this.getFormData();

    // Clear canvas and draw gradient background
    this.drawBackground();

    // Draw content
    await this.drawImage(data.imageUrl);
    this.drawTextContent(data);
  }

  drawBackground() {
    const { width, height } = this.config.canvas;
    const { start, end } = this.config.colors.background;

    // Create diagonal gradient (135deg)
    const gradient = this.ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, start);
    gradient.addColorStop(1, end);

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);
  }

  async drawImage(imageUrl) {
    try {
      let img = null;

      if (imageUrl) {
        img = await this.loadCustomImage(imageUrl);
      }

      if (!img && this.defaultImage) {
        img = this.defaultImage;
      }

      if (img) {
        this.drawCircularImage(img);
      } else {
        this.drawImagePlaceholder();
      }
    } catch (error) {
      console.error("Error drawing image:", error);
      this.drawImagePlaceholder();
    }
  }

  async loadCustomImage(imageUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = imageUrl;
    });
  }

  drawCircularImage(img) {
    const { imageSize, leftMargin, contentStartY, contentHeight } =
      this.config.layout;
    const { width } = this.config.canvas;

    const imageX = width - imageSize - leftMargin;
    const imageY = (contentHeight - imageSize) / 2 + contentStartY;

    // Create circular clipping path
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(
      imageX + imageSize / 2,
      imageY + imageSize / 2,
      imageSize / 2,
      0,
      Math.PI * 2,
    );
    this.ctx.clip();

    // Fill background
    this.ctx.fillStyle = this.config.colors.image.background;
    this.ctx.fill();

    // Draw image
    this.ctx.drawImage(img, imageX, imageY, imageSize, imageSize);
    this.ctx.restore();
  }

  drawImagePlaceholder() {
    const { imageSize, leftMargin, contentStartY, contentHeight } =
      this.config.layout;
    const { width } = this.config.canvas;

    const imageX = width - imageSize - leftMargin;
    const imageY = (contentHeight - imageSize) / 2 + contentStartY;

    // Draw circle
    this.ctx.save();
    this.ctx.fillStyle = this.config.colors.image.background;
    this.ctx.beginPath();
    this.ctx.arc(
      imageX + imageSize / 2,
      imageY + imageSize / 2,
      imageSize / 2,
      0,
      Math.PI * 2,
    );
    this.ctx.fill();

    // Draw placeholder icon
    this.ctx.fillStyle = this.config.colors.text.primary;
    this.ctx.font = "96px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText("👤", imageX + imageSize / 2, imageY + imageSize / 2);
    this.ctx.restore();
  }

  drawTextContent(data) {
    const { leftMargin, contentStartY, maxWidth, footerY } = this.config.layout;
    const { width } = this.config.canvas;

    this.drawTitle(data.title, leftMargin, contentStartY, maxWidth);
    this.drawDescription(data.description, leftMargin, contentStartY, maxWidth);
    this.drawFooter(data.siteName, data.social, leftMargin, footerY, width);
  }

  drawTitle(title, leftMargin, contentStartY, maxWidth) {
    const { size, weight, lineHeight } = this.config.typography.title;

    this.ctx.fillStyle = this.config.colors.text.primary;
    this.ctx.font = `${weight} ${size}px Inter, Arial, sans-serif`;
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "top";

    const titleLines = this.wrapText(title, maxWidth, size);
    let currentY = contentStartY + 64; // pt-12 equivalent

    titleLines.forEach((line) => {
      this.ctx.fillText(line, leftMargin, currentY);
      currentY += lineHeight;
    });

    return currentY;
  }

  drawDescription(description, leftMargin, contentStartY, maxWidth) {
    const { size, lineHeight } = this.config.typography.description;

    // Calculate position after title
    const titleHeight =
      this.config.typography.title.lineHeight *
      Math.max(
        1,
        this.wrapText(description, maxWidth, this.config.typography.title.size)
          .length,
      );
    let currentY = contentStartY + 64 + titleHeight + 32;

    this.ctx.fillStyle = this.config.colors.text.secondary;
    this.ctx.font = `${size}px Inter, Arial, sans-serif`;

    const descLines = this.wrapText(description, maxWidth, size);
    descLines.slice(0, 2).forEach((line) => {
      this.ctx.fillText(line, leftMargin, currentY);
      currentY += lineHeight;
    });
  }

  drawFooter(siteName, social, leftMargin, footerY, canvasWidth) {
    const { size, weight } = this.config.typography.footer;

    // Site name (bottom left)
    this.ctx.fillStyle = this.config.colors.text.primary;
    this.ctx.font = `${weight} ${size}px Inter, Arial, sans-serif`;
    this.ctx.textAlign = "left";
    this.ctx.fillText(siteName, leftMargin, footerY);

    // Social media (bottom right)
    this.ctx.textAlign = "right";
    this.ctx.font = `500 ${size}px Inter, Arial, sans-serif`;
    this.ctx.fillText(social, canvasWidth - leftMargin, footerY);
  }

  wrapText(text, maxWidth, fontSize) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    this.ctx.font = `${fontSize}px Inter, Arial, sans-serif`;

    for (const word of words) {
      const testLine = currentLine + (currentLine ? " " : "") + word;
      const metrics = this.ctx.measureText(testLine);

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

  updateURL() {
    const data = this.getFormData();
    const baseUrl = `${window.location.origin}/api/og`;
    const params = new URLSearchParams();

    // Only add non-default values
    if (data.title !== "Title") params.set("title", data.title);
    if (data.description !== "Description")
      params.set("description", data.description);
    if (data.social !== "Twitter: @yehezgun") params.set("social", data.social);
    if (data.siteName !== "yehezgun.com") params.set("siteName", data.siteName);
    if (data.imageUrl) params.set("imageUrl", data.imageUrl);

    const queryString = params.toString();
    const fullUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    this.generatedUrlInput.value = fullUrl;
  }

  async copyURL() {
    try {
      await navigator.clipboard.writeText(this.generatedUrlInput.value);
      this.showButtonFeedback(
        this.copyUrlBtn,
        "Copied!",
        "bg-green-600",
        "bg-blue-600",
      );
    } catch (err) {
      console.error("Failed to copy URL:", err);
      // Fallback for older browsers
      this.generatedUrlInput.select();
      document.execCommand("copy");
    }
  }

  downloadImage() {
    const data = this.getFormData();
    const filename = `og-image-${this.slugify(data.title)}.png`;

    const link = document.createElement("a");
    link.download = filename;
    link.href = this.canvas.toDataURL("image/png");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showButtonFeedback(this.downloadBtn, "Downloaded!");
  }

  showButtonFeedback(button, text, successClass = "", originalClass = "") {
    const originalText = button.textContent;
    button.textContent = text;

    if (successClass) {
      button.classList.add(successClass);
      if (originalClass) button.classList.remove(originalClass);
    }

    setTimeout(() => {
      button.textContent = originalText;
      if (successClass) {
        button.classList.remove(successClass);
        if (originalClass) button.classList.add(originalClass);
      }
    }, 2000);
  }

  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  loadFromURL() {
    const params = new URLSearchParams(window.location.search);

    const fields = ["title", "description", "social", "siteName", "imageUrl"];
    fields.forEach((field) => {
      if (params.has(field)) {
        const element = document.getElementById(field);
        if (element) {
          element.value = params.get(field);
        }
      }
    });

    // Generate image with loaded parameters
    setTimeout(() => {
      this.generateImage();
      this.updateURL();
    }, 100);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new OGImageGenerator();
});
