"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMemberstack } from "@/lib/memberstack";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Search, ExternalLink, User } from "lucide-react";
import { CreateTicketDialog } from "@/components/create-ticket-dialog";
import { Toggle } from "@/components/ui/toggle";

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
  url?: string;
}

interface TicketsResponse {
  results: HubSpotTicket[];
  paging?: {
    next?: {
      after: string;
    };
  };
  total?: number;
}

export function TicketsTableEnhanced() {
  const [tickets, setTickets] = useState<HubSpotTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [filterByUser, setFilterByUser] = useState(false);

  // Get logged-in user email
  useEffect(() => {
    const getCurrentMember = async () => {
      try {
        const memberstack = await getMemberstack();
        const member = await memberstack.getCurrentMember();
        console.log("Memberstack member:", member);
        
        // Try different possible email locations
        const email = member?.data?.email || member?.email || member?.auth?.email;
        
        if (email) {
          console.log("User email detected:", email);
          setUserEmail(email);
        } else {
          console.log("No email found in member data:", member);
        }
      } catch (err) {
        console.error("Error getting member:", err);
      }
    };
    getCurrentMember();
  }, []);

  const fetchTickets = async (cursor?: string, append = false) => {
    try {
      if (!append) setLoading(true);
      
      const params = new URLSearchParams({
        limit: "20",
        ...(cursor && { after: cursor }),
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(priorityFilter !== "all" && { priority: priorityFilter }),
        ...(filterByUser && userEmail && { userEmail }),
      });

      const res = await fetch(`/portal/api/tickets?${params.toString()}`);
      const data: TicketsResponse = await res.json();
      
      if (!res.ok) {
        const errorMsg = (data as any).details 
          ? `${(data as any).error}: ${(data as any).details}` 
          : (data as any).error || "Failed to fetch tickets";
        throw new Error(errorMsg);
      }
      
      if (append) {
        setTickets(prev => [...prev, ...(data.results || [])]);
      } else {
        setTickets(data.results || []);
      }
      
      setNextCursor(data.paging?.next?.after || null);
      setHasMore(!!data.paging?.next?.after);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [searchQuery, statusFilter, priorityFilter, filterByUser]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchTickets();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, searchQuery, statusFilter, priorityFilter, filterByUser]);

  const handleRefresh = () => {
    fetchTickets();
  };

  const handleLoadMore = () => {
    if (nextCursor) {
      fetchTickets(nextCursor, true);
    }
  };

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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Skeleton className="h-10 w-full md:w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive font-semibold mb-2">
          Error Loading Tickets
        </p>
        <p className="text-sm text-destructive mb-3">{error}</p>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  if (tickets.length === 0 && !loading) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No tickets found</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
              ? "Try adjusting your filters to find what you're looking for."
              : "No tickets have been created yet."}
          </p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>

          {userEmail && (
            <Toggle
              pressed={filterByUser}
              onPressedChange={setFilterByUser}
              aria-label="Filter by my tickets"
              variant="outline"
            >
              <User className="mr-2 h-4 w-4" />
              My Tickets
            </Toggle>
          )}

          <Button
            onClick={handleRefresh}
            variant="outline"
            size="icon"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>

          <CreateTicketDialog onTicketCreated={handleRefresh} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%] min-w-[200px]">Subject</TableHead>
                <TableHead className="min-w-[100px]">Priority</TableHead>
                <TableHead className="min-w-[120px]">Stage</TableHead>
                <TableHead className="min-w-[150px]">Created</TableHead>
                <TableHead className="min-w-[150px]">Last Modified</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id} className="group">
                  <TableCell className="font-medium">
                    <Link
                      href={`/portal/tickets/${ticket.id}`}
                      className="hover:underline line-clamp-2"
                    >
                      {ticket.properties.subject || "Untitled Ticket"}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {getPriorityBadge(ticket.properties.hs_ticket_priority)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {ticket.properties.hs_pipeline_stage || "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(ticket.properties.createdate)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {ticket.properties.hs_lastmodifieddate
                      ? formatDate(ticket.properties.hs_lastmodifieddate)
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {ticket.url && (
                      <a
                        href={ticket.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </a>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

