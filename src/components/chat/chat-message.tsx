"use client";

import { User, Sparkles, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import type { Message } from "./chat-widget";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`group border-b border-gray-200 px-6 py-8 ${
        isUser ? "bg-gray-50" : "bg-white"
      }`}
    >
      <div className="mx-auto flex max-w-3xl items-start gap-4">
        {/* Avatar */}
        <div
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
            isUser ? "bg-gray-700" : "bg-blue-600"
          }`}
        >
          {isUser ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <Sparkles className="h-4 w-4 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className="flex-1 space-y-2 overflow-hidden">
          <div className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:bg-gray-900 prose-pre:text-gray-100">
            {isUser ? (
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Customize link styling
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                  // Customize code block styling
                  code: ({ node, inline, ...props }: any) =>
                    inline ? (
                      <code
                        {...props}
                        className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm"
                      />
                    ) : (
                      <code
                        {...props}
                        className="block rounded-lg bg-gray-900 p-4 font-mono text-sm text-gray-100"
                      />
                    ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>

          {/* Copy Button (AI messages only) */}
          {!isUser && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-gray-500 opacity-0 transition-opacity hover:bg-gray-100 group-hover:opacity-100"
              title="Copy message"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Copy
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

