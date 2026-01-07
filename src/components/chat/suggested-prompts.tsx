"use client";

import { Package, HelpCircle, FileText, DollarSign } from "lucide-react";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const prompts = [
  {
    icon: Package,
    title: "Order Status",
    prompt: "What's the status of my recent order?",
    color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
  },
  {
    icon: FileText,
    title: "SmartFill Guide",
    prompt: "How does SmartFill work?",
    color: "bg-green-50 hover:bg-green-100 border-green-200",
  },
  {
    icon: HelpCircle,
    title: "My Tickets",
    prompt: "Show me my open support tickets",
    color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
  },
  {
    icon: DollarSign,
    title: "Pricing Info",
    prompt: "Explain your pricing for packing materials",
    color: "bg-orange-50 hover:bg-orange-100 border-orange-200",
  },
];

export function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          How can I help you today?
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Choose a suggestion or type your own question
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {prompts.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => onSelectPrompt(item.prompt)}
              className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${item.color}`}
            >
              <div className="flex-shrink-0">
                <Icon className="h-5 w-5 text-gray-700" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <p className="mt-0.5 text-xs text-gray-600">{item.prompt}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

