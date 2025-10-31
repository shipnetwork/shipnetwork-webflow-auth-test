import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TicketComments } from "@/components/ticket-comments";

interface TicketPageProps {
  params: Promise<{ id: string }>;
}

async function getTicket(id: string): Promise<any> {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  
  if (!token) {
    throw new Error("HubSpot token not configured");
  }

  const res = await fetch(
    `https://api.hubapi.com/crm/v3/objects/tickets/${id}?properties=subject,content,hs_pipeline,hs_pipeline_stage,hs_ticket_priority,createdate,hs_lastmodifieddate`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch ticket");
  }

  return res.json();
}

export default async function TicketPage({ params }: TicketPageProps) {
  const { id } = await params;
  const ticket = await getTicket(id);

  if (!ticket) {
    notFound();
  }

  const getPriorityBadge = (priority?: string) => {
    const priorityMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      HIGH: { variant: "destructive", label: "High Priority" },
      MEDIUM: { variant: "default", label: "Medium Priority" },
      LOW: { variant: "secondary", label: "Low Priority" },
    };

    const config = priority ? priorityMap[priority] : null;
    return config ? (
      <Badge variant={config.variant}>{config.label}</Badge>
    ) : null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container max-w-5xl py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/portal/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Ticket Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {ticket.properties.subject || "Untitled Ticket"}
            </h1>
            <div className="flex flex-wrap gap-2">
              {getPriorityBadge(ticket.properties.hs_ticket_priority)}
              <Badge variant="outline">
                {ticket.properties.hs_pipeline_stage || "Unknown Status"}
              </Badge>
            </div>
          </div>
          <a
            href={`https://app.hubspot.com/contacts/8210927/record/0-5/${ticket.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              View in HubSpot
            </Button>
          </a>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Created: {formatDate(ticket.properties.createdate)}</span>
          </div>
          {ticket.properties.hs_lastmodifieddate && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                Last updated: {formatDate(ticket.properties.hs_lastmodifieddate)}
              </span>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Ticket Content */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          {ticket.properties.content ? (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="whitespace-pre-wrap">{ticket.properties.content}</p>
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              No description provided
            </p>
          )}
        </CardContent>
      </Card>

      {/* Ticket Metadata */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Ticket Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Ticket ID
              </p>
              <p className="text-sm mt-1">{ticket.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Pipeline
              </p>
              <p className="text-sm mt-1">
                {ticket.properties.hs_pipeline || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Stage
              </p>
              <p className="text-sm mt-1">
                {ticket.properties.hs_pipeline_stage || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Priority
              </p>
              <p className="text-sm mt-1">
                {ticket.properties.hs_ticket_priority || "Not set"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <div className="mt-6">
        <TicketComments ticketId={id} />
      </div>
    </div>
  );
}

