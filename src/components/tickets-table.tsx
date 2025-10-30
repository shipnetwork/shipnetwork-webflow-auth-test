"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface HubSpotTicket {
  id: string;
  properties: {
    subject: string;
    content?: string;
    hs_pipeline?: string;
    hs_pipeline_stage?: string;
    hs_ticket_priority?: string;
    createdate: string;
    hs_lastmodifieddate?: string;
  };
}

export function TicketsTable() {
  const [tickets, setTickets] = useState<HubSpotTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/tickets");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch tickets");
        }
        const data = await res.json();
        setTickets(data.results || []);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError(err instanceof Error ? err.message : "Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">
          <strong>Error:</strong> {error}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Make sure your HUBSPOT_PRIVATE_APP_TOKEN is set in your environment variables.
        </p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">No tickets found.</p>
      </div>
    );
  }

  const getPriorityBadge = (priority?: string) => {
    const priorityMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      HIGH: { variant: "destructive", label: "High" },
      MEDIUM: { variant: "default", label: "Medium" },
      LOW: { variant: "secondary", label: "Low" },
    };

    const config = priority ? priorityMap[priority] : null;
    return config ? (
      <Badge variant={config.variant}>{config.label}</Badge>
    ) : (
      <Badge variant="outline">—</Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Modified</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-medium">
                {ticket.properties.subject || "Untitled Ticket"}
              </TableCell>
              <TableCell>
                {getPriorityBadge(ticket.properties.hs_ticket_priority)}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {ticket.properties.hs_pipeline_stage || "Unknown"}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(ticket.properties.createdate)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {ticket.properties.hs_lastmodifieddate
                  ? formatDate(ticket.properties.hs_lastmodifieddate)
                  : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

