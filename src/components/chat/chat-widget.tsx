"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { SuggestedPrompts } from "./suggested-prompts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getMemberstack } from "@/lib/memberstack";

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Get logged-in user email
  useEffect(() => {
    const getCurrentMember = async () => {
      try {
        const memberstack = await getMemberstack();
        const member = await memberstack.getCurrentMember();
        
        // Email is in member.data.auth.email
        const email = member?.data?.auth?.email;
        
        if (email) {
          setUserEmail(email);
        }
      } catch (err) {
        console.error("Error getting member:", err);
      }
    };
    getCurrentMember();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load conversation from sessionStorage on mount
  useEffect(() => {
    const savedMessages = sessionStorage.getItem("chat-messages");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(
          parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
        );
      } catch (e) {
        console.error("Failed to load chat history:", e);
      }
    }
  }, []);

  // Save conversation to sessionStorage whenever it changes
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("chat-messages", JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/portal/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content.trim(),
          conversationHistory: messages.slice(-6), // Include last 6 messages for context
          userEmail: userEmail || undefined, // Send real user email
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || "Failed to get response");
      }

      const data = await response.json() as { message: string };

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearConversation = () => {
    setMessages([]);
    sessionStorage.removeItem("chat-messages");
    setError(null);
  };

  const showSuggestedPrompts = messages.length === 0 && !loading;

  return (
    <Card className="w-full">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">ShipNetwork Assistant</CardTitle>
              <CardDescription className="text-xs">
                Powered by OpenAI · Ask me anything
              </CardDescription>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleClearConversation}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear chat
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Messages Container */}
        <div
          ref={messagesContainerRef}
          className="h-[500px] overflow-y-auto scroll-smooth"
        >
          {showSuggestedPrompts ? (
            <div className="flex h-full items-center justify-center p-6">
              <SuggestedPrompts onSelectPrompt={handleSendMessage} />
            </div>
          ) : (
            <div className="flex flex-col">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              
              {loading && (
                <div className="border-b border-gray-200 bg-white px-6 py-8">
                  <div className="mx-auto flex max-w-3xl items-start gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="border-b border-red-200 bg-red-50 px-6 py-4">
                  <div className="mx-auto max-w-3xl">
                    <p className="text-sm text-red-600">
                      <strong>Error:</strong> {error}
                    </p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-4">
          <div className="mx-auto max-w-3xl">
            <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

