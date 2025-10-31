import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Check if token is configured
    if (!process.env.HUBSPOT_PRIVATE_APP_TOKEN) {
      return NextResponse.json(
        { 
          error: "HubSpot token not configured",
          details: "HUBSPOT_PRIVATE_APP_TOKEN environment variable is not set. Please add it to your .env.local file or Webflow Cloud environment variables."
        },
        { status: 500 }
      );
    }

    // Optional: Get user's email from request headers for filtering
    const email = request.headers.get("x-user-email");

    // Build search query for HubSpot tickets
    const searchBody = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "hs_pipeline_stage",
              operator: "NEQ",
              value: "closed", // Example: exclude closed tickets
            },
          ],
        },
      ],
      properties: [
        "subject",
        "content",
        "hs_pipeline",
        "hs_pipeline_stage",
        "hs_ticket_priority",
        "createdate",
        "hs_lastmodifieddate",
      ],
      limit: 100,
    };

    console.log("Calling HubSpot API...");

    // Call HubSpot API
    const res = await fetch(
      "https://api.hubapi.com/crm/v3/objects/tickets/search",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchBody),
      }
    );

    console.log("HubSpot API response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("HubSpot API error:", res.status, errorText);
      
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
      console.error("Unexpected response type:", contentType, text);
      return NextResponse.json(
        { 
          error: "Unexpected response from HubSpot API",
          details: "Expected JSON but received " + contentType 
        },
        { status: 500 }
      );
    }

    const data = await res.json();
    console.log("Successfully fetched tickets:", data.results?.length || 0);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching tickets:", err);
    return NextResponse.json(
      { 
        error: "Failed to fetch tickets",
        details: err instanceof Error ? err.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

