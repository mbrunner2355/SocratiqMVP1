import { Bot } from "lucide-react";

export function SophieLogo({ className = "w-8 h-8", size }: { className?: string; size?: string }) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };
  
  const actualSize = size ? sizeClasses[size as keyof typeof sizeClasses] || "w-8 h-8" : className;
  
  return (
    <div className={`${actualSize} rounded-lg bg-purple-600 flex items-center justify-center`}>
      <Bot className="w-4 h-4 text-white" />
    </div>
  );
}