# Astro Portfolio Website

This is my portfolio website built with [Astro](https://astro.build/), featuring a dark theme, smooth animations, and optimized performance. The site showcases projects, skills, and includes a fully functional blog system.

## 🚀 Key Features

- **Modern Tech Stack**: Built with Astro for optimal performance and developer experience
- **Responsive Design**: Adapts seamlessly to all screen sizes (mobile, tablet, desktop)
- **Blog System**: Markdown-powered blog with automatic sorting and SEO optimization
- **Projects Showcase**: Dynamic project cards generated from JSON data
- **Animated Hero Section**: Eye-catching particle effects and smooth transitions
- **Dark Theme**: Professional dark color scheme throughout
- **SEO Optimized**: Meta tags, structured data, and performance best practices
- **Accessibility**: Semantic HTML and keyboard navigation support

## 🛠️ Tech Stack

### **Framework \& Build**

- **Astro** - Modern static site generator with minimal JavaScript shipping
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and dev server

### **Styling**

- **Tailwind CSS** - Utility-first CSS framework for rapid development
- **Custom CSS** - Fine-tuned animations and unique design elements

### **Content Management**

- **Markdown** - Blog posts and rich content
- **JSON Files** - Structured data for projects, skills, and about information
- **SVG Icons** - Scalable vector graphics for technology icons

### **Development Tools**

- **Prettier** - Code formatting
- **ESLint** - Code linting and quality checks
- **GitHub Pages** - Static site deployment with continuous integration

## 📁 Project Structure

```bash
src/
├── components/     # Reusable UI components (Navbar, Footer, Cards)
├── pages/          # Route pages (Home, Blog, Projects)
├── data/           # JSON files for dynamic content
├── assets/         # Images, SVG icons, and global styles
├── content/blog/   # Markdown blog posts
├── layouts/        # Layout components for consistent structure
└── lib/            # Utility functions and constants

public/             # Static assets
.vscode/           # Editor settings and recommendations
```

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit [http://localhost:4321](http://localhost:4321) to view the site locally.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Code Formatting

```bash
npm run format
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

## 🔧 Recommended VS Code Extensions

- **Astro** (astro-build.astro-vscode) - Astro language support
- **Prettier** (esbenp.prettier-vscode) - Code formatting
- **ESLint** (dbaeumer.vscode-eslint) - Code linting
- **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss) - Tailwind utilities
- **TypeScript Next** (ms-vscode.vscode-typescript-next) - Enhanced TypeScript support
- **Code Spell Checker** (streetsidesoftware.code-spell-checker) - Spell checking

## 📝 Content Management

### Adding Blog Posts

1. Create a new `.md` file in `src/content/blog/`
2. Add frontmatter with title, date, excerpt, description, and image
3. Write your content in Markdown
4. The blog will automatically update with the new post

### Updating Projects

1. Edit the JSON files in `src/data/`
2. Add project details including title, description, tech stack, and links
3. Projects will automatically appear on the showcase page

### Modifying Skills \& About Info

Update the corresponding JSON files in `src/data/` to reflect your current skills and information.

## 🎨 Customization

The site uses a modular component architecture making it easy to:

- Modify colors and typography via Tailwind CSS classes
- Add new sections by creating components
- Customize animations and transitions
- Extend functionality with additional Astro integrations

## 🚀 Performance Features

- **Partial Hydration** - Only necessary JavaScript is loaded
- **Image Optimization** - Automatic image compression and sizing
- **Minimal JavaScript** - Astro ships less JS to the browser
- **Static Generation** - Fast loading times with pre-rendered HTML

## 📄 License

MIT
