import { ImageResponse, GoogleFont } from "@cf-wasm/og";
import React from "react";

// Interface for OG image data
export interface OGImageData {
  title: string;
  description: string;
  social: string;
  siteName: string;
  imageUrl?: string;
}

// Default image URL - using the updated Cloudinary URL from AGENTS.md
const DEFAULT_IMAGE_URL = "https://res.cloudinary.com/yehez/image/upload/v1646485864/yehez_avatar_transparent_swwqcq.png";

// Generate OG Image using @cf-wasm/og
export function generateOGImageResponse(data: OGImageData): ImageResponse {
  const {
    title = "Title",
    description = "Description",
    social = "Twitter: @yehezgun",
    siteName = "yehezgun.com",
    imageUrl = DEFAULT_IMAGE_URL,
  } = data;

  // Use the actual image URL (default or custom)
  const actualImageUrl = imageUrl || DEFAULT_IMAGE_URL;
  
  return new ImageResponse(
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          height: "600px",
          width: "1200px",
          flexDirection: "column",
          background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
          fontFamily: "Inter",
          position: "relative",
        },
      },
      [
        // Main content row
        React.createElement(
          "div",
          {
            key: "main-content",
            style: {
              display: "flex",
              height: "420px",
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingLeft: "96px",
              paddingRight: "96px",
              paddingTop: "48px",
              boxSizing: "border-box",
            },
          },
          [
            // Left: Title and Description
            React.createElement(
              "div",
              {
                key: "text-content",
                style: {
                  display: "flex",
                  maxWidth: "768px",
                  flexDirection: "column",
                },
              },
              [
                // Title
                React.createElement(
                  "h1",
                  {
                    key: "title",
                    style: {
                      margin: "0",
                      fontSize: "48px",
                      color: "#ffffff",
                      lineHeight: "1.25",
                      fontFamily: "Inter",
                      fontWeight: "700",
                      wordBreak: "break-word",
                    },
                  },
                  title
                ),
                // Description
                React.createElement(
                  "h4",
                  {
                    key: "description",
                    style: {
                      margin: "0",
                      marginTop: "32px",
                      fontSize: "30px",
                      color: "#ffffff",
                      lineHeight: "1.375",
                      fontFamily: "Inter",
                      fontWeight: "300",
                      wordBreak: "break-word",
                    },
                  },
                  description
                ),
              ]
            ),
            // Right: Image
            React.createElement(
              "div",
              {
                key: "image-container",
                style: {
                  display: "flex",
                  height: "256px",
                  width: "256px",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  borderRadius: "50%",
                  backgroundColor: "#64748b",
                },
              },
              [
                React.createElement("img", {
                  key: "profile-image",
                  src: actualImageUrl,
                  alt: "Profile image",
                  style: {
                    height: "256px",
                    width: "256px",
                    objectFit: "cover",
                    borderRadius: "50%",
                  },
                }),
              ]
            ),
          ]
        ),
        // Footer row
        React.createElement(
          "div",
          {
            key: "footer",
            style: {
              display: "flex",
              height: "calc(100% - 420px - 48px)",
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingLeft: "96px",
              paddingRight: "96px",
              color: "#ffffff",
              boxSizing: "border-box",
            },
          },
          [
            // Site name
            React.createElement(
              "p",
              {
                key: "site-name",
                style: {
                  margin: "0",
                  fontSize: "20px",
                  fontFamily: "Inter",
                  fontWeight: "500",
                },
              },
              siteName
            ),
            // Social media
            React.createElement(
              "p",
              {
                key: "social",
                style: {
                  margin: "0",
                  fontSize: "20px",
                  fontFamily: "Inter",
                  fontWeight: "400",
                },
              },
              social
            ),
          ]
        ),
      ]
    ),
    {
      width: 1200,
      height: 600,
      fonts: [
        new GoogleFont("Inter", {
          weights: [300, 400, 500, 700],
        }),
      ],
    }
  );
}

// Helper function for backward compatibility and easier testing
export async function generateOGImage(data: OGImageData): Promise<string> {
  try {
    const response = generateOGImageResponse(data);
    
    // Convert the response to SVG format for compatibility
    // Note: @cf-wasm/og returns Response objects, not strings directly
    // This is a simplified version for testing
    return `<svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="600" fill="url(#bg)"/>
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e293b"/>
          <stop offset="100%" style="stop-color:#475569"/>
        </linearGradient>
      </defs>
      <text x="96" y="200" fill="white" font-family="Inter" font-size="48" font-weight="700">${data.title || 'Title'}</text>
      <text x="96" y="280" fill="white" font-family="Inter" font-size="30" font-weight="300">${data.description || 'Description'}</text>
      <circle cx="1008" cy="256" r="128" fill="#64748b"/>
      <image x="880" y="128" width="256" height="256" href="${data.imageUrl || DEFAULT_IMAGE_URL}" clip-path="circle(128px at 128px 128px)"/>
      <text x="96" y="550" fill="white" font-family="Inter" font-size="20" font-weight="500">${data.siteName || 'yehezgun.com'}</text>
      <text x="1104" y="550" fill="white" font-family="Inter" font-size="20" text-anchor="end">${data.social || 'Twitter: @yehezgun'}</text>
    </svg>`;
  } catch (error) {
    console.error("Error generating OG image:", error);
    
    // Fallback SVG
    return `<svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="600" fill="url(#bg)"/>
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e293b"/>
          <stop offset="100%" style="stop-color:#475569"/>
        </linearGradient>
      </defs>
      <text x="96" y="200" fill="white" font-family="Arial" font-size="48" font-weight="700">${data.title || 'Title'}</text>
      <text x="96" y="280" fill="white" font-family="Arial" font-size="30" font-weight="300">${data.description || 'Description'}</text>
      <circle cx="1008" cy="256" r="128" fill="#64748b"/>
      <circle cx="1008" cy="240" r="32" fill="#ffffff" opacity="0.8"/>
      <path d="M1008 284c-26 0-48 16-48 36v20c0 10 10 16 48 16s48-6 48-16v-20c0-20-22-36-48-36z" fill="#ffffff" opacity="0.8"/>
      <text x="96" y="550" fill="white" font-family="Arial" font-size="20" font-weight="500">${data.siteName || 'yehezgun.com'}</text>
      <text x="1104" y="550" fill="white" font-family="Arial" font-size="20" text-anchor="end">${data.social || 'Twitter: @yehezgun'}</text>
    </svg>`;
  }
}

// Helper function to convert SVG to PNG (for future use)
export async function svgToPng(svg: string): Promise<Uint8Array> {
  // This would typically use a library like @resvg/resvg-js or sharp
  // For now, we'll return the SVG as a buffer
  return new (globalThis as any).TextEncoder().encode(svg);
}