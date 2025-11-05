# Image Setup Instructions

## ✅ Images Successfully Added and FIXED!

The images have been uploaded and configured correctly. 

**IMPORTANT FIX:** Because the project uses `basePath: "/portal"` in next.config.ts, all static assets need to be accessed with the `/portal/` prefix.

## 📸 Images Used

### 1. Warehouse Image (Login page)
- **File name:** `image-login.jpg`
- **Location:** `/Users/miltonamaya/webflow-cloud-auth/public/image-login.jpg`
- **URL in code:** `/portal/image-login.jpg` (with /portal/ prefix!)
- **Used on:** Login page (right side)

### 2. Business Owner Image (Signup page)
- **File name:** `image-signup.jpg`
- **Location:** `/Users/miltonamaya/webflow-cloud-auth/public/image-signup.jpg`
- **URL in code:** `/portal/image-signup.jpg` (with /portal/ prefix!)
- **Used on:** Signup page (right side)

## ✅ What's Been Updated

### Login Page (`/login`)
- ✅ Updated logo to ShipNetwork logo from sidebar
- ✅ Added warehouse image to right side
- ✅ Login triggers welcome modal reset

### Signup Page (`/signup`)
- ✅ Updated logo to ShipNetwork logo from sidebar
- ✅ Added business owner image to right side
- ✅ Signup triggers welcome modal reset

### Dashboard Page (`/dashboard`)
- ✅ Welcome modal appears after login/signup
- ✅ Modal includes welcome text
- ✅ YouTube video embedded: https://www.youtube.com/watch?v=VKicBxK6_BY
- ✅ User can close modal
- ✅ Modal only shows once (stored in localStorage)

## 🔄 To Reset Welcome Modal

If you want to test the welcome modal appearing again, open browser DevTools and run:
```javascript
localStorage.removeItem("hasSeenWelcomeModal")
```

Then refresh the dashboard page.

