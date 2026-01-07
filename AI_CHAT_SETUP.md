# 🤖 AI Chat Assistant Setup Guide

## Overview

The ShipNetwork AI Chat Assistant is now integrated into your dashboard! It uses OpenAI's GPT-4o to answer customer questions, reducing support ticket submissions by providing instant, intelligent responses.

---

## ✨ Features

### What the Chat Assistant Can Do:

✅ **Answer questions about ShipNetwork services**
- Shipping processes and SmartFill
- Pricing and packing materials
- Account management
- General FAQs

✅ **Access real HubSpot data**
- View user's open support tickets
- Check order status and history
- Display ticket details and priorities

✅ **Reference Knowledge Base**
- Automatically pulls relevant KB articles
- Provides direct links to documentation
- Cites sources in responses

✅ **Smart context awareness**
- Remembers conversation history (last 6 messages)
- Personalizes responses based on user data
- Detects question intent to query appropriate data

---

## 🚀 Setup Instructions

### 1. Get Your OpenAI API Key

1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in or create an OpenAI account
3. Click **"Create new secret key"**
4. Give it a name (e.g., "ShipNetwork Chat")
5. Copy the key (starts with `sk-...`)
6. **Important:** Save it securely - you won't see it again!

### 2. Add to Environment Variables

#### For Local Development:

Add to your `.env.local` file:

```env
# OpenAI API Key (Required for AI Chat)
OPENAI_API_KEY=sk-proj-...your-key-here...

# HubSpot (if not already set)
HUBSPOT_PRIVATE_APP_TOKEN=pat-...your-token...
```

#### For Webflow Cloud Production:

1. Go to your Webflow site
2. Navigate to **Site Settings** > **Webflow Cloud**
3. Click your project
4. Go to **Environment Variables** tab
5. Add new variable:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** Your OpenAI API key
   - **Mark as Secret:** ✅ Yes
6. Click **Save**
7. Redeploy your app

### 3. Configure HubSpot Scopes (If Not Already Done)

Ensure your HubSpot Private App has these scopes enabled:

**Required:**
- `crm.objects.contacts.read`
- `crm.objects.tickets.read`

**Optional (for enhanced features):**
- `crm.objects.orders.read`
- `crm.objects.deals.read`
- `crm.objects.products.read`

To update scopes:
1. Go to HubSpot → **Settings** → **Integrations** → **Private Apps**
2. Edit your app
3. Check the required scopes
4. Save changes

---

## 🎨 UI Features

### Always-Visible Chat Interface

The chat widget is **always visible** on the dashboard, positioned above the tickets table. No collapse, no hiding - instant access for users.

### ChatGPT-Style Design

- Clean, familiar interface matching ChatGPT's look and feel
- User messages: Gray background, right-aligned avatar
- AI messages: White background, left-aligned with sparkle icon
- Markdown support: Bold, italic, lists, code blocks
- Copy button on all AI responses

### Suggested Prompts

When the chat is empty, users see 4 quick-start prompts:
1. "What's the status of my recent order?"
2. "How does SmartFill work?"
3. "Show me my open support tickets"
4. "Explain your pricing for packing materials"

### Smart Features

- **Auto-scroll:** New messages appear automatically
- **Typing indicator:** Animated dots while AI responds
- **Message history:** Persists in browser session
- **Clear chat:** One-click conversation reset
- **Error handling:** User-friendly error messages
- **Mobile responsive:** Works on all screen sizes

---

## 📊 How It Works

### Architecture Flow:

```
User types question
       ↓
Frontend (chat-widget.tsx)
       ↓
POST /api/chat
       ↓
[Server] Analyze question intent
       ↓
[Server] Query relevant data:
  - Knowledge Base articles (always)
  - HubSpot tickets (if question mentions tickets/support)
  - HubSpot orders (if question mentions orders/shipments)
       ↓
[Server] Build context + system prompt
       ↓
OpenAI API (GPT-4o)
       ↓
AI generates personalized response
       ↓
Return to user with markdown formatting
```

### Context Injection:

The AI receives:
1. **System Prompt:** Instructions on how to behave
2. **Knowledge Base Content:** Relevant articles based on keywords
3. **HubSpot Data:** User's tickets/orders if applicable
4. **Conversation History:** Last 6 messages for context
5. **User Question:** Current message

---

## 💰 OpenAI Pricing

**Model Used:** GPT-4o

**Costs:**
- Input: ~$2.50 per 1M tokens
- Output: ~$10 per 1M tokens

**Per Conversation:**
- Average: ~$0.003 (less than a penny!)

**Monthly Estimates:**
- 1,000 users × 5 messages each = ~$15/month
- 5,000 users × 5 messages each = ~$75/month
- 10,000 users × 5 messages each = ~$150/month

**Very affordable!** Even with heavy usage, costs remain minimal.

---

## 📁 File Structure

### Components

```
/src/components/chat/
  ├── chat-widget.tsx          # Main chat interface
  ├── chat-message.tsx         # Individual message component
  ├── chat-input.tsx           # Input field with auto-resize
  └── suggested-prompts.tsx    # Quick-start prompts
```

### Backend

```
/src/app/api/chat/
  └── route.ts                 # OpenAI + HubSpot integration

/src/lib/
  ├── openai.ts                # OpenAI client + system prompt
  └── kb-content.ts            # Knowledge Base content mapping
```

---

## 🔧 Customization

### Update Knowledge Base Content

Edit `/src/lib/kb-content.ts` to add/modify KB articles:

