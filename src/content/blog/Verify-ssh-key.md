---
title: 'How to Get Verified GitHub Commits Through VS Code'
date: '2025-07-25'
excerpt: 'A complete guide to setting up SSH and GPG signing for verified commits in VS Code.'
image: '/assets/images/blog/blog-4.png'
---

## 🔐 What Are Verified Commits And Why Should You Care?

- verified commits are basically a way to prove that your code changes actually came from you and weren't tampered with. You know how anyone can set any name and email in Git? Verified commits solve that problem.

**Advantages of verified commits:**

- Builds trust with your code contributions
- Shows professionalism in open-source projects
- Prevents commit spoofing and impersonation
- Adds that satisfying green **Verified** badge on GitHub

## Prerequisites

- `Git` (version 2.34.0 or higher for SSH signing) installed
- A `GitHub account` with verified email
- A code editor like `VS Code`
- `PowerShell` or `Git Bash` terminal access

## **Step-by-Step Instructions:**

### _Check Your Git Email Configuration_

- First, verify your Git email matches your GitHub verified email:

```bash
git config user.email
```

- If it's incorrect, set it with:

```bash
git config --global user.email "your-email@example.com"
```

- Replace with an email verified on your GitHub account.

### **Method 1: SSH Signing**

- Generate an SSH key using the Ed25519 algorithm:

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

- When prompted for file location, press `Enter` to use default:
  - File location: `C:\Users\YourName\.ssh\id_ed25519`
  - Passphrase: Optional (press `Enter` twice for no passphrase)

### **1. Copy Your Public SSH Key**

- In PowerShell, run:

```bash
type $env:USERPROFILE\.ssh\id_ed25519.pub
```

- You'll see output like:

```bash
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK... your-email@example.com
```

- **Copy the entire line** (starting with `ssh-ed25519`)

### **2. Add SSH Key to GitHub**

- Go to [GitHub → Settings → SSH and GPG Keys](https://github.com/settings/ssh/new)
- Click `New SSH key`
- Title: `VS Code - Windows` (or your preferred name)
- Key type: `Authentication Key`
- Paste your copied public key
- Click `Add SSH key`

### **3. Configure Git for SSH Signing**

- Run these commands in your terminal:

```bash
git config --global gpg.format ssh
git config --global user.signingkey "$env:USERPROFILE\.ssh\id_ed25519.pub"
git config --global commit.gpgsign true
```

- This tells Git to:
  - Use SSH format for signing
  - Use your public key for signing commits
  - Sign all commits by default

---

## _Method 2: GPG Signing_

- If you prefer GPG over SSH, generate a GPG key:

```bash
gpg --full-generate-key
```

- Choose these options:
  - Key type: `RSA and RSA`
  - Key size: `4096 bits`
  - Validity: `Do not expire` (or as preferred)
  - Name/email: Match your GitHub verified email

### **1. Configure Git for GPG Signing**

- List your GPG keys to get the key ID:

```bash
gpg --list-secret-keys --keyid-format=long
```

- Configure Git with your GPG key:

```bash
git config --global user.signingkey ABCD1234EFGH5678
git config --global commit.gpgsign true
```

- Export and add to GitHub:

```bash
gpg --armor --export ABCD1234EFGH5678
```

- Go to [GitHub → Settings → SSH and GPG Keys](https://github.com/settings/keys) → `New GPG key`

### **2. Configure VS Code Settings**

- Open VS Code settings (`Ctrl + Shift + P` → `Preferences: Open Settings (JSON)`)
- Add these settings:

```json
{
  "git.enableCommitSigning": true,
  "terminal.integrated.env.windows": {
    "GPG_TTY": "tty"
  }
}
```

### Test Your Setup

- Open a Git-tracked project in VS Code
- Make a small change (e.g., edit README.md)
- Stage and commit the change
- Push to GitHub
- **Check verification locally:**

```bash
git log --show-signature -1
```

**Expected output:**

```bash
gpg: Signature made using SSH key ID SHA256:...
Good signature from "Your Name <your-email@example.com>"
```

### Verify on GitHub

- Go to your repository on GitHub
- Click on `Commits`
- Your latest commit should show: ✅ **Verified**

## **Troubleshooting Tips:**

**Not seeing "Verified" badge?**

- Ensure your Git version is 2.34.0+ for SSH signing:

```bash
git version
```

- Check that you're using SSH URL for GitHub repo:

```bash
git remote -v
```

- Should show: `git@github.com:username/repo.git`

**VS Code not signing commits?**

- Restart VS Code after configuration changes
- Check Git output in VS Code (`Git: Show Git Output` from Command Palette)
- Ensure VS Code is using system Git, not bundled version

**PowerShell path errors?**

- Use forward slashes in PowerShell:

```bash
git config --global user.signingkey "$env:USERPROFILE/.ssh/id_ed25519.pub"
```

## Useful Commands

- Check current Git signing configuration:

```bash
git config --list | grep sign
```

- Manually sign a single commit:

```bash
git commit -S -m "Manually signed commit"
```

- Test SSH connection to GitHub:

```bash
ssh -T git@github.com
```

- Now you're all set with verified commits! Every contribution you make will show that trusted green badge, proving your authenticity as a developer. Whether you choose SSH or GPG signing, your commits will stand out as verified and trustworthy in any repository.

---

**Thanks for reading!**

## _**Prakash Raj**_
