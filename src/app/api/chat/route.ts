import { NextResponse } from "next/server";
import OpenAI from "openai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory?: Message[];
  userEmail?: string;
}

// System prompt moved inline
const SYSTEM_PROMPT = `You are a helpful ShipNetwork support assistant. Your goal is to answer customer questions accurately and reduce unnecessary support ticket submissions.

You have access to:
- Customer's HubSpot account data (orders, tickets, contact information)
- ShipNetwork Knowledge Base articles (shipping guides, FAQs, account info)
- Real-time data from the customer's account

Your responsibilities:
- Answer questions concisely and friendly
- Use the customer's actual data when available (orders, tickets, etc.)
- Cite Knowledge Base articles when relevant (include links)
- If you find information in the Knowledge Base, reference it clearly
- Suggest creating a support ticket only if you cannot answer the question
- Never make up or assume information you don't have
- Format responses clearly with markdown (lists, bold text, etc.)
- Be professional but conversational

Guidelines:
- Keep responses under 250 words when possible
- Use bullet points for lists
- Include relevant links to KB articles
- If asked about order status, reference specific order numbers
- If asked about tickets, show ticket IDs and statuses
- If you don't know something, admit it and suggest alternatives

Remember: You're here to help customers get answers fast and reduce the need for support tickets.`;

// Simplified KB content helper
function getRelevantKBContent(message: string): string {
  const lowerMessage = message.toLowerCase();
  let content = "";
  
  // Shipping content
  if (lowerMessage.includes("ship") || lowerMessage.includes("smartfill")) {
    content += `\n**SmartFill Guide**: SmartFill is our intelligent order fulfillment system. It automates packing, selects optimal packaging, and generates labels automatically. Orders before 2pm ship same-day.\n`;
  }
  
  // Pricing content
  if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("material")) {
    content += `\n**Pricing**: Small box $0.35, Medium $0.55, Large $0.85. Pick & pack $2.50/order. Volume discounts available for 1000+ orders/month.\n`;
  }
  
  // FAQ content
  if (lowerMessage.includes("?") || lowerMessage.includes("how")) {
    content += `\n**FAQs**: Orders before 2pm EST ship same day. We ship internationally to 200+ countries. Tracking numbers are emailed automatically.\n`;
  }
  
  return content || "\n**General Info**: ShipNetwork provides fulfillment services including warehousing, order processing, and shipping.\n";
}

// Add a GET handler to test if the route works at all
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Chat API is running",
    hasOpenAI: !!process.env.OPENAI_API_KEY,
    hasHubSpot: !!process.env.HUBSPOT_PRIVATE_APP_TOKEN,
  });
}

