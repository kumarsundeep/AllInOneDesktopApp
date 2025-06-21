# All In One Desktop App

[![CI/CD Status](https://github.com/kumarsundeep/AllInOneDesktopApp/workflows/Build%20and%20Release/badge.svg)](https://github.com/kumarsundeep/AllInOneDesktopApp/actions)

Generates production ready .exe, .dmg, .deb, etc. from a single codebase

## Performance Optimizations

We've implemented several performance optimizations to improve the application:

1. **Build Caching**: Using Vite's built-in caching system (stored in `.vite_cache`) to speed up subsequent builds
2. **Code Splitting**: Automatic vendor chunk splitting for node_modules
3. **Lazy Loading**: Non-critical components are loaded after initial render
4. **Minification**: Production builds are minified for smaller bundle sizes
5. **Source Maps**: Generated for better debugging in development

To see the performance improvements:

```bash
# Development build (with HMR)
npm start

# Production build
npm run build
```

The production build includes:

- Minified JavaScript
- Code splitting
- Lazy loaded components
- Optimized asset loading
