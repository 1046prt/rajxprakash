# 🚀 Deployment Guide

This project is configured for automatic deployment to GitHub Pages.

## 📋 Prerequisites

1. **GitHub Repository**: Push your code to a GitHub repository
2. **GitHub Pages**: Enable GitHub Pages in your repository settings
3. **Actions Permissions**: Ensure GitHub Actions has write permissions

## 🔧 Setup Steps

### 1. Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Save the settings

### 3. Configure Repository Settings

1. Go to **Settings** → **Actions** → **General**
2. Ensure **Actions permissions** is set to **Allow all actions and reusable workflows**
3. Save the settings

## 🔄 Automatic Deployment

Once configured, the site will automatically deploy when you:

- Push to the `main` branch
- Create a pull request to `main`

## 📁 Build Output

The site builds to the `dist/` directory and deploys to:

- **URL**: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`
- **Custom Domain**: `https://prakashraj.info` (if configured)

## 🛠️ Manual Deployment

If you need to deploy manually:

```bash
# Build the project
npm run build

# Deploy using gh-pages (if configured)
npm run deploy
```

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails**: Check GitHub Actions logs for errors
2. **404 Errors**: Ensure all file paths are correct
3. **Styling Issues**: Verify Tailwind CSS is building correctly
4. **Images Not Loading**: Check image paths in `public/` directory

### Check Build Locally:

```bash
npm run build
npm run preview
```

## 📊 Deployment Status

- ✅ Build process configured
- ✅ GitHub Actions workflow ready
- ✅ Static site generation working
- ✅ Custom domain configured
- ✅ All dependencies included

Your site is ready to deploy! 🎉