// Helper function to query HubSpot tickets by user email
async function getHubSpotTickets(userEmail: string) {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) return null;

  try {
    // First, find the contact by email
    const contactRes = await fetch(
      "https://api.hubapi.com/crm/v3/objects/contacts/search",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "email",
                  operator: "EQ",
                  value: userEmail,
                },
              ],
            },
          ],
          properties: ["email", "firstname", "lastname"],
          limit: 1,
        }),
      }
    );

    if (!contactRes.ok) return null;
    const contactData: any = await contactRes.json();
    
    if (!contactData.results || contactData.results.length === 0) {
      return null;
    }

    const contactId = contactData.results[0].id;

    // Get tickets for this contact
    const ticketsRes = await fetch(
      "https://api.hubapi.com/crm/v3/objects/tickets/search",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: [
            "subject",
            "content",
            "hs_pipeline_stage",
            "hs_ticket_priority",
            "hs_ticket_category",
            "source_type",
            "createdate",
            "hs_lastmodifieddate",
            "closed_date",
            "hs_resolution",
          ],
          limit: 10,
          sorts: [
            {
              propertyName: "createdate",
              direction: "DESCENDING",
            },
          ],
        }),
      }
    );

    if (!ticketsRes.ok) return null;
    const ticketsData: any = await ticketsRes.json();

    // Filter tickets associated with this contact
    const userTickets: any[] = [];
    for (const ticket of ticketsData.results || []) {
      const assocRes = await fetch(
        `https://api.hubapi.com/crm/v3/objects/tickets/${ticket.id}/associations/contacts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (assocRes.ok) {
        const assocData: any = await assocRes.json();
        const isAssociated = assocData.results?.some(
          (assoc: any) => assoc.id === contactId || assoc.toObjectId === contactId
        );

        if (isAssociated) {
          userTickets.push(ticket);
        }
      }
    }

    return userTickets.slice(0, 5); // Return max 5 most recent tickets
  } catch (error) {
    console.error("Error fetching HubSpot tickets:", error);
    return null;
  }
}

// Helper function to query HubSpot orders (if available)
async function getHubSpotOrders(userEmail: string) {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) return null;

  try {
    // Try to fetch orders (this depends on your HubSpot setup)
    const ordersRes = await fetch(
      "https://api.hubapi.com/crm/v3/objects/orders/search",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: [
            "hs_order_name",
            "hs_order_status", 
            "hs_order_number",
            "amount",
            "hs_tracking_number",
            "createdate",
            "hs_lastmodifieddate"
          ],
          limit: 5,
          sorts: [
            {
              propertyName: "createdate",
              direction: "DESCENDING",
            },
          ],
        }),
      }
    );

    if (!ordersRes.ok) return null;
    const ordersData: any = await ordersRes.json();
    return ordersData.results || [];
  } catch (error) {
    console.error("Error fetching HubSpot orders:", error);
    return null;
  }
}

export async function POST(request: Request) {
  // Wrap everything in try-catch to always return JSON
  try {
    // Log for debugging
    console.log("[Chat API] Request received");
    console.log("[Chat API] OpenAI key exists:", !!process.env.OPENAI_API_KEY);
    console.log("[Chat API] HubSpot key exists:", !!process.env.HUBSPOT_PRIVATE_APP_TOKEN);

    const body: ChatRequest = await request.json();
    const { message, conversationHistory = [], userEmail: providedEmail } = body;

    console.log("[Chat API] User message:", message);
    console.log("[Chat API] User email:", providedEmail);

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("[Chat API] OpenAI key not configured!");
      return NextResponse.json(
        { 
          error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.",
          hint: "Get your key from https://platform.openai.com/api-keys"
        },
        { status: 500 }
      );
    }
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Use the email provided from frontend (from Memberstack)
    const userEmail = providedEmail || "user@example.com"; // Fallback if not provided

    // Build context from Knowledge Base
    const kbContext = getRelevantKBContent(message);

    // Build context from HubSpot (if user asks about tickets/orders)
    let hubspotContext = "";
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("ticket") || lowerMessage.includes("support")) {
      const tickets = await getHubSpotTickets(userEmail);
      if (tickets && tickets.length > 0) {
        hubspotContext += "\n\n**User's Recent Tickets:**\n";
        tickets.forEach((ticket: any) => {
          const props = ticket.properties;
          hubspotContext += `
- **Ticket #${ticket.id}**
  - Subject: ${props.subject || "Untitled"}
  - Status: ${props.hs_pipeline_stage || "Unknown"}
  - Priority: ${props.hs_ticket_priority || "Not set"}
  - Category: ${props.hs_ticket_category || "General"}
  - Created: ${new Date(props.createdate).toLocaleDateString()}
  ${props.hs_lastmodifieddate ? `- Last Updated: ${new Date(props.hs_lastmodifieddate).toLocaleDateString()}` : ""}
  ${props.content ? `- Details: ${props.content.substring(0, 150)}...` : ""}
  ${props.hs_resolution ? `- Resolution: ${props.hs_resolution.substring(0, 150)}...` : ""}
`;
        });
      } else {
        hubspotContext += "\n\nNo recent support tickets found for this user.\n";
      }
    }

    if (lowerMessage.includes("order") || lowerMessage.includes("shipment")) {
      const orders = await getHubSpotOrders(userEmail);
      if (orders && orders.length > 0) {
        hubspotContext += "\n\n**User's Recent Orders:**\n";
        orders.forEach((order: any) => {
          const props = order.properties;
          hubspotContext += `
- **Order ${props.hs_order_number || props.hs_order_name || order.id}**
  - Status: ${props.hs_order_status || "Unknown"}
  ${props.amount ? `- Amount: $${props.amount}` : ""}
  ${props.hs_tracking_number ? `- Tracking: ${props.hs_tracking_number}` : ""}
  - Created: ${new Date(props.createdate).toLocaleDateString()}
`;
        });
      } else {
        hubspotContext += "\n\nNo recent orders found for this user.\n";
      }
    }

    // Build the full context
    const contextMessage = `
**Knowledge Base Information:**
${kbContext}

${hubspotContext}

Use the above information to answer the user's question. If you reference Knowledge Base articles, include the links. If you show user data (tickets/orders), be specific with IDs and statuses.
`;

    // Build messages array for OpenAI
    const messages: any[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: contextMessage },
      ...conversationHistory.slice(-6).map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
      max_tokens: 800,
    });

    const aiMessage = completion.choices[0]?.message?.content;

    if (!aiMessage) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: aiMessage,
      usage: completion.usage,
    });
  } catch (error: any) {
    // Log the full error for debugging
    console.error("[Chat API] Error:", error);
    console.error("[Chat API] Error stack:", error?.stack);

    // Handle specific OpenAI errors
    if (error?.status === 401) {
      return NextResponse.json(
        { 
          error: "Invalid OpenAI API key",
          details: "Your OpenAI API key appears to be invalid or expired."
        },
        { status: 500 }
      );
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again in a moment." },
        { status: 429 }
      );
    }

    // Generic error handler - always return JSON
    return NextResponse.json(
      {
        error: "Failed to process your message. Please try again.",
        details: error?.message || "Unknown error",
        type: error?.constructor?.name || "Unknown",
      },
      { status: 500 }
    );
  }
}

