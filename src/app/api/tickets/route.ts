import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
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

    if (!res.ok) {
      const errorText = await res.text();
      console.error("HubSpot API error:", res.status, errorText);
      return NextResponse.json(
        { error: "Failed to fetch tickets from HubSpot", details: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching tickets:", err);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

