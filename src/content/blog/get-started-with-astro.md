---
title: 'Getting Started with Astro'
date: '2025-07-23'
excerpt: 'A guide to help you start your journey with Astro, the modern web framework built for speed and simplicity.'
image: '/assets/images/blog/blog-3.png'
---

## 🚀 What Actually is Astro And Why Should You Care?

- So here's the thing - Astro is basically a web framework that doesn't try to over complicate everything. You know how some frameworks make you learn a million things just to get a simple page running! Astro's not like that.

**What I love about it:**

- You can use regular HTML, CSS and JavaScript.
- Perfect for blogs, portfolios, or any kind of website really
- Renders static pages by default (good for speed and SEO)
- Easy to deploy on platforms like Netlify or Vercel

---

## Prerequisites

Before you start, make sure you have:

- `Node.js` (version 18 or higher) installed
- A `terminal` (command line tool)
- A code editor like `VS Code`

## Step-by-Step Instructions

### 1. Create a New Astro Project

- Open your terminal and run:

```bash
npm create astro@latest
```

- Astro will ask a few questions:
- Project name : Type your project folder name (e.g. my-astro-site)
- Template : Choose Minimal for a clean start
- Use TypeScript : Select No if you want plain JavaScript

### 2. Go to Your Project Folder

```bash
cd my-astro-site
```

- Now you're inside the new Astro project.

### 3. Install Project Dependencies

```bash
npm install
```

- This installs all the required files Astro needs to run your project.

### 4. Start the Development Server

```bash
npm run dev
```

- Then open your browser and visit:
  _[http://localhost:4321](http://localhost:4321)_
- **You’ll see the default Astro homepage running locally.**

### Project Structure Overview

- what you’ll see inside the project:

```bash
my-astro-site/
├── public/ → Static files like images and icons
├── src/
│ ├── pages(e.g. index.astro, about.astro)
│ ├── components
│ ├── layouts
├── astro.config.mjs
├── package.json
```

- Each .astro file inside src/pages becomes a separate webpage.

### 5.Create a New Page

- Let’s make an About page.
- Go to src/pages/
- Create a new file called index.astro
- Add this content

```bash
<h3>About Me</h3>
<p>This is my first Astro page!</p>
```

Now visit your new page at : _[http://localhost:4321/about](http://localhost:4321/about)_

### 6.Create a Component

- Let’s create a reusable component called Hero.
- Go to _src/components/_
- Create a file called Hero.astro
- Add this code block:

```bash
<section>
  <h2> Welcome to My Astro Site! </h2>
  <p> Building fast and modern websites made easy. </p>
</section>
```

- Now import and use it in `src/pages/index.astro`
- Add this code block to index.astro page

```bash
import Hero from @/components/Hero.astro
```

- After importing above block, Write `<Hero />` to your BaseLayout section
- You’ll now see your custom hero section on the homepage.

### 7.Add Styling

- You can add CSS inside your Astro files:

```bash
<style>
  h2 {
    color: darkblue;
    font-size: 2rem;
  }
</style>
```

### 8.Build and Deploy Your Site

- To prepare your site for going live: Run this command to your terminal

```bash
npm run build
```

- Now Astro will create a _dist/folder_ with your final website files.
  -You can deploy your site to:
  - [Netlify](https://www.netlify.com/)
  - [Vercel](https://vercel.com/)
  - [GitHub Pages](https://pages.github.com/)

### 9.Useful Commands

- Check development status:

```bash
npm run dev
```

- Build your site:

```bash
npm run build
```

- Preview the build locally:

```bash
npm run preview
```

- Now Start small, experiment, and enjoy building with Astro. It's fast, fun, and ready for the future as You're all set and now you are working on Astro project and a good understanding of how to:
  - Create pages
  - Build components
  - Add styling
  - Deploy your site

---

**Thanks for reading!**
