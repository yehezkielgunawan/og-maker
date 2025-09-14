# OG Image Generator

A dynamic Open Graph image generator built with Hono.js, Vite, Satori, and Tailwind CSS. Create beautiful, customizable OG images with server-side SVG generation using Satori's JSX-to-SVG rendering for your content with real-time preview and easy sharing.

[![CI](https://github.com/yehezgun/og-maker/workflows/CI/badge.svg)](https://github.com/yehezgun/og-maker/actions)
[![Deploy](https://github.com/yehezgun/og-maker/workflows/Deploy/badge.svg)](https://github.com/yehezgun/og-maker/actions)
![OG Image Generator](https://img.shields.io/badge/Built%20with-Hono.js-orange) 
![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-blue) 
![Vite](https://img.shields.io/badge/Powered%20by-Vite-yellow)

## ✨ Features

- **Modern JSX Architecture**: Clean component-based structure using Hono's JSX capabilities
- **Satori-Powered**: Server-side SVG generation using Satori's JSX-to-SVG rendering
- **Inter Font Support**: Professional typography using Inter font family with multiple weights
- **Real-time Preview**: See your OG image update as you type with 500ms debouncing
- **Customizable Content**: Edit title, description, social media handle, and site name
- **Image Support**: Use custom images or the default avatar icon in 256px circular frame
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **SVG Output**: Clean, scalable SVG generation for crisp images at any size
- **URL Generation**: Get shareable URLs with query parameters
- **One-click Download**: Download high-quality SVG images (1200x600px)
- **Copy to Clipboard**: Easy URL copying for sharing
- **Server-side Rendering**: Fast, reliable image generation using Satori
- **PWA Ready**: Includes favicon, manifest.json, and comprehensive meta tags
- **SEO Optimized**: Complete Open Graph and Twitter Card meta tags

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd og-maker
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Start the development server:
```bash
pnpm run dev
# or
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Usage

### Basic Usage

1. **Customize Your Content**
   - Fill in the title, description, social media handle, and site name
   - The preview updates automatically as you type (with 500ms delay)

2. **Add Custom Images** (Optional)
   - Provide an image URL to use a custom image
   - Leave blank to use the default `yehez-icon.svg` with rounded background

3. **Generate Shareable URL**
   - Copy the generated URL to share your OG image
   - Use it in your website's meta tags for social media previews

4. **Download the Image**
   - Click "Download OG Image" to save as PNG (1200x630px)
   - Perfect for social media platforms and website meta tags

### Default Values

- **Title**: "Title"
- **Description**: "Description"
- **Social Media**: "Twitter: @yehezgun"
- **Site Name**: "yehezgun.com"
- **Image**: `yehez-icon.svg` (displayed as 256px circular avatar on the right side)

### URL Parameters

You can pre-fill the form using URL parameters:

```
http://localhost:5173/?title=My%20Blog%20Post&description=An%20amazing%20article&social=Twitter%3A%20%40myhandle&siteName=myblog.com&imageUrl=https%3A//example.com/image.jpg
```

## 🎨 API Endpoints

### Main Generator
- **GET** `/` - Main OG image generator interface

### API Image Generation
- **GET** `/api/og` - Generates OG image using Satori SVG rendering
  - Query parameters: `title`, `description`, `social`, `siteName`, `imageUrl`
  - Returns clean SVG with proper caching headers
  - Perfect for social media sharing and direct browser viewing

- **GET** `/api/og.png` - Alternative endpoint for SVG image serving
  - Same query parameters as `/api/og`
  - Returns the same SVG output as `/api/og`
  - Optimized for social media crawlers expecting PNG format

Examples:
```
https://your-domain.com/api/og?title=Hello%20World&description=This%20is%20a%20test
https://your-domain.com/api/og.png?title=My%20Blog&description=Amazing%20content
```

## 🏗️ Project Structure

```
og-maker/
├── src/
│   ├── components/        # JSX Components
│   │   ├── FormComponent.tsx      # Input form component
│   │   ├── PreviewComponent.tsx   # Canvas preview component
│   │   └── InstructionsComponent.tsx # Usage instructions
│   ├── index.tsx          # Main Hono app with routes and JSX composition
│   ├── renderer.tsx       # JSX renderer configuration
│   ├── og-generator.ts    # Satori-based server-side SVG generation
│   ├── og-client.js       # Modern ES6+ client-side functionality
│   └── style.css          # Tailwind CSS and custom styles
├── public/
│   ├── yehez-icon.svg     # Default icon and favicon
│   ├── favicon.ico        # Favicon (ICO format)
│   └── manifest.json      # PWA manifest
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── wrangler.jsonc         # Cloudflare Workers config
└── tsconfig.json          # TypeScript configuration
```

## 🎯 Technical Details

### Image Specifications
- **Size**: 1200x600 pixels (2:1 aspect ratio for modern social media)
- **Theme**: Diagonal gradient from slate-800 (#1e293b) to slate-600 (#475569)
- **Layout**: Professional design with title and description on left, 256px circular avatar on right
- **Format**: SVG generated by Satori with proper font rendering
- **Typography**: Inter font family with multiple weights (300, 400, 500, 700)

### Layout Features
- **Background**: Diagonal gradient (135deg) from slate-800 to slate-600 for professional appearance
- **Typography**: Large bold title (48px), light description (30px), footer text (20px) with Inter font
- **Avatar**: 256px circular image positioned on the right side in main content area
- **Layout Structure**: 420px main content area + footer, following professional OG image standards
- **Font Loading**: Dynamic Inter font loading from Google Fonts CDN for crisp typography
- **Color Scheme**: All white text for high contrast against gradient background
- **SVG Rendering**: Crisp, scalable output using Satori's JSX-to-SVG conversion

### Browser Support
- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile browsers with Canvas API and ES6+ support
- PWA support on compatible browsers

### Code Architecture
- **JSX Components**: Modular, reusable components for clean code organization
- **Satori Integration**: Server-side JSX-to-SVG rendering for reliable image generation
- **TypeScript Support**: Full type safety with proper Satori type definitions
- **Configuration-driven**: Centralized config object for easy customization
- **Error Handling**: Comprehensive error handling with graceful SVG fallbacks
- **Performance Optimized**: Debounced updates and efficient server-side rendering
- **Font Management**: Dynamic font loading with CDN fallbacks
- **PWA Features**: Manifest.json, favicon support, and proper meta tags
- **SEO Ready**: Complete Open Graph and Twitter Card integration

## 🚀 Deployment

### Cloudflare Workers (Recommended)

```bash
# Build for production
pnpm run build

# Deploy to Cloudflare Workers
pnpm run deploy
```

### Other Platforms

The app can be deployed to any platform that supports Node.js:
- Vercel
- Netlify
- Railway
- Render

## 🛡️ Security & Performance

- **Modern Architecture**: JSX components with clean separation of concerns
- **Server-side Generation**: Reliable SVG generation using Satori on the server
- **Font Security**: Safe font loading from trusted CDN sources
- **Caching**: Proper cache headers for optimal performance
- **Debouncing**: 500ms debounce prevents excessive re-renders
- **Error Handling**: Comprehensive error handling with graceful SVG fallbacks
- **Performance**: Optimized server-side rendering with efficient font loading
- **Responsive**: Optimized for all device sizes
- **Accessibility**: High contrast ratios and proper semantic markup
- **PWA Support**: Installable as a web app with proper manifest and icons
- **SEO Optimized**: Complete meta tags for search engines and social media

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Hono.js](https://hono.dev/) - Fast, lightweight web framework with excellent JSX support
- Powered by [Satori](https://github.com/vercel/satori) - JSX-to-SVG rendering for reliable image generation
- Styled with [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework
- Built with [Vite](https://vitejs.dev/) - Next generation frontend tooling
- Typography by [Inter](https://fonts.google.com/specimen/Inter) - Professional font family
- Modern TypeScript and ES6+ JavaScript with classes and async/await
- Component-based architecture for maintainable code
- Server-side rendering for consistent, reliable OG image generation

## 📧 Support

For questions or support, please open an issue on GitHub or contact [@yehezgun](https://twitter.com/yehezgun).

---

**Made with ❤️ by Yehez**