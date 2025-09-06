---
title: 'Getting Started with Next.js'
date: '2025-08-20'
excerpt: 'A roadmap to building your first Next.js application with modern features like App Router, API routes, and deployment with no prior React experience required.'
image: '/assets/images/blog/blog-6.png'
---

## 🚀 What Actually is Next.js And Why Should You Care?

So here's the thing - Next.js is basically React's big brother that handles all the complicated stuff for you. You know how vanilla React can be a bit overwhelming with all the setup and configuration? Next.js takes care of that headache.

**What I love about it:**

- Built on top of React (so if you know React, you're halfway there)
- Perfect for everything from simple blogs to complex web applications
- Handles routing automatically (no more React Router setup!)
- Great for SEO with server-side rendering out of the box
- Easy to deploy on Vercel (they made Next.js, so it just works)
- Full-stack capabilities with API routes built-in

---

## Prerequisites

Before you start, make sure you have:

- `Node.js` (version 18 or higher) installed
- A `terminal` (command line tool)
- A code editor like `VS Code`
- Basic knowledge of `HTML`, `CSS`, and `JavaScript`
- Some familiarity with `React` (helpful but not required)

## Step-by-Step Instructions

### 1. Create a New Next.js Project

Open your terminal and run:

```bash
npx create-next-app@latest
```

Next.js will ask you several questions:

- **Project name**: Type your project folder name (e.g., `my-nextjs-app`)
- **TypeScript**: Choose `Yes` if you want TypeScript (recommended)
- **ESLint**: Choose `Yes` for code quality
- **Tailwind CSS**: Choose `Yes` for easy styling
- **src/ directory**: Choose `Yes` for better organization
- **App Router**: Choose `Yes` (this is the modern way)
- **Import alias**: Choose `Yes` and keep default `@/*`

### 2. Navigate to Your Project Folder

```bash
cd my-nextjs-app
```

Now you're inside your new Next.js project!

### 3. Install Project Dependencies

```bash
npm install
```

This installs all the required packages Next.js needs to run your project.

### 4. Start the Development Server

```bash
npm run dev
```

Then open your browser and visit:
**[http://localhost:3000](http://localhost:3000)**

**You'll see the default Next.js welcome page running locally!**

### Project Structure Overview

Here's what you'll see inside your project:

```bash
my-nextjs-app/
├── public/               # Static files like images, icons, robots.txt
├── src/
│   ├── app/              # App Router (pages, layouts, components)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── favicon.ico
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies and scripts
├── tailwind.config.ts    # Tailwind CSS config (if you chose it)
```

- Each folder inside `src/app/` can become a route
- `page.tsx` files become actual web pages
- `layout.tsx` files wrap pages with common elements

### 5. Create Your First Custom Page

Let's make an About page:

- Go to `src/app/`
- Create a new folder called `about`
- Inside the `about` folder, create `page.tsx`
- Add this content:

```tsx
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About Me</h1>
      <p className="text-lg">This is my first Next.js page!</p>
    </div>
  );
}
```

Now visit your new page at: **[http://localhost:3000/about](http://localhost:3000/about)**

### 6. Create a Reusable Component

Let's create a Hero component:

- Go to `src/app/components/` (create this folder if it doesn't exist)
- Create a file called `Hero.tsx`
- Add this code:

```tsx
export default function Hero() {
  return (
    <section className="bg-blue-600 text-white py-20 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-4">Welcome to My Next.js Site!</h1>
        <p className="text-xl">Building modern web applications made simple.</p>
      </div>
    </section>
  );
}
```

Now import and use it in `src/app/page.tsx`:

```tsx
import Hero from './components/Hero';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <p>More content goes here...</p>
      </div>
    </main>
  );
}
```

You'll now see your custom hero section on the homepage!

### 7. Add Custom Styling

Next.js works great with Tailwind CSS (if you chose it during setup), but you can also add custom CSS:

## **Option 1: Using Tailwind Classes (recommended)**

```tsx
<h2 className="text-2xl font-bold text-blue-600 mb-4">My Awesome Heading</h2>
```

**Option 2: CSS Modules**
Create `styles/Hero.module.css`:

```css
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 0;
  text-align: center;
  color: white;
}

.title {
  font-size: 3rem;
  margin-bottom: 1rem;
}
```

Then import and use it:

```tsx
import styles from '../styles/Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>Welcome!</h1>
    </section>
  );
}
```

### 8. Create an API Route

One of Next.js's coolest features is built-in API routes. Let's create one:

- Go to `src/app/api/`
- Create a folder called `hello`
- Inside, create `route.ts`:

```tsx
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Hello from Next.js API!',
    timestamp: new Date().toISOString(),
  });
}
```

Now visit: **[http://localhost:3000/api/hello](http://localhost:3000/api/hello)**

You'll see JSON data returned by your API!

### 9. Add Dynamic Routing

Let's create a dynamic blog post page:

- Go to `src/app/`
- Create a folder called `blog`
- Inside `blog`, create a folder called `[slug]` (yes, with brackets!)
- Create `page.tsx` inside the `[slug]` folder:

```tsx
interface BlogPostProps {
  params: {
    slug: string;
  };
}

export default function BlogPost({ params }: BlogPostProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Blog Post: {params.slug}</h1>
      <p>
        This is a dynamic page for the slug: <strong>{params.slug}</strong>
      </p>
    </div>
  );
}
```

Now you can visit URLs like:

- [http://localhost:3000/blog/my-first-post](http://localhost:3000/blog/my-first-post)
- [http://localhost:3000/blog/getting-started](http://localhost:3000/blog/getting-started)

### 10. Add Images (The Next.js Way)

Next.js has an optimized Image component:

```tsx
import Image from 'next/image';

export default function MyComponent() {
  return (
    <div>
      <Image
        src="/hero-image.jpg" // Put image in public/ folder
        alt="Hero Image"
        width={800}
        height={400}
        className="rounded-lg"
      />
    </div>
  );
}
```

This automatically optimizes your images for better performance!

### 11. Build and Deploy Your Site

To prepare your site for production:

```bash
npm run build
```

This creates an optimized `.next/` folder with your final website files.

**Easy Deployment Options:**

1. **Vercel (Recommended):**
   - Push your code to GitHub
   - Connect your GitHub repo to Vercel
   - Automatic deployments on every push!

2. **Netlify:**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Traditional hosting:**

   ```bash
   npm run start
   ```

### 12. Useful Commands You'll Use Daily

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server locally
npm run start

# Run linting
npm run lint

# Type checking (if using TypeScript)
npx tsc --noEmit
```

### 13. Next Steps and Pro Tips

**What to explore next:**

- **Data Fetching**: Learn about `fetch()` in Server Components
- **Metadata**: Add proper SEO with the `metadata` export
- **Middleware**: Handle authentication and redirects
- **Database Integration**: Connect to databases like PostgreSQL or MongoDB
- **Authentication**: Add login with NextAuth.js

**Pro Tips from my experience:**

- Use Server Components by default (they're faster)
- Keep Client Components minimal (add `'use client'` only when needed)
- Utilize Next.js Image component for better performance
- Learn about caching strategies for better UX
- Use TypeScript - it'll save you hours of debugging

---

## What You've Accomplished

Next.js might seem overwhelming at first, but once you get the hang of it, you'll wonder how you ever built web apps without it. The framework handles so much of the heavy lifting, letting you focus on building great user experiences.
Start small, experiment with the features, and don't be afraid to dive into the [excellent documentation](https://nextjs.org/docs) when you need more advanced features.

---

**Thanks for reading!**

## _**Prakash Raj**_