```typescript
export const kbContent = {
  shipping: {
    newArticle: {
      title: "New Feature Guide",
      url: "/portal/knowledge-base/shipping/new-feature",
      summary: "How to use our new feature",
      content: `Detailed content here...`,
    },
  },
};
```

### Modify AI Personality

Edit `/src/lib/openai.ts` to change the system prompt:

```typescript
export const SYSTEM_PROMPT = `You are a helpful ShipNetwork assistant...
[Customize behavior here]
`;
```

### Change Suggested Prompts

Edit `/src/components/chat/suggested-prompts.tsx`:

```typescript
const prompts = [
  {
    icon: YourIcon,
    title: "Prompt Title",
    prompt: "The actual question text",
    color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
  },
];
```

### Switch OpenAI Model

Edit `/src/app/api/chat/route.ts`:

```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",  // Change to gpt-4o-mini for faster/cheaper
  // or "gpt-4-turbo" for more power
  // ...
});
```

---

## 🧪 Testing

### Test Locally:

```bash
npm run dev
```

Visit `http://localhost:3000/dashboard` and try these test questions:

1. **KB Question:** "How does SmartFill work?"
2. **Pricing Question:** "What are your packing material prices?"
3. **HubSpot Question:** "Show me my tickets" (requires HubSpot data)
4. **Order Question:** "What's my order status?"

### Check Console:

Open browser DevTools → Console to see:
- API requests/responses
- Any errors
- OpenAI token usage

---

## 🐛 Troubleshooting

### Chat Not Responding

**Check 1:** Verify OpenAI API key is set
```bash
# In terminal
echo $OPENAI_API_KEY  # Should show sk-...
```

**Check 2:** Check browser console for errors
- Right-click → Inspect → Console tab

**Check 3:** Test OpenAI key manually
```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "test"}]
  }'
```

### HubSpot Data Not Showing

**Check 1:** Verify HubSpot token has correct scopes
- Go to HubSpot → Private Apps → Check scopes

**Check 2:** Test HubSpot API access
```bash
curl https://api.hubapi.com/crm/v3/objects/tickets \
  -H "Authorization: Bearer YOUR_HUBSPOT_TOKEN"
```

**Check 3:** Check server logs for errors
```bash
# In terminal where you ran npm run dev
# Look for "Error fetching HubSpot..." messages
```

### "Rate Limit Exceeded" Error

You're sending too many requests to OpenAI.

**Solution:**
- Wait a few minutes
- Upgrade your OpenAI plan for higher limits
- Implement rate limiting in the API route (optional)

### Chat History Not Persisting

Chat history is stored in browser `sessionStorage` and clears when:
- User closes the browser tab
- User clicks "Clear chat"
- User logs out

This is intentional for privacy. To persist longer, modify `chat-widget.tsx` to use `localStorage` instead.

---

## 📈 Analytics & Monitoring

### Track Usage (Optional)

Add analytics to `/src/app/api/chat/route.ts`:

```typescript
// After OpenAI call
console.log({
  timestamp: new Date(),
  userEmail,
  question: message,
  tokensUsed: completion.usage,
  responseTime: Date.now() - startTime,
});
```

### Monitor Costs

Check OpenAI dashboard:
- [https://platform.openai.com/usage](https://platform.openai.com/usage)
- View daily/monthly token usage
- Set spending limits

---

## 🚀 Future Enhancements

### Potential Improvements:

1. **Streaming Responses**
   - Show AI typing word-by-word (like ChatGPT)
   - Better UX for long responses

2. **Vector Search**
   - Use OpenAI Embeddings for KB search
   - More accurate article matching

3. **User Feedback**
   - Thumbs up/down buttons
   - Track helpful vs unhelpful responses

4. **Multi-language Support**
   - Detect user language
   - Respond in their preferred language

5. **Voice Input**
   - Speech-to-text for questions
   - Text-to-speech for responses

6. **File Attachments**
   - Allow users to upload images/docs
   - AI can analyze and respond

7. **Conversation Export**
   - Download chat history as PDF
   - Email transcript to user

---

## 🔐 Security Best Practices

1. **Never expose API keys in frontend**
   - ✅ Keys stay in `.env.local` (server-side only)
   - ✅ API route handles all OpenAI calls

2. **Rate limiting** (Optional)
   - Implement per-user request limits
   - Prevent abuse and cost overruns

3. **Input sanitization**
   - OpenAI API sanitizes by default
   - No additional XSS protection needed

4. **User data privacy**
   - Chat history stored locally (sessionStorage)
   - Not sent to external servers
   - HubSpot data queries are user-specific

---

## 📞 Support

If you encounter issues:

1. Check this guide first
2. Review browser console errors
3. Check OpenAI API status: [https://status.openai.com/](https://status.openai.com/)
4. Check HubSpot API status: [https://status.hubspot.com/](https://status.hubspot.com/)

---

## ✅ Checklist

Before going live:

- [ ] OpenAI API key added to Webflow Cloud environment variables
- [ ] HubSpot token has required scopes
- [ ] Tested chat on local development
- [ ] Verified HubSpot data integration works
- [ ] Updated Knowledge Base content in `kb-content.ts`
- [ ] Tested on mobile devices
- [ ] Set OpenAI spending limits (optional)
- [ ] Reviewed system prompt for brand voice
- [ ] Deployed to production

---

**You're all set!** 🎉

The AI Chat Assistant is ready to help your customers get instant answers and reduce support ticket volume.

