---
title: 'Git Rebase & Conflict Resolution'
date: '2024-07-19'
excerpt: "This is the first post on my new Astro-powered blog. Learn how I built it and what's coming next!"
image: '/assets/images/blog/blog-1.png'
---

## 🚀 Git Rebase & Conflict Resolution: A Step-by-Step Guide

Working in a collaborative Git environment often means rebasing your feature branch with the latest changes from `base`. This guide walks you through handling merge conflicts during a rebase, and how to safely push your updated branch back to GitHub.

---

## 🧭 Scenario

You’re working on a feature branch (e.g., `feature/xyz`) and your pull request (PR) shows:

> ❌ "This branch cannot be rebased due to conflicts"

To proceed, you need to rebase your branch onto the latest `main`, resolve conflicts, and update your branch.

---

## Step-by-Step Instructions

### 1. Checkout Your Feature Branch

```bash
git checkout feature/xyz
```

### 2. Fetch the Latest Changes from Remote

```bash
git fetch origin
```

### 3. Start the Rebase onto `base`

```bash
git rebase origin/base
```

> 🔄 If there are conflicts, Git will pause and ask you to resolve them.

### 4. Resolve Merge Conflicts

Open each conflicted file shown in the terminal (e.g., `src/page/index.astro`) and manually fix the conflicts:

- Keep the correct lines
- Delete Git conflict markers like:

```text
  <<<<<<< HEAD
  =======
  >>>>>>> commit-hash
```

Then stage the resolved file(s):

```bash
git add <file-name>
```

### 5. Continue the Rebase

```bash
git rebase --continue
```

> Repeat Steps 4–5 for all remaining conflicts until rebase completes.

### 6. If You Get a Vim Commit Message Prompt

If Git opens the commit message editor (like Vim), save and quit:

- In Vim: Press `Esc`, type `:wq`, and hit `Enter`

### 7. Verify Rebase Success

Once rebase finishes, Git will show:

```text
Successfully rebased and updated refs/heads/feature/RZA-250122.
```

### 8. Force Push Your Updated Branch

```bash
git push origin feature/xyz --force
```

> ⚠️ Force push is necessary because rebasing rewrites commit history.

## 📝 Optional Pull Request Comment

To inform reviewers, you can add a comment to your PR like:

```text
Rebased onto latest `develop`, resolved conflicts in `index.astro`, and force-pushed. Ready for review ✅
```

## 🧯 Bonus Commands

To **abort the rebase** at any point:

```bash
git rebase --abort
```

To **skip a conflicting commit** instead of resolving:

```bash
git rebase --skip
```

To **check current rebase status**:

```bash
git status
```

### 🏁 You're Done as your branch is now Synced with the latest **base** Free of conflicts cleanly rebased ready for review and merge

---

**Thanks For Reading!**

## _**Prakash Raj**_
