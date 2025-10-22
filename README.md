# Webflow Cloud + Memberstack Authentication Boilerplate

A production-ready Next.js 15 boilerplate with Memberstack authentication, pre-configured for deployment on Webflow Cloud. This template provides a complete authentication system including login, signup, account management, and password reset functionality.

## Features

- **Complete Authentication System**
  - Login and signup forms with validation
  - Password reset and forgot password flows
  - Protected routes with authentication guard
  - Account management dashboard

- **Pre-configured Stack**
  - Next.js 15.2.5 with App Router
  - Memberstack authentication integration
  - Tailwind CSS v4 with shadcn/ui components
  - TypeScript for type safety
  - Optimized for Webflow Cloud deployment

- **Ready to Deploy**
  - Webflow Cloud configuration included
  - Environment variable management
  - GitHub integration ready
  - DevLink support for Webflow design system

## Prerequisites

Before you begin, make sure you have:

- **A Webflow account** - [Sign up here](https://webflow.com/dashboard/signup) (free tier works)
- **A Memberstack account** - [Sign up here](https://memberstack.com/) (free tier works)
- **A GitHub account** - [Sign up here](https://github.com/signup)
- **Node.js 20.0.0 or higher** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

## Quick Start Guide

### Step 1: Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/julianmemberstack/webflow-cloud-auth.git
cd webflow-cloud-auth
npm install
```

### Step 2: Set Up Memberstack

#### 2.1 Create or Access Your Memberstack App

1. Go to [memberstack.com](https://memberstack.com/) and sign in
2. Click "Create New App" or select an existing app
3. Give your app a name (e.g., "My Webflow App")

#### 2.2 Get Your Memberstack API Keys

1. In your Memberstack dashboard, click on **Settings** in the left sidebar
2. Navigate to **Developer** section
3. You'll see two important keys:

**Public Key:**
- Look for "Public Key" or "Publishable Key"
- It should start with `pk_` (for production) or `pk_sb_` (for sandbox/testing)
- Click the copy icon to copy it
- Save this for later (you'll add it to `.env` as `NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY`)

**Secret Key:**
- Look for "Secret Key" or "API Secret Key"
- It should start with `sk_` (for production) or `sk_sb_` (for sandbox/testing)
- Click the copy icon to copy it
- Save this for later (you'll add it to `.env` as `MEMBERSTACK_SECRET_KEY`)

**Important:** Keep your Secret Key private. Never commit it to GitHub or share it publicly.

### Step 3: Set Up Webflow

#### 3.1 Create or Select a Webflow Site

1. Go to [webflow.com](https://webflow.com/) and sign in
2. Create a new site or select an existing one
   - You can use any Webflow site or template
   - For a pre-configured option, consider cloning the [Astral Fund template](https://webflow.com/made-in-webflow/website/astralfund-919afdc1091df68b8dc1347f952a)

#### 3.2 Get Your Webflow Site ID

1. Open your Webflow site in the Designer
2. Look at your browser's URL bar
3. Your Site ID is in the URL: `https://webflow.com/design/YOUR-SITE-NAME`
4. Or find it in **Site Settings** > **General** > Site ID
5. Copy this ID (it's a long alphanumeric string)

#### 3.3 Generate a Webflow API Token

1. In your Webflow site, go to **Site Settings** (gear icon in top left)
2. Navigate to **Apps & Integrations** tab
3. Scroll down to **API Access** section
4. Click **Generate API Token**
5. Give it a descriptive name (e.g., "Cloud Auth App")
6. Copy the token immediately (you won't be able to see it again!)
7. Save this for later (you'll add it to `.env` as `WEBFLOW_SITE_API_TOKEN`)

### Step 4: Configure Environment Variables

#### 4.1 Create Your Environment File

In your project root directory, you'll find a `.env.example` file. Create a copy of it:

```bash
cp .env.example .env
```

#### 4.2 Add Your Keys

Open the `.env` file in your code editor and fill in all four values:

```env
# Webflow Configuration
WEBFLOW_SITE_ID="your-site-id-here"
WEBFLOW_SITE_API_TOKEN="your-webflow-api-token-here"

# Memberstack Configuration
NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY="pk_sb_xxxxxxxxxxxxxx"
MEMBERSTACK_SECRET_KEY="sk_sb_xxxxxxxxxxxxxx"
```

Replace the placeholder values with the actual keys you copied in Steps 2 and 3.

**Important:** The `.env` file is already in `.gitignore` and won't be committed to GitHub.

### Step 5: Test Locally

#### 5.1 Run the Development Server

```bash
npm run dev
```

Open your browser and navigate to [http://localhost:3000/app](http://localhost:3000/app)

#### 5.2 Test Authentication Features

Try the following:
- Visit `/app/login` to test the login form
- Visit `/app/signup` to create a test account
- Visit `/app/account` to see the protected account page
- Visit `/app/forgot-password` to test password reset
- Check that authentication guard redirects work correctly

If everything works locally, you're ready to deploy!

### Step 6: Deploy to Webflow Cloud

#### 6.1 Create Your Own GitHub Repository and Push Code

1. Go to [github.com/new](https://github.com/new) and create a new repository
2. Name it whatever you like (e.g., "my-webflow-app")
3. **Do NOT** initialize with README (the cloned repo already has one)
4. Create the repository and copy its URL

Then in your terminal:

```bash
git remote set-url origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

Replace the URL with your new repository's URL.

#### 6.2 Install the Webflow CLI

If you haven't installed the Webflow CLI globally yet:

```bash
npm install -g @webflow/webflow-cli
```

Verify installation:

```bash
webflow --version
```

#### 6.3 Connect GitHub to Webflow Cloud

1. In your Webflow site, go to **Site Settings**
2. Click **Webflow Cloud** in the left sidebar
3. Click **Login to GitHub** and authorize Webflow
4. Click **Install GitHub App** and grant access to your repository

#### 6.4 Create a Webflow Cloud Project

1. In the Webflow Cloud section, click **Create New Project**
2. Fill in the project details:
   - **Project Name:** Choose a descriptive name (e.g., "Auth App")
   - **GitHub Repository:** Enter your repository URL or select it from the dropdown
   - **Description:** (Optional) Describe your project
   - **Directory:** Leave blank (project is in root directory)
3. Click **Create Project**

#### 6.5 Create an Environment

1. After creating the project, click **Create Environment**
2. Configure your environment:
   - **Branch:** Select `main` (or your default branch)
   - **Mount Path:** Enter `/app` (this is pre-configured in next.config.ts)
   - **Environment Name:** "Production" or "Main"
3. Click **Create Environment**

#### 6.6 Add Environment Variables in Webflow Cloud

**Important:** You must add your environment variables to Webflow Cloud for your app to work in production.

1. In your Webflow Cloud environment, click **Settings** or **Environment Variables**
2. Add each of the following variables:

| Variable Name | Value |
|--------------|-------|
| `WEBFLOW_SITE_ID` | Your Webflow site ID |
| `WEBFLOW_SITE_API_TOKEN` | Your Webflow API token |
| `NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY` | Your Memberstack public key |
| `MEMBERSTACK_SECRET_KEY` | Your Memberstack secret key |

3. Click **Save** after adding all variables

#### 6.7 Publish Your Webflow Site

For your Webflow Cloud app to go live, you need to publish your Webflow site:

1. In your Webflow Designer, click the **Publish** button in the top right
2. Select your publishing domain
3. Click **Publish to Selected Domains**

#### 6.8 Deploy Your App

You have two options to deploy:

**Option A: Deploy via CLI (Immediate)**

```bash
webflow cloud deploy
```

This will build and deploy your app immediately. The deployment may take up to 2 minutes.

**Option B: Deploy via Git Push (Automatic)**

Simply push to your GitHub branch:

```bash
git add .
git commit -m "Ready for deployment"
git push
```

Webflow Cloud will automatically detect the changes and deploy your app.

#### 6.9 View Your Live App

Once deployment completes successfully:

1. Go to your Webflow site's published URL
2. Add your mount path: `https://your-site.webflow.io/app`
3. You should see your authentication app live!

## Project Structure

```
webflow-cloud-auth/
├── src/
│   ├── app/                      # Next.js app router pages
│   │   ├── account/              # Protected account page
│   │   ├── forgot-password/      # Password reset request
│   │   ├── login/                # Login page
│   │   ├── reset-password/       # Password reset confirmation
│   │   ├── signup/               # Signup page
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout with AuthGuard
│   │   └── page.tsx              # Home page
│   ├── components/               # React components
│   │   ├── auth-guard.tsx        # Authentication protection
│   │   ├── login-form.tsx        # Login form component
│   │   ├── signup-form.tsx       # Signup form component
│   │   ├── forgot-password-form.tsx  # Forgot password form
│   │   ├── reset-password-form.tsx   # Reset password form
│   │   └── ui/                   # shadcn/ui components
│   └── devlink/                  # Webflow design system (via DevLink)
├── public/                       # Static assets
├── .env.example                  # Environment variables template
├── .env                          # Your environment variables (gitignored)
├── next.config.ts                # Next.js configuration (mount path: /app)
├── webflow.json                  # Webflow Cloud configuration
└── package.json                  # Dependencies and scripts
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run preview      # Preview production build locally
npm run deploy       # Deploy to Webflow Cloud
npm run lint         # Run ESLint
```

## Deployment Monitoring

### View Deployment Status

1. In Webflow Cloud, navigate to your environment
2. Click on **Deployments** tab
3. See deployment history and status

### View Build Logs

1. In your environment, click on a specific deployment
2. Click **View Logs** to see build output
3. Check for errors or warnings

### Common Deployment Issues

If your deployment fails, check:
- Environment variables are set correctly in Webflow Cloud
- All required dependencies are in `package.json`
- No syntax errors in your code
- Build logs for specific error messages

## Troubleshooting

### "404 Not Found" when accessing `/app`

**Solution:** Make sure you've published your Webflow site after creating the environment.

### Authentication not working in production

**Solution:** Verify that all four environment variables are correctly set in Webflow Cloud settings.

### "MEMBERSTACK_PUBLIC_KEY is not defined" error

**Solution:** Make sure your Memberstack public key variable name starts with `NEXT_PUBLIC_` to be available on the client side.

### Deployment doesn't start after pushing to GitHub

**Solution:**
1. Go to Webflow Cloud settings
2. Click "Install GitHub App"
3. Verify Webflow has access to your repository
4. Try pushing a new commit

### Assets not loading (images, fonts, etc.)

**Solution:** Make sure asset paths include the mount path prefix `/app`. For example:
```tsx
// Correct
<img src="/app/images/logo.png" />

// Incorrect
<img src="/images/logo.png" />
```

### Local development works but production fails

**Solutions:**
1. Run `npm run preview` locally to test production build
2. Check build logs in Webflow Cloud for specific errors
3. Ensure environment variables match between local and production
4. Verify all dependencies are in `dependencies` (not `devDependencies`) if needed in production

## Customization

### Change the Mount Path

If you want to use a different mount path (e.g., `/auth` instead of `/app`):

1. Update `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  basePath: "/auth",  // Change this
};
```

2. Update asset references in your components
3. Update your Webflow Cloud environment mount path to match
4. Rebuild and redeploy

### Update Branding

- Modify metadata in `src/app/layout.tsx`
- Update global styles in `src/app/globals.css`
- Replace components with your own designs

### Add Webflow Components

This project is configured with DevLink. To add Webflow components:

1. Export components from your Webflow site via DevLink
2. Import them in your Next.js pages from `@/devlink`
3. Use them like any React component

Learn more: [Webflow DevLink Documentation](https://developers.webflow.com/devlink)

## Next Steps

Now that your app is deployed, you can:

1. **Customize the Design**
   - Update Tailwind styles
   - Add your own components
   - Integrate Webflow design system via DevLink

2. **Add More Features**
   - User profile editing
   - Member-only content
   - Subscription plans (Memberstack supports this)
   - Email verification

3. **Connect Webflow CMS**
   - Use Webflow CMS for content management
   - Fetch CMS data using Webflow API
   - Display dynamic content in your app

4. **Set Up Analytics**
   - Add Google Analytics
   - Track authentication events
   - Monitor user engagement

5. **Configure Custom Domain**
   - Set up a custom domain in Webflow
   - Update your environment URLs

## Learn More

- [Webflow Cloud Documentation](https://developers.webflow.com/webflow-cloud)
- [Memberstack Documentation](https://docs.memberstack.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Support

- **Webflow Cloud Issues:** [GitHub Issues](https://github.com/anthropics/claude-code/issues)
- **Memberstack Support:** [Memberstack Help Center](https://help.memberstack.com/)
- **Next.js Questions:** [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)

## License

This project is open source and available under the [MIT License](LICENSE).

---

Made with Webflow Cloud, Memberstack, and Next.js
