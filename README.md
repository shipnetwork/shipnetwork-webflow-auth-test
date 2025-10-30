# Webflow Cloud + Memberstack Authentication Boilerplate

A production-ready Next.js boilerplate with complete Memberstack authentication (login, signup, password reset, protected routes) pre-configured for Webflow Cloud deployment.

## Prerequisites

- [Webflow account](https://webflow.com/dashboard/signup)
- [Memberstack account](https://memberstack.com/)
- [GitHub account](https://github.com/signup)
- Node.js 20.0.0+ and npm

## Setup

### 1. Clone and Create Your Repository

```bash
# Clone this repo
git clone https://github.com/julianmemberstack/webflow-cloud-auth.git
cd webflow-cloud-auth
npm install
```

Then create a new repository on [github.com/new](https://github.com/new) and push to it:

```bash
git remote set-url origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

### 2. Get Memberstack Credentials

1. Sign in to [Memberstack](https://memberstack.com/)
2. Go to **Dev Tools** in your Memberstack dashboard
3. Look near the **top right** - you'll see your Public Key and Secret Key
4. Copy the correct **live** or **test** mode credentials depending on what you want

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Open `.env` and add your Memberstack credentials:

```env
NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY="pk_sb_xxxxxxxxxxxxxx"
MEMBERSTACK_SECRET_KEY="sk_sb_xxxxxxxxxxxxxx"
```

### 3a. Add HubSpot Integration (Optional)

To enable HubSpot ticket display, add your HubSpot Private App token to `.env`:

```env
HUBSPOT_PRIVATE_APP_TOKEN="your_hubspot_private_app_token_here"
```

To get your HubSpot token:
1. Sign in to [HubSpot](https://app.hubspot.com/)
2. Go to **Settings** > **Integrations** > **Private Apps**
3. Create a new Private App or use an existing one
4. Ensure it has `crm.objects.tickets.read` scope
5. Copy the Access Token

### 4. Test Locally

```bash
npm run dev
```

Open [http://localhost:3000/app](http://localhost:3000/app) and test the authentication features.

### 5. Deploy to Webflow Cloud

1. In your Webflow site, go to **Site Settings** > **Webflow Cloud**
2. Click **Login to GitHub** and authorize
3. Click **Install GitHub App** and grant access to your repository
4. Click **Create New Project**:
   - **Project Name:** Whatever you want
   - **GitHub Repository:** Select your repository
   - Click **Create Project**
5. Click **Create Environment**:
   - **Branch:** `main`
   - **Mount Path:** `/app`
   - Click **Create Environment**
6. Add your environment variables:
   - Click **Environment Variables** tab
   - Add `NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY` with your public key
   - Add `MEMBERSTACK_SECRET_KEY` with your secret key (mark as secret)
   - Add `HUBSPOT_PRIVATE_APP_TOKEN` with your HubSpot token (mark as secret, optional)
   - Click **Save**
7. **Publish your Webflow site** (button in top right of Designer)
8. Deploy:
   - Option A: Run `webflow cloud deploy` in your terminal
   - Option B: Just push to GitHub and it auto-deploys

### 6. View Your App

Go to `https://your-site.webflow.io/app` to see your live app!

## What's Included

- Login and signup pages with validation
- Password reset flow (forgot password + reset)
- Protected account page with auth guard
- Automatic redirects for unauthenticated users
- HubSpot ticket integration (displays support tickets on dashboard)
- Secure API routes for backend operations
- Tailwind CSS + shadcn/ui components
- TypeScript

## Scripts

```bash
npm run dev      # Local development
npm run build    # Build for production
npm run preview  # Test production build locally
npm run deploy   # Deploy to Webflow Cloud
```

## Troubleshooting

**"404 Not Found" when accessing /app**
- Make sure you published your Webflow site after creating the environment

**Authentication not working**
- Verify both Memberstack environment variables are set in Webflow Cloud
- Make sure you're using keys from the same Memberstack app
- Check that your public key starts with `NEXT_PUBLIC_`

**Deployment not starting after Git push**
- Go to Webflow Cloud settings and verify GitHub App has repo access
- Try `webflow cloud deploy` manually

**HubSpot tickets not loading**
- Verify `HUBSPOT_PRIVATE_APP_TOKEN` is set in your `.env` file (local) or Webflow Cloud environment variables (production)
- Ensure your HubSpot Private App has the `crm.objects.tickets.read` scope enabled
- Check browser console and server logs for specific error messages
- Test your token manually: `curl https://api.hubapi.com/crm/v3/objects/tickets -H "Authorization: Bearer YOUR_TOKEN"`

## Learn More

- [Webflow Cloud Docs](https://developers.webflow.com/webflow-cloud)
- [Memberstack Docs](https://docs.memberstack.com/)
- [Next.js Docs](https://nextjs.org/docs)

---

Made with Webflow Cloud, Memberstack, and Next.js
