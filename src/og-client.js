// OG Image Generator Client Script - SVG/Satori Version
class OGImageGenerator {
  constructor() {
    this.form = null;
    this.preview = null;
    this.urlField = null;
    this.copyBtn = null;
    this.downloadBtn = null;
    this.updateTimeout = null;

    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Get form elements
    this.form = document.getElementById("og-form");
    this.preview = document.getElementById("og-preview");
    this.urlField = document.getElementById("generated-url");
    this.copyBtn = document.getElementById("copy-url-btn");
    this.downloadBtn = document.getElementById("download-btn");

    if (!this.form || !this.preview || !this.urlField) {
      console.warn("Required elements not found");
      return;
    }

    // Add event listeners
    this.setupEventListeners();

    // Generate initial preview
    this.updatePreview();
  }

  setupEventListeners() {
    // Form input events with debouncing
    const inputs = this.form.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.addEventListener("input", () => this.debounceUpdate());
      input.addEventListener("change", () => this.debounceUpdate());
    });

    // Copy button
    if (this.copyBtn) {
      this.copyBtn.addEventListener("click", () => this.copyUrl());
    }

    // Download button
    if (this.downloadBtn) {
      this.downloadBtn.addEventListener("click", () => this.downloadImage());
    }
  }

  debounceUpdate() {
    // Clear existing timeout
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    // Set new timeout (500ms delay as specified)
    this.updateTimeout = setTimeout(() => {
      this.updatePreview();
    }, 500);
  }

  getFormData() {
    const formData = new FormData(this.form);
    return {
      title: formData.get("title") || "Title",
      description: formData.get("description") || "Description",
      social: formData.get("social") || "Twitter: @yehezgun",
      siteName: formData.get("siteName") || "yehezgun.com",
      imageUrl: formData.get("imageUrl") || "",
    };
  }

  generateUrl(data, endpoint = "/api/og") {
    const params = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {
      if (value && value.trim()) {
        params.append(key, value.trim());
      }
    });

    return `${window.location.origin}${endpoint}?${params.toString()}`;
  }

  updatePreview() {
    const data = this.getFormData();
    const url = this.generateUrl(data);

    // Update preview image
    if (this.preview) {
      this.preview.src = url;
    }

    // Update URL field
    if (this.urlField) {
      this.urlField.value = url;
    }

    // Update download button data
    if (this.downloadBtn) {
      this.downloadBtn.dataset.url = url;
    }
  }

  async copyUrl() {
    if (!this.urlField) return;

    try {
      await navigator.clipboard.writeText(this.urlField.value);

      // Show feedback
      const originalText = this.copyBtn.textContent;
      this.copyBtn.textContent = "Copied!";
      this.copyBtn.classList.add("bg-green-600", "hover:bg-green-700");
      this.copyBtn.classList.remove("bg-blue-600", "hover:bg-blue-700");

      setTimeout(() => {
        this.copyBtn.textContent = originalText;
        this.copyBtn.classList.remove("bg-green-600", "hover:bg-green-700");
        this.copyBtn.classList.add("bg-blue-600", "hover:bg-blue-700");
      }, 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);

      // Fallback: select text
      this.urlField.select();
      this.urlField.setSelectionRange(0, 99999);

      try {
        document.execCommand("copy");
        this.showCopyFeedback();
      } catch (fallbackErr) {
        console.error("Fallback copy failed:", fallbackErr);
      }
    }
  }

  showCopyFeedback() {
    const originalText = this.copyBtn.textContent;
    this.copyBtn.textContent = "Copied!";
    this.copyBtn.classList.add("bg-green-600", "hover:bg-green-700");
    this.copyBtn.classList.remove("bg-blue-600", "hover:bg-blue-700");

    setTimeout(() => {
      this.copyBtn.textContent = originalText;
      this.copyBtn.classList.remove("bg-green-600", "hover:bg-green-700");
      this.copyBtn.classList.add("bg-blue-600", "hover:bg-blue-700");
    }, 2000);
  }

  async downloadImage() {
    const data = this.getFormData();
    const url = this.generateUrl(data);

    try {
      // Show loading state
      const originalText = this.downloadBtn.textContent;
      this.downloadBtn.textContent = "Downloading...";
      this.downloadBtn.disabled = true;

      // Fetch the SVG
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const svgText = await response.text();

      // Create blob and download
      const blob = new Blob([svgText], { type: "image/svg+xml" });
      const downloadUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = this.generateFilename(data);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(downloadUrl);

      // Show success feedback
      this.downloadBtn.textContent = "Downloaded!";
      this.downloadBtn.classList.add("bg-green-600", "hover:bg-green-700");
      this.downloadBtn.classList.remove("bg-green-600", "hover:bg-green-700");

      setTimeout(() => {
        this.downloadBtn.textContent = originalText;
        this.downloadBtn.classList.remove("bg-green-600", "hover:bg-green-700");
        this.downloadBtn.classList.add("bg-green-600", "hover:bg-green-700");
        this.downloadBtn.disabled = false;
      }, 2000);
    } catch (error) {
      console.error("Download failed:", error);

      // Show error feedback
      this.downloadBtn.textContent = "Download Failed";
      this.downloadBtn.classList.add("bg-red-600", "hover:bg-red-700");
      this.downloadBtn.classList.remove("bg-green-600", "hover:bg-green-700");

      setTimeout(() => {
        this.downloadBtn.textContent = "Download OG Image";
        this.downloadBtn.classList.remove("bg-red-600", "hover:bg-red-700");
        this.downloadBtn.classList.add("bg-green-600", "hover:bg-green-700");
        this.downloadBtn.disabled = false;
      }, 3000);
    }
  }

  generateFilename(data) {
    // Create a safe filename from the title
    const title = data.title || "og-image";
    const safeName = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50);

    return `${safeName}-og-image.svg`;
  }

  // Utility method for responsive image scaling (no longer needed with img tag)
  updatePreviewScale() {
    // img tag handles responsive scaling automatically with max-w-full max-h-full classes
    // No manual scaling needed
  }
}

// Initialize the OG Image Generator
const ogGenerator = new OGImageGenerator();

// Handle window resize for responsive preview
window.addEventListener("resize", () => {
  if (ogGenerator.updatePreviewScale) {
    ogGenerator.updatePreviewScale();
  }
});
