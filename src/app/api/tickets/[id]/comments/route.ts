import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Get comments for a ticket
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
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

    // Fetch engagements (notes/comments) for the ticket
    const res = await fetch(
      `https://api.hubapi.com/crm/v3/objects/tickets/${id}/associations/notes`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        {
          error: "Failed to fetch comments from HubSpot",
          details: errorText,
        },
        { status: res.status }
      );
    }

    const associations: any = await res.json();
    
    // If there are associated notes, fetch their details
    if (associations.results && associations.results.length > 0) {
      const noteIds = associations.results.map((a: any) => a.toObjectId);
      
      const notesRes = await fetch(
        `https://api.hubapi.com/crm/v3/objects/notes/batch/read`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            properties: ["hs_note_body", "hs_createdate", "hs_lastmodifieddate"],
            inputs: noteIds.map((id: string) => ({ id })),
          }),
        }
      );

      if (!notesRes.ok) {
        return NextResponse.json({ results: [] });
      }

      const notes = await notesRes.json();
      return NextResponse.json(notes);
    }

    return NextResponse.json({ results: [] });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to fetch comments",
        details: err instanceof Error ? err.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Add a comment to a ticket
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
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

    const body: any = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Create a note in HubSpot
    const noteRes = await fetch(
      "https://api.hubapi.com/crm/v3/objects/notes",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: {
            hs_note_body: content,
          },
        }),
      }
    );

    if (!noteRes.ok) {
      const errorText = await noteRes.text();
      return NextResponse.json(
        {
          error: "Failed to create note in HubSpot",
          details: errorText,
        },
        { status: noteRes.status }
      );
    }

    const note = await noteRes.json();

    // Associate the note with the ticket
    const associationRes = await fetch(
      `https://api.hubapi.com/crm/v3/objects/tickets/${id}/associations/notes/${note.id}/ticket_to_note`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!associationRes.ok) {
      return NextResponse.json(
        {
          error: "Failed to associate note with ticket",
        },
        { status: associationRes.status }
      );
    }

    return NextResponse.json(note, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to create comment",
        details: err instanceof Error ? err.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

