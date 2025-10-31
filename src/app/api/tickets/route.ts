import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Check if token is configured
    const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
    if (!token) {
      return NextResponse.json(
        { 
          error: "HubSpot token not configured",
          details: "HUBSPOT_PRIVATE_APP_TOKEN environment variable is not set. Please add it to your .env file or Webflow Cloud environment variables."
        },
        { status: 500 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const after = searchParams.get("after") || undefined;
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");
    const userEmail = searchParams.get("userEmail");

    // Build filters array
    const filters: any[] = [];

    // Status filter
    if (status && status !== "all") {
      filters.push({
        propertyName: "hs_pipeline_stage",
        operator: "EQ",
        value: status,
      });
    }

    // Priority filter
    if (priority && priority !== "all") {
      filters.push({
        propertyName: "hs_ticket_priority",
        operator: "EQ",
        value: priority,
      });
    }

    // Search filter (searches in subject)
    if (search) {
      filters.push({
        propertyName: "subject",
        operator: "CONTAINS_TOKEN",
        value: search,
      });
    }

    // Build search query for HubSpot tickets
    const searchBody: any = {
      properties: [
        "subject",
        "content",
        "hs_pipeline",
        "hs_pipeline_stage",
        "hs_ticket_priority",
        "createdate",
        "hs_lastmodifieddate",
      ],
      limit,
      sorts: [
        {
          propertyName: "createdate",
          direction: "DESCENDING"
        }
      ]
    };

    // Add filters if any exist
    if (filters.length > 0) {
      searchBody.filterGroups = [{ filters }];
    }

    // Add pagination cursor if provided
    if (after) {
      searchBody.after = after;
    }

    // Call HubSpot API
    const res = await fetch(
      "https://api.hubapi.com/crm/v3/objects/tickets/search",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchBody),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      
      // Parse common error messages
      let errorMessage = "Failed to fetch tickets from HubSpot";
      if (res.status === 401) {
        errorMessage = "Invalid HubSpot token. Please check your HUBSPOT_PRIVATE_APP_TOKEN.";
      } else if (res.status === 403) {
        errorMessage = "HubSpot token lacks required permissions. Ensure 'crm.objects.tickets.read' scope is enabled.";
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: errorText,
          status: res.status 
        },
        { status: res.status }
      );
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      return NextResponse.json(
        { 
          error: "Unexpected response from HubSpot API",
          details: "Expected JSON but received " + contentType 
        },
        { status: 500 }
      );
    }

    let data = await res.json();

    // If filtering by user email, we need to filter tickets by associated contact
    if (userEmail && data.results) {
      console.log("Filtering by user email:", userEmail);
      
      // First, find the contact with this email
      const contactRes = await fetch(
        `https://api.hubapi.com/crm/v3/objects/contacts/search`,
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
            properties: ["email"],
            limit: 1,
          }),
        }
      );

      if (contactRes.ok) {
        const contactData = await contactRes.json();
        console.log("Contact search results:", contactData);
        
        if (contactData.results && contactData.results.length > 0) {
          const contactId = contactData.results[0].id;
          console.log("Found contact ID:", contactId);
          
          // Filter tickets to only those associated with this contact
          const filteredTickets = [];
          
          for (const ticket of data.results) {
            // Check if ticket is associated with this contact
            const assocRes = await fetch(
              `https://api.hubapi.com/crm/v3/objects/tickets/${ticket.id}/associations/contacts`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            
            if (assocRes.ok) {
              const assocData = await assocRes.json();
              console.log(`Ticket ${ticket.id} associations:`, assocData);
              const isAssociated = assocData.results?.some(
                (assoc: any) => assoc.id === contactId || assoc.toObjectId === contactId
              );
              
              if (isAssociated) {
                console.log(`Ticket ${ticket.id} IS associated with contact ${contactId}`);
                filteredTickets.push(ticket);
              } else {
                console.log(`Ticket ${ticket.id} is NOT associated`);
              }
            }
          }
          
          console.log(`Total filtered tickets: ${filteredTickets.length}`);
          data.results = filteredTickets;
          data.total = filteredTickets.length;
        } else {
          console.log("No contact found with email:", userEmail);
          // No contact found with this email - return empty results
          data.results = [];
          data.total = 0;
        }
      } else {
        console.error("Contact search failed:", contactRes.status);
      }
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { 
        error: "Failed to fetch tickets",
        details: err instanceof Error ? err.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
    if (!token) {
      return NextResponse.json(
        {
          error: "HubSpot token not configured",
          details: "HUBSPOT_PRIVATE_APP_TOKEN environment variable is not set."
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { subject, content, priority } = body;

    if (!subject) {
      return NextResponse.json(
        { error: "Subject is required" },
        { status: 400 }
      );
    }

    // Create ticket in HubSpot
    const hubspotBody: any = {
      properties: {
        subject,
        hs_pipeline: "0", // Default pipeline
        hs_pipeline_stage: "1", // Open/New stage
      }
    };

    if (content) {
      hubspotBody.properties.content = content;
    }

    if (priority) {
      hubspotBody.properties.hs_ticket_priority = priority;
    }

    const res = await fetch(
      "https://api.hubapi.com/crm/v3/objects/tickets",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hubspotBody),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        {
          error: "Failed to create ticket in HubSpot",
          details: errorText,
          status: res.status
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to create ticket",
        details: err instanceof Error ? err.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
