# [Prakash raj](https://prakashraj.info) Portfolio Website

Welcome to my personal portfolio built with [Astro](https://astro.build/), a fast, modern static site framework. This site showcases my projects, skills, and blog content in a clean, responsive layout with a professional dark theme and smooth animations.

---

## Highlights

- **Modern Tech Stack**: Powered by Astro and TypeScript for a fast and efficient development experience.
- **Fully Responsive**: Looks great on mobile, tablet, and desktop devices.
- **Built-in Blog**: Markdown-powered blogging with SEO and slug-based routing.
- **Project Showcase**: Dynamic cards generated from structured JSON data.
- **Polished UI**: Dark mode, animated hero section, and particle effects.
- **SEO Friendly**: Optimized meta tags, performance best practices, and structured data.
- **Accessible**: Semantic HTML and keyboard-friendly navigation.

---

## Tech Stack

### Framework & Build Tools

- **Astro** – Static site generator with minimal JavaScript output
- **TypeScript** – Type-safe code for better reliability
- **Vite** – Fast dev server and build system

### Styling

- **Custom CSS** – Fine-tuned animations and unique styling

### Content Management

- **Markdown** – Blog posts and rich content
- **JSON** – Structured data for projects, skills, and about info
- **SVG Icons** – Clean, scalable vector icons

### Dev Tools

- **Prettier** – Consistent code formatting
- **ESLint** – Code linting and best practices
- **GitHub Pages** – Deployment via CI/CD

---

## 📁 Project Structure

```bash
.vscode/           # Editor settings and recommendations
public/             # Static assets
├── assets/images/  # Contains image of website
├── sound.mp3       # Click sound
├── scripts/        # JavaScript Snippets
├── CNAME           # Web URL
src/
├── components/     # Reusable UI components (Navbar, Footer, Cards)
├── pages/          # Route pages (Home, Blog, Projects)
├── data/           # JSON files for dynamic content
├── assets/         # Images, SVG icons, and global styles
├── content/blog/   # Markdown blog posts
├── layouts/        # Layout components for consistent structure
└── lib/            # Utility functions and constants
```

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
npm run format # Fix the lint issue
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

## Recommended VS Code Extensions

- **Astro** (astro-build.astro-vscode) - Astro language support
- **Prettier** (esbenp.prettier-vscode) - Code formatting
- **ESLint** (dbaeumer.vscode-eslint) - Code linting
- **TypeScript Next** (ms-vscode.vscode-typescript-next) - Enhanced TypeScript support
- **Code Spell Checker** (streetsidesoftware.code-spell-checker) - Spell checking

---

> Content Management

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

## Customization

- Modify colors and typography via Tailwind CSS classes
- Add new sections by creating components
- Customize animations and transitions
- Extend functionality with additional Astro integrations

## Performance Features

- **Partial Hydration** - Only necessary JavaScript is loaded
- **Image Optimization** - Automatic image compression and sizing
- **Minimal JavaScript** - Astro ships less JS to the browser
- **Static Generation** - Fast loading times with pre-rendered HTML

## License

MIT
