---
title: 'Portfolio Tech Stack & Features'
date: 2024-06-09
excerpt: 'A summary of the technologies and features used to build my portfolio website. Learn how each tool contributes to performance, design, and maintainability.'
description: 'An overview of the technologies and features used to build my portfolio website.'
image: '/assets/images/blog/blog-2.png'
aurthor: 'Prakash Raj'
---

## Tech Stack & Features

This page provides a detailed overview of the technologies, tools, and features that power this website. Each point below is explained to help you understand why these choices were made and how they contribute to the site.

## 🚀 Tech Stack

---

### **Framework : Astro**

- Astro is a modern static site generator that allows you to build fast, optimized websites using your favorite frameworks (React, Vue, Svelte, etc.) or just plain HTML/CSS/JS. Astro ships less JavaScript to the browser, making the site load faster and perform better.

### **Styling:**

- **Tailwind CSS:**  
   A utility-first CSS framework that lets you style your site directly in your HTML or component files using utility classes. This speeds up development and keeps styles consistent.
- **Custom CSS:**  
   For unique design elements and fine-tuned adjustments that go beyond what Tailwind offers, custom CSS is used. This ensures the site has a unique look and feel.

### **JavaScript & TypeScript:**

- **Vanilla JavaScript:**  
   Used for adding interactivity, such as animations, smooth scrolling, and dynamic UI updates.
- **TypeScript:**  
   Adds type safety to JavaScript, making the codebase more robust and easier to maintain, especially as the project grows.

### **Content Management:**

- **Markdown Files:**
  - Blog posts and other rich content are written in Markdown, which is easy to write and read. Astro converts these files into HTML at build time.
- **JSON Files:**
  - Used for structured data like project lists, skills, and about information. This makes it easy to update content without touching the main codebase.

### **Icons & Images:**

- **SVG Icons:**
  - Scalable Vector Graphics are used for technology and skill icons. SVGs are lightweight and look sharp on all screen sizes.
- **Optimized Images:**
  - Images are compressed and sized appropriately to ensure fast loading times and high visual quality.

### **Deployment:**

- **GitHub Pages:**
  - The site is deployed as a static site on GitHub Pages, which is free and reliable. Other static hosting services like Netlify or Vercel can also be used.
- **Continuous Deployment:**
  - Whenever changes are pushed to the main branch, the site is automatically rebuilt and redeployed.

### 🛠️ Key Features

- **Responsive Design:**
  - The layout adapts to all screen sizes, ensuring a great experience on mobile, tablet, and desktop devices.
- **Blog Section:**
  - Blog posts are managed with Markdown, making it easy to add, edit, or remove articles. The blog supports excerpts, featured images, and automatic sorting by date.
- **Projects Showcase:**
  - Projects are displayed using dynamic cards generated from JSON data. Each card includes a title, description, tech stack, and links to the project or source code.
- **Animated Hero & Particle Effects:**
  - The landing section features engaging animations and interactive particle effects to create a modern, eye-catching first impression.
- **Dark Theme:**
  - The entire site uses a dark color scheme, which is visually appealing and reduces eye strain, especially in low-light environments.
- **Smooth Scrolling & Transitions:**
  - Navigation and UI elements feature smooth scrolling and subtle transitions, making the site feel polished and professional.
- **SEO Optimized:**
  - The site includes meta tags, descriptive titles, and best practices to help search engines index the content and improve discoverability.
- **Performance Optimizations:**
  - Astro’s partial hydration, image optimization, and minimal JavaScript ensure fast load times and high Lighthouse scores.
- **Accessibility:**
  - Semantic HTML, proper contrast, and keyboard navigation are considered to make the site usable for everyone.

---

## 📁 Folder Structure Highlights

- `src/components/` — Contains reusable UI components like Navbar, Footer, BlogCard, ProjectCard, etc. This keeps the code modular and easy to maintain.
- `src/pages/` — Each file here represents a route on the website (e.g., Home, Blog, Projects). Astro automatically turns these files into pages.
- `src/data/` — Stores JSON files for dynamic content such as about info, project lists, and skills. This makes it easy to update content without editing code.
- `src/assets/` — Holds images, SVG icons, and global CSS styles. Keeping assets organized here helps with maintainability and performance.
- `src/content/blog/` — All blog posts are written in Markdown and stored here. This allows for easy content management and version control.
- `src/layouts/` — Layout components that define the overall structure of pages (e.g., MainLayout for consistent headers/footers).
- `src/lib/` — Utility functions and constants used throughout the site.

---

**Thanks For Reading!**

## _**Prakash Raj**_
