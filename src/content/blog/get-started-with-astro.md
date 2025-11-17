---
title: 'Getting Started with Astro'
date: '2025-07-23'
excerpt: 'A guide to help you start your journey with Astro, the modern web framework built for speed and simplicity.'
image: '/assets/images/blog/blog-3.png'
---

## 🚀 What's Astro and Why Should You Get Excited?

Okay, so here's the deal with Astro: it's basically the web framework for people who are tired of overcomplicated nonsense. You know how some frameworks make you learn a hundred different concepts just to display "Hello World"? Astro is the complete opposite of that.

What makes Astro so refreshing is that it feels familiar. You can use regular HTML, CSS, and JavaScript – no weird new syntax to memorize. It's perfect for blogs, portfolios, marketing sites, or honestly any website where you want things to load crazy fast. Plus, it renders static pages by default, which means your site will be lightning quick and search engines will love it.

And the best part? Deploying is a breeze on platforms like Netlify or Vercel. You'll have your site live in minutes, not hours.

---

## What You'll Need Before We Start

Don't worry, the requirements are pretty minimal:

- **Node.js** (version 18 or higher) – if you don't have this yet, grab it from [nodejs.org](https://nodejs.org)
- **A terminal** – that's just the command line thing on your computer
- **A code editor** – VS Code is great, but use whatever makes you happy

## Let's Build Your First Astro Site

### Step 1: Create Your Project

Open up your terminal and run this magical command:

```bash
npm create astro@latest
```

Astro will ask you a few friendly questions:

- **Project name**: Type whatever you want (like "my-awesome-site")
- **Template**: Choose "Minimal" for a clean start
- **Use TypeScript**: Pick "No" if you want to keep things simple with regular JavaScript

### Step 2: Jump Into Your New Project

```bash
cd my-awesome-site
```

Now you're inside your shiny new Astro project!

### Step 3: Install Everything You Need

```bash
npm install
```

This downloads all the files Astro needs to work its magic.

### Step 4: Fire Up Your Development Server

```bash
npm run dev
```

Then open your browser and visit [http://localhost:4321](http://localhost:4321)

Boom! You should see your Astro site running locally. Pretty cool, right?

### Understanding Your Project Structure

Let's take a quick look at what Astro created for you:

```text
my-awesome-site/
├── public/          → Static files like images and icons
├── src/
│   ├── pages/       → Each .astro file here becomes a webpage
│   ├── components/  → Reusable pieces of your site
│   ├── layouts/     → Templates for your pages
├── astro.config.mjs → Astro settings
├── package.json     → Project info and dependencies
```

Here's the cool part: every `.astro` file you put in `src/pages/` automatically becomes a webpage. Create `about.astro`? You get an `/about` page. It's that simple!

### Step 5: Create Your First Custom Page

Let's make an About page to see how easy this is:

1. Go to `src/pages/`
2. Create a new file called `about.astro`
3. Add this content:

```astro
---
// This is the frontmatter - it runs on the server
---

<html lang="en">
  <head>
    <title>About Me</title>
  </head>
  <body>
    <h1>About Me</h1>
    <p>This is my first custom Astro page!</p>
  </body>
</html>
```

Now visit [http://localhost:4321/about](http://localhost:4321/about) and see your new page live!

### Step 6: Build Your First Component

Components are reusable pieces of your website. Let's create a hero section:

1. Go to `src/components/`
2. Create a file called `Hero.astro`
3. Add this code:

```astro
---
// Component script goes here if needed
---

<section class="hero">
  <h2>Welcome to My Astro Site!</h2>
  <p>Building fast and modern websites made easy.</p>
</section>

<style>
  .hero {
    text-align: center;
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 10px;
  }
</style>
```

Now let's use it in your homepage. Edit `src/pages/index.astro` and add:

```astro
---
import Hero from '../components/Hero.astro';
---

<html lang="en">
  <head>
    <title>My Astro Site</title>
  </head>
  <body>
    <Hero />
    <!-- Rest of your page content -->
  </body>
</html>
```

Refresh your browser and see your beautiful hero section!

### Step 7: Add Some Style

The cool thing about Astro is you can add CSS directly in your `.astro` files using `<style>` tags. The styles are automatically scoped to that component, so you don't have to worry about conflicts!

```astro
<style>
  h2 {
    color: #2563eb;
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    line-height: 1.6;
  }
</style>
```

### Step 8: Build and Deploy Your Masterpiece

When you're ready to show your site to the world:

```bash
npm run build
```

This creates a `dist/` folder with all your optimized files, ready for deployment.

**Easy deployment options:**

- [Netlify](https://www.netlify.com/) – drag and drop the `dist` folder
- [Vercel](https://vercel.com/) – connect your GitHub repo
- [GitHub Pages](https://pages.github.com/) – free hosting for static sites

### Handy Commands to Remember

Here are the commands you'll use most often:

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview your build locally
npm run preview
```

## You're Ready to Rock

Congratulations! You've just built your first Astro site and learned the fundamentals:

✅ Creating pages that automatically become routes  
✅ Building reusable components  
✅ Adding scoped styling  
✅ Building and deploying your site

Astro is designed to grow with you. Start small with static pages, then gradually add interactive components when you need them. The performance will stay excellent, and your development experience will remain smooth.

Now go build something awesome! 🚀

## _**Prakash Raj**_
