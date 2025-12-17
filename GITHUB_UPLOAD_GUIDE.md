# 🚀 Upload to GitHub - Step by Step Guide

Your project is now ready to be uploaded to GitHub! Follow these steps:

## ✅ What's Already Done

- ✅ Git repository initialized
- ✅ `.gitignore` updated (excludes `node_modules`, `.env`, `dist`, etc.)
- ✅ All files staged and committed
- ✅ Initial commit created

## 📋 Next Steps: Create GitHub Repository & Push

### Option 1: Using GitHub Website (Recommended for Beginners)

1. **Go to GitHub**
   - Visit: https://github.com
   - Sign in to your account (or create one if you don't have it)

2. **Create a New Repository**
   - Click the **"+"** icon in the top right corner
   - Select **"New repository"**
   - Repository name: `cdpta-platform` (or any name you prefer)
   - Description: "Center for Drug Policy & Technology Assessment Platform"
   - Choose **Public** or **Private** (your choice)
   - **DO NOT** check "Initialize with README" (we already have one)
   - **DO NOT** add .gitignore or license (we already have them)
   - Click **"Create repository"**

3. **Copy the Repository URL**
   - After creating, GitHub will show you commands
   - Copy the repository URL (it will look like: `https://github.com/yourusername/cdpta-platform.git`)

4. **Push Your Code**
   - Open PowerShell/Terminal in your project directory
   - Run these commands (replace `YOUR_REPO_URL` with the URL you copied):

```bash
cd "C:\Users\Home\CDPTA 3"
git remote add origin YOUR_REPO_URL
git branch -M main
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/yourusername/cdpta-platform.git
git branch -M main
git push -u origin main
```

---

### Option 2: Using GitHub CLI (If Installed)

If you have GitHub CLI installed, you can create the repo directly from terminal:

```bash
cd "C:\Users\Home\CDPTA 3"
gh repo create cdpta-platform --public --source=. --remote=origin --push
```

---

## 🔐 Authentication

When you push, GitHub may ask for authentication:

### Option A: Personal Access Token (Recommended)
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: "CDPTA Platform"
4. Select scopes: Check **"repo"** (full control of private repositories)
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)
7. When Git asks for password, paste the token instead

### Option B: GitHub Desktop
- Download GitHub Desktop: https://desktop.github.com
- Sign in and it will handle authentication automatically

---

## ✅ Verify Upload

After pushing, visit your repository on GitHub:
- You should see all your files
- README.md should be displayed
- All commits should be visible

---

## 🔒 Important Security Notes

### ✅ Already Protected:
- `.env` file is in `.gitignore` (won't be uploaded)
- `node_modules` is excluded
- Build artifacts (`dist/`) are excluded

### ⚠️ Before Pushing - Double Check:
1. **No sensitive data in code files**
   - Check that no API keys are hardcoded
   - Verify Supabase credentials are only in `.env` (which is ignored)

2. **Review `env.example`**
   - Make sure it doesn't contain real credentials
   - It should only have placeholder values

---

## 📝 Quick Command Reference

```bash
# Navigate to project
cd "C:\Users\Home\CDPTA 3"

# Check status
git status

# View commits
git log

# Add remote (replace with your URL)
git remote add origin https://github.com/yourusername/cdpta-platform.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main

# For future updates
git add .
git commit -m "Your commit message"
git push
```

---

## 🆘 Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin YOUR_REPO_URL
```

### Error: "Authentication failed"
- Use Personal Access Token instead of password
- Or set up SSH keys

### Error: "Permission denied"
- Make sure you're logged into the correct GitHub account
- Verify you have write access to the repository

---

## 🎉 Success!

Once uploaded, you can:
- Share the repository URL with others
- Set up GitHub Actions for CI/CD
- Enable GitHub Pages for documentation
- Collaborate with team members
- Track issues and manage projects

---

**Need help?** Check GitHub's documentation: https://docs.github.com

