// Knowledge Base content mapping for AI context
export const kbContent = {
  general: {
    clientManual: {
      title: "Client Manual",
      url: "/portal/knowledge-base/general/client-manual",
      summary: "Complete guide for ShipNetwork clients covering all basic operations and features.",
      content: `The ShipNetwork Client Manual provides comprehensive information about using our platform. 
      This includes account setup, navigation, and daily operations. Clients can reference this guide 
      for step-by-step instructions on common tasks.`,
    },
  },
  
  shipping: {
    orderAccuracy: {
      title: "Order Accuracy",
      url: "/portal/knowledge-base/shipping/order-accuracy",
      summary: "Learn how ShipNetwork ensures accurate order fulfillment and shipping.",
      content: `Order Accuracy is critical to our operations. We implement multiple verification steps:
      - Barcode scanning at every stage
      - Quality control checkpoints
      - Automated weight verification
      - Photo documentation of packed orders
      - Real-time inventory tracking
      
      Our accuracy rate is maintained above 99.5% through these systematic checks.`,
    },
    
    smartfillGuide: {
      title: "SmartFill Guide",
      url: "/portal/knowledge-base/shipping/smartfill-guide",
      summary: "Comprehensive guide to using SmartFill for automated order fulfillment.",
      content: `SmartFill is our intelligent order fulfillment system that automates the packing process.
      
      How SmartFill works:
      1. Orders are automatically received from your store
      2. Our system selects optimal packaging based on item dimensions
      3. Products are picked from inventory using barcode scanning
      4. SmartFill suggests the most cost-effective shipping method
      5. Labels are generated automatically
      6. Tracking information is sent to customers
      
      Benefits:
      - Faster fulfillment times (same-day processing for orders before 2pm)
      - Reduced shipping costs through optimal packaging
      - Fewer errors through automation
      - Real-time tracking updates
      
      To enable SmartFill, contact your account manager or submit a support ticket.`,
    },
  },
  
  account: {
    pricing: {
      title: "Stock Packing Material Price List",
      url: "/portal/knowledge-base/account/stock-packing-material-price-list",
      summary: "Current pricing for stock packing materials and fulfillment services.",
      content: `ShipNetwork Packing Materials Pricing:
      
      **Boxes:**
      - Small box (6x4x2): $0.35 each
      - Medium box (12x9x3): $0.55 each
      - Large box (18x12x6): $0.85 each
      - Extra-large box (24x18x12): $1.25 each
      
      **Protective Materials:**
      - Bubble wrap (per foot): $0.10
      - Air pillows (pack of 10): $1.50
      - Packing paper (per pound): $0.75
      - Foam inserts (custom): Starting at $2.00
      
      **Fulfillment Services:**
      - Pick and pack: $2.50 per order
      - Kitting services: $1.00 per unit
      - Custom packaging: Starting at $5.00
      - Returns processing: $3.00 per return
      
      **Volume Discounts:**
      - 1,000+ orders/month: 10% discount
      - 5,000+ orders/month: 15% discount
      - 10,000+ orders/month: Custom pricing
      
      Note: Prices subject to change. Contact your account manager for current rates and custom quotes.`,
    },
  },
  
  faqs: {
    general: {
      title: "Frequently Asked Questions",
      url: "/portal/knowledge-base/faqs",
      summary: "Common questions about ShipNetwork services and operations.",
      content: `Common questions:
      
      **Q: What are your shipping cutoff times?**
      A: Orders received before 2pm EST ship same day. Orders after 2pm ship next business day.
      
      **Q: Do you ship internationally?**
      A: Yes, we ship to 200+ countries. International rates vary by destination.
      
      **Q: How do I track my shipments?**
      A: Tracking numbers are emailed automatically and available in your dashboard.
      
      **Q: What happens if an order is damaged?**
      A: We have full insurance coverage. File a claim through your dashboard within 30 days.
      
      **Q: Can I use my own packaging materials?**
      A: Yes, you can ship materials to our warehouse. Storage fees may apply.
      
      **Q: How do returns work?**
      A: We can process returns and inspect items. Returns processing fee is $3.00 per item.`,
    },
  },
};

// Helper function to get relevant KB content based on user message keywords
export function getRelevantKBContent(message: string): string {
  const lowerMessage = message.toLowerCase();
  let relevantContent: string[] = [];
  
  // Check for shipping-related keywords
  if (lowerMessage.includes("ship") || lowerMessage.includes("delivery") || 
      lowerMessage.includes("fulfillment") || lowerMessage.includes("track")) {
    relevantContent.push(formatKBArticle(kbContent.shipping.orderAccuracy));
    
    if (lowerMessage.includes("smartfill") || lowerMessage.includes("automated")) {
      relevantContent.push(formatKBArticle(kbContent.shipping.smartfillGuide));
    }
  }
  
  // Check for pricing keywords
  if (lowerMessage.includes("price") || lowerMessage.includes("pricing") || 
      lowerMessage.includes("cost") || lowerMessage.includes("fee") ||
      lowerMessage.includes("material") || lowerMessage.includes("packaging")) {
    relevantContent.push(formatKBArticle(kbContent.account.pricing));
  }
  
  // Check for general help
  if (lowerMessage.includes("how to") || lowerMessage.includes("guide") || 
      lowerMessage.includes("manual") || lowerMessage.includes("help")) {
    relevantContent.push(formatKBArticle(kbContent.general.clientManual));
  }
  
  // Check for FAQs
  if (lowerMessage.includes("?") || lowerMessage.includes("return") || 
      lowerMessage.includes("international") || lowerMessage.includes("cutoff")) {
    relevantContent.push(formatKBArticle(kbContent.faqs.general));
  }
  
  // If no specific content matched, include general FAQs
  if (relevantContent.length === 0) {
    relevantContent.push(formatKBArticle(kbContent.faqs.general));
  }
  
  return relevantContent.join("\n\n");
}

function formatKBArticle(article: { title: string; url: string; content: string; summary: string }): string {
  return `**${article.title}** (${article.url})
${article.content}`;
}

// Get all KB content as a searchable index (for future vector search if needed)
export function getAllKBContent() {
  const allArticles = [
    kbContent.general.clientManual,
    kbContent.shipping.orderAccuracy,
    kbContent.shipping.smartfillGuide,
    kbContent.account.pricing,
    kbContent.faqs.general,
  ];
  
  return allArticles;
}

