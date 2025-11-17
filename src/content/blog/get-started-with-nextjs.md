---
title: 'Getting Started with Next.js'
date: '2025-08-20'
excerpt: 'A roadmap to building your first Next.js application with modern features like App Router, API routes, and deployment with no prior React experience required.'
image: '/assets/images/blog/blog-6.png'
---

## 🚀 What's Next.js and Why Should You Get Excited?

Alright, let me break this down for you: Next.js is basically React's older, wiser sibling who's got their life together. You know how vanilla React can feel like building a house without blueprints? Next.js is like having a master builder who shows up with all the tools, materials, and a detailed plan.

Here's why I absolutely love working with Next.js:

It's built on React, so if you know React basics, you're already ahead of the game. But even if you don't, Next.js is actually a great way to learn React because it handles all the confusing setup stuff for you.

You can build literally anything – from a simple blog to a full-blown social media app. The routing happens automatically (no more wrestling with React Router), and it's amazing for SEO because pages load super fast with server-side rendering.

Plus, since Vercel (the company behind Next.js) offers incredible free hosting, getting your site live is ridiculously easy.

---

## What You'll Need to Get Started

Don't worry, the requirements are pretty standard:

- **Node.js** (version 18 or higher) – grab it from [nodejs.org](https://nodejs.org) if you don't have it
- **A terminal** – that's just your computer's command line
- **A code editor** – VS Code is awesome, but use whatever you like
- **Basic web knowledge** – HTML, CSS, and JavaScript fundamentals
- **Some React familiarity** – helpful but not required (Next.js is actually a great way to learn React!)

## Let's Build Your First Next.js App

### Step 1: Create Your Project

Open your terminal and run this command:

```bash
npx create-next-app@latest
```

Next.js will ask you a bunch of questions. Here's what I recommend:

- **Project name**: Whatever you want (like "my-awesome-app")
- **TypeScript**: Say "Yes" – trust me, it'll save you headaches later
- **ESLint**: Say "Yes" – it helps catch bugs
- **Tailwind CSS**: Say "Yes" – makes styling so much easier
- **src/ directory**: Say "Yes" – keeps things organized
- **App Router**: Say "Yes" – this is the modern way to do things
- **Import alias**: Say "Yes" and keep the default `@/*`

### Step 2: Jump Into Your New Project

```bash
cd my-awesome-app
```

Now you're inside your shiny new Next.js project!

### Step 3: Install Everything

```bash
npm install
```

This downloads all the packages Next.js needs to work its magic.

### Step 4: Fire It Up

```bash
npm run dev
```

Then open your browser and go to [http://localhost:3000](http://localhost:3000)

Boom! You should see the default Next.js welcome page. Pretty cool, right?

### Understanding Your Project Structure

Let's take a quick look at what Next.js created for you:

```text
my-awesome-app/
├── public/               # Static files (images, icons, etc.)
├── src/
│   ├── app/              # This is where the magic happens
│   │   ├── globals.css   # Global styles
│   │   ├── layout.tsx    # Wraps all your pages
│   │   ├── page.tsx      # Your homepage
│   │   └── favicon.ico   # That little icon in browser tabs
├── next.config.js        # Next.js settings
├── package.json          # Project info and dependencies
├── tailwind.config.ts    # Tailwind CSS config
```

Here's the cool part: every folder inside `src/app/` can become a URL route. Create a folder called `about`? You get an `/about` page. The `page.tsx` files are what actually show up when someone visits that route.

### Step 5: Create Your First Custom Page

Let's make an About page to see how easy routing is in Next.js:

1. Go to `src/app/`
2. Create a new folder called `about`
3. Inside that folder, create a file called `page.tsx`
4. Add this content:

```tsx
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About Me</h1>
      <p className="text-lg">This is my first Next.js page!</p>
      <p className="mt-4">Pretty neat how the routing just works, right?</p>
    </div>
  );
}
```

Now visit [http://localhost:3000/about](http://localhost:3000/about) and see your new page live!

See how Next.js automatically created the route just based on your folder structure? That's the kind of magic that makes Next.js so developer-friendly.

### Step 6: Build Your First Component

Components are reusable pieces of your website. Let's create a hero section:

1. Go to `src/app/` and create a folder called `components`
2. Create a file called `Hero.tsx` inside that folder
3. Add this code:

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

Now let's use it on your homepage. Edit `src/app/page.tsx`:

```tsx
import Hero from './components/Hero';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <p>More awesome content goes here...</p>
      </div>
    </main>
  );
}
```

Refresh your browser and boom! Your custom hero section is now on the homepage.

### Step 7: Make It Look Amazing

Next.js gives you a few ways to style your components. Here are the two easiest:

#### Tailwind CSS (Super Easy)

If you chose Tailwind during setup, just add classes to your elements:

```tsx
<h2 className="text-3xl font-bold text-blue-600 mb-4 hover:text-blue-800 transition-colors">
  My Awesome Heading
</h2>
```

#### CSS Modules (More Traditional)

Create a file called `Hero.module.css` in your components folder:

```css
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 0;
  text-align: center;
  color: white;
  border-radius: 10px;
}

.title {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
```

Then import and use it in your component:

```tsx
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>Welcome!</h1>
    </section>
  );
}
```

Both approaches work great – Tailwind is faster for prototyping, CSS modules give you more control.

### Step 8: Create Your First API Endpoint

Here's where Next.js gets really cool – you can create backend APIs in the same project as your frontend! Let's make a simple API:

1. Go to `src/app/api/`
2. Create a folder called `hello`
3. Inside that folder, create a file called `route.ts`
4. Add this code:

```tsx
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Hello from Next.js API!',
    timestamp: new Date().toISOString(),
    status: 'success',
  });
}
```

Now visit [http://localhost:3000/api/hello](http://localhost:3000/api/hello) in your browser.

You'll see JSON data returned by your very own API! This is perfect for handling form submissions, fetching data from databases, or connecting to external services.

### Step 9: Create Dynamic Pages (The Cool Stuff)

Next.js can create pages that change based on the URL. Let's build a dynamic blog post page:

1. Go to `src/app/`
2. Create a folder called `blog`
3. Inside `blog`, create a folder called `[slug]` (yes, with square brackets!)
4. Create `page.tsx` inside the `[slug]` folder:

```tsx
interface BlogPostProps {
  params: {
    slug: string;
  };
}

export default function BlogPost({ params }: BlogPostProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Blog Post: {params.slug.replace('-', ' ')}</h1>
      <p className="text-lg text-gray-600 mb-4">
        This is a dynamic page for: <strong>{params.slug}</strong>
      </p>
      <p>In a real app, you'd fetch the actual blog post content based on this slug!</p>
    </div>
  );
}
```

Now you can visit URLs like:

- [http://localhost:3000/blog/my-first-post](http://localhost:3000/blog/my-first-post)
- [http://localhost:3000/blog/learning-nextjs](http://localhost:3000/blog/learning-nextjs)

Each URL will show the slug in the page content. This is how you build things like blog posts, product pages, or user profiles!

### Step 10: Add Images (The Smart Way)

Next.js has a special Image component that automatically optimizes your images for better performance:

```tsx
import Image from 'next/image';

export default function MyComponent() {
  return (
    <div className="text-center">
      <Image
        src="/hero-image.jpg" // Put your image in the public/ folder
        alt="Beautiful hero image"
        width={800}
        height={400}
        className="rounded-lg shadow-lg"
      />
      <p className="mt-4">This image is automatically optimized!</p>
    </div>
  );
}
```

The Next.js Image component automatically:

- Resizes images for different screen sizes
- Converts to modern formats like WebP
- Lazy loads images (only loads when they're about to be seen)
- Prevents layout shift while images load

Just drop your images in the `public/` folder and reference them with a `/` at the start!

### Step 11: Get Your Site Live

When you're ready to show your creation to the world:

```bash
npm run build
```

This creates an optimized `.next/` folder with all your files ready for production.

**Easy ways to deploy:**

1. **Vercel (Easiest)**: Push your code to GitHub, connect it to Vercel, and boom – automatic deployments!
2. **Netlify**: Works great too – just point it to your GitHub repo
3. **Traditional hosting**: Run `npm run start` on any server

### Commands You'll Use Every Day

```bash
# Start development (you'll use this a lot)
npm run dev

# Build for production
npm run build

# Test production build locally
npm run start

# Check for code issues
npm run lint
```

### What's Next? (Pun Intended)

Now that you've got the basics down, here are some cool things to explore:

**Essential Next Steps:**

- **Data fetching** – Learn how to get data from APIs and databases
- **SEO optimization** – Add proper meta tags and structured data
- **Authentication** – Let users sign in with NextAuth.js
- **Database integration** – Connect to PostgreSQL, MongoDB, or whatever you prefer

**Pro tips from my experience:**

- Use Server Components by default (they're faster and more secure)
- Only add `'use client'` when you need browser-specific features
- The Next.js Image component is a game-changer for performance
- TypeScript might feel scary at first, but it'll save you hours of debugging
- The [Next.js documentation](https://nextjs.org/docs) is actually really good – don't be afraid to dive in

## You Did It

Next.js can feel overwhelming at first – there's so much it can do! But that's also what makes it amazing. You can start simple with static pages and gradually add more complex features as you learn.

The framework handles so much of the tedious stuff (routing, optimization, bundling) so you can focus on building something people will actually want to use.

Start small, experiment with different features, and don't worry about using everything at once. Even the pros are constantly learning new Next.js tricks!

## _**Prakash Raj**_
