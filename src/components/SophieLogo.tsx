import { Bot } from "lucide-react";

export function SophieLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`${className} rounded-lg bg-purple-600 flex items-center justify-center`}>
      <Bot className="w-5 h-5 text-white" />
    </div>
  );
}