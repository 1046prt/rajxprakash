---
title: 'Portfolio Tech Stack & Features'
date: 2024-06-09
excerpt: 'A behind-the-scenes look at how I built my portfolio website and why I chose each technology.'
description: 'An overview of the technologies and features used to build my portfolio website.'
image: '/assets/images/blog/blog-2.png'
aurthor: 'Prakash Raj'
---

## How I Built My Portfolio (And Why I Made These Choices)

You know that feeling when someone asks "How did you build your website?" and you're not sure where to start? Well, I'm going to break down exactly how I built my portfolio, what technologies I used, and – more importantly – why I chose them.

Spoiler alert: I didn't just pick the trendiest frameworks. Every choice was deliberate, focused on creating something fast, maintainable, and genuinely useful. Let me walk you through the whole setup.

## 🚀 The Foundation: What Powers Everything

### Framework: Astro (The Performance Beast)

I went with Astro, and honestly, it was one of the best decisions I made for this project. Here's why: most frameworks ship a ton of JavaScript to your browser whether you need it or not. Astro flips that on its head – it only sends JavaScript for the parts that actually need to be interactive.

The result? My portfolio loads incredibly fast and gets perfect performance scores. Plus, I can still use React components when I need them, but most of the site is just static HTML and CSS. It's like getting the best of both worlds.

### Styling: Making It Look Good

**Tailwind CSS** is my go-to for styling. I know some people think it makes your HTML look messy with all those utility classes, but hear me out – it's incredibly fast to work with. Instead of jumping between HTML and CSS files, I can style everything right in place. Need a blue button with rounded corners? Just add `bg-blue-500 rounded-lg` and you're done.

**Custom CSS** handles the unique stuff that Tailwind can't cover. Things like custom animations, complex layouts, or those little design touches that make the site feel personal. The combination gives me speed when I need it and flexibility when I want something special.

### JavaScript & TypeScript: The Interactive Bits

**Vanilla JavaScript** powers all the interactive elements – smooth scrolling, animations, and those little UI touches that make the site feel alive. I kept it simple because honestly, you don't always need a massive framework for basic interactions.

**TypeScript** was a no-brainer. Sure, it takes a bit more time to write initially, but it saves me hours of debugging later. When you're working on a project solo, having the compiler catch your mistakes before your users do is invaluable.

### Content Management: Keeping It Simple

**Markdown files** are perfect for blog posts. I can write in a clean, distraction-free format and Astro converts everything to HTML automatically. No complex CMS needed, no database to maintain – just simple files that live with my code.

**JSON files** store all my structured data – project details, skills, about information. When I want to add a new project or update my skills, I just edit a JSON file. It's version-controlled, easy to backup, and doesn't require any external services.

### Icons & Images: Looking Sharp Everywhere

**SVG icons** are fantastic – they're tiny files that look crisp on any screen size, from phones to huge monitors. I use them for all the technology logos and skill icons throughout the site.

**Optimized images** are crucial for performance. Every image is compressed and properly sized. There's no point in loading a massive 4K image when someone's viewing it on a 300px wide phone screen.

### Deployment: Going Live

**GitHub Pages** hosts the site for free and works perfectly for static sites. Every time I push code changes, GitHub automatically rebuilds and redeploys the site. It's simple, reliable, and I don't have to think about server maintenance.

I could easily switch to Netlify or Vercel if needed, but GitHub Pages does everything I need right now.

## 🔧 The Cool Features That Make It Special

**Responsive Design** was non-negotiable. The site looks and works great whether you're on a phone, tablet, or desktop. I test on real devices, not just browser dev tools, because that's how real people actually use websites.

**Blog Section** runs on Markdown files, which means I can write posts in any text editor and they automatically show up with proper formatting, featured images, and date sorting. No complicated CMS to break or maintain.

**Projects Showcase** pulls data from JSON files to create those project cards you see. When I build something new, I just add it to the JSON file and it appears on the site automatically. The cards include everything – description, tech stack, live links, source code.

**Animated Hero & Particle Effects** create that modern, dynamic first impression. I wanted the landing page to feel alive and engaging, not like a static resume. The animations are subtle enough to be professional but eye-catching enough to be memorable.

**Dark Theme** isn't just trendy – it's practical. Easier on the eyes, especially when people are browsing late at night, and it gives the site a modern, developer-focused aesthetic.

**Smooth Scrolling & Transitions** make everything feel polished. These micro-interactions might seem small, but they're what separate a professional site from something that feels amateurish.

**SEO Optimized** because what's the point of building something if people can't find it? Proper meta tags, semantic HTML, and fast loading times help search engines understand and rank the site.

**Performance Optimizations** are built into Astro's DNA. Minimal JavaScript, optimized images, and smart loading strategies mean the site consistently gets high performance scores.

**Accessibility** matters. Proper contrast ratios, keyboard navigation, semantic HTML – I want everyone to be able to use the site comfortably.

## 📁 How Everything Is Organized

Good organization makes everything easier to maintain. Here's how I structured the project:

**`src/components/`** holds all the reusable pieces – Navbar, Footer, BlogCard, ProjectCard. When I need to update the navigation, I only have to change one file.

**`src/pages/`** contains the main pages of the site. Astro automatically turns each file here into a URL route. Want a new page? Just add a file.

**`src/data/`** is where all my content lives in JSON format. Projects, skills, about information – it's all here. This separation means I can update content without touching any code.

**`src/assets/`** keeps all images, icons, and global styles organized. Everything visual lives here, making it easy to find and optimize assets.

**`src/content/blog/`** contains all blog posts in Markdown. Each post is a separate file with its own metadata. Version control for content is built right in.

**`src/layouts/`** defines the overall page structure. The main layout handles things like headers and footers that appear on every page.

**`src/lib/`** houses utility functions and constants – the helper code that makes everything else work smoothly.

## The Bottom Line

Building this portfolio taught me that the best tech stack isn't necessarily the newest or most popular one – it's the one that solves your specific problems efficiently.

Astro gave me the performance I needed, Tailwind sped up my development, and keeping content in simple files made everything maintainable. The result is a site that loads fast, looks professional, and is actually enjoyable to work on.

If you're building your own portfolio, don't feel like you need to use everything I used. Pick technologies that make sense for your goals, your timeline, and your comfort level. The best portfolio is one you'll actually finish and keep updated.

## _**Prakash Raj**_
