# Contributing to OG Image Generator

Thank you for your interest in contributing to the OG Image Generator! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended package manager)
- Git

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/og-maker.git
   cd og-maker
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Start Development Server**
   ```bash
   pnpm run dev
   ```

4. **Build Project**
   ```bash
   pnpm run build
   ```

## 🏗️ Project Structure

```
og-maker/
├── src/
│   ├── components/        # JSX Components
│   │   ├── FormComponent.tsx
│   │   ├── PreviewComponent.tsx
│   │   └── InstructionsComponent.tsx
│   ├── index.tsx          # Main Hono app
│   ├── renderer.tsx       # JSX renderer
│   ├── og-generator.js    # Client-side Canvas logic
│   └── style.css          # Tailwind CSS
├── public/                # Static assets
├── .github/               # GitHub workflows
└── dist/                  # Build output
```

## 🛠️ Development Guidelines

### Code Style

- **JSX Components**: Use functional components with clear, descriptive names
- **JavaScript**: Modern ES6+ syntax with classes and async/await
- **TypeScript**: Use TypeScript for better type safety (JSX files)
- **CSS**: Use Tailwind CSS classes for styling
- **Naming**: Use camelCase for variables, PascalCase for components

### Component Guidelines

1. **JSX Components** should be:
   - Self-contained and reusable
   - Well-documented with clear props
   - Responsive and accessible

2. **JavaScript Classes** should:
   - Have clear, single responsibilities
   - Include comprehensive error handling
   - Use configuration objects for settings

### Canvas API Best Practices

- **Performance**: Optimize drawing operations
- **Error Handling**: Graceful fallbacks for image loading failures
- **Responsive**: Support different canvas sizes
- **Memory**: Clean up resources properly

## 🧪 Testing

### Before Submitting

1. **Local Testing**
   ```bash
   pnpm run build
   pnpm run preview
   ```

2. **Type Checking**
   ```bash
   pnpm run cf-typegen
   ```

3. **Manual Testing**
   - Test OG image generation with different inputs
   - Verify responsive design on mobile/desktop
   - Check Canvas API functionality
   - Test URL generation and sharing

### Test Coverage

Please test:
- ✅ Form input validation
- ✅ Canvas image generation
- ✅ URL parameter handling
- ✅ Download functionality
- ✅ Mobile responsiveness
- ✅ Error handling scenarios

## 📝 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI configuration changes
- `chore`: Other changes

### Examples

```
feat(canvas): add gradient background support
fix(form): resolve input validation issue
docs(readme): update installation instructions
refactor(components): extract reusable form elements
```

## 🔄 Pull Request Process

### Before Creating a PR

1. **Update your fork**
   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### PR Requirements

- [ ] Fill out the PR template completely
- [ ] All CI checks pass
- [ ] Code is properly tested
- [ ] Documentation is updated (if needed)
- [ ] Screenshots/demos included (if applicable)

### Review Process

1. **Automated Checks**: GitHub Actions will run CI/CD
2. **Code Review**: Maintainers will review your code
3. **Testing**: Manual testing may be performed
4. **Merge**: PRs are merged after approval

## 🐛 Bug Reports

### Before Reporting

1. Check existing issues
2. Verify the bug exists in the latest version
3. Test in multiple browsers

### Bug Report Template

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to...
2. Click on...
3. See error

**Expected Behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome 91, Firefox 89]
- Device: [e.g., Desktop, Mobile]
```

## ✨ Feature Requests

### Before Requesting

1. Check existing feature requests
2. Consider if it fits the project scope
3. Think about implementation complexity

### Feature Request Template

```markdown
**Feature Description**
Clear description of the feature

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should it work?

**Alternatives**
Other ways to achieve the same goal

**Additional Context**
Screenshots, mockups, etc.
```

## 🔧 Technical Considerations

### Performance

- Canvas operations should be optimized
- Large images should be handled gracefully
- Memory usage should be minimized
- Debouncing should be used for real-time updates

### Accessibility

- Proper semantic HTML
- Keyboard navigation support
- Screen reader compatibility
- High contrast text

### Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile browsers with Canvas API support

## 📚 Resources

### Documentation

- [Hono.js Documentation](https://hono.dev/)
- [Canvas API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)

### Learning Resources

- [JSX in Hono](https://hono.dev/guides/jsx)
- [Canvas API Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- [Modern JavaScript](https://javascript.info/)

## 🤝 Community

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Code Review**: Learn from PR feedback

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow project guidelines

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributors page

Thank you for contributing to making OG Image Generator better! 🎨✨