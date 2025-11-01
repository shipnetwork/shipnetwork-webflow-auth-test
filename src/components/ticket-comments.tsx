"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { MessageSquare, Send, Loader2 } from "lucide-react";

interface Comment {
  id: string;
  properties: {
    hs_note_body: string;
    hs_createdate: string;
    hs_lastmodifieddate?: string;
  };
}

interface TicketCommentsProps {
  ticketId: string;
}

export function TicketComments({ ticketId }: TicketCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    try {
      const res = await fetch(`/portal/api/tickets/${ticketId}/comments`);
      const data: any = await res.json();
      
      if (res.ok) {
        setComments(data.results || []);
      }
    } catch (err) {
      console.error("Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/portal/api/tickets/${ticketId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment.trim(),
        }),
      });

      if (!res.ok) {
        const data: any = await res.json();
        throw new Error(data.error || "Failed to add comment");
      }

      toast.success("Comment added successfully!");
      setNewComment("");
      fetchComments();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments & Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            placeholder="Add a comment or note..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={submitting}
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting || !newComment.trim()}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Post Comment
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {loading ? (
            <>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No comments yet. Be the first to add one!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="border rounded-lg p-4 space-y-2 bg-muted/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm whitespace-pre-wrap flex-1">
                    {comment.properties.hs_note_body}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDate(comment.properties.hs_createdate)}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

