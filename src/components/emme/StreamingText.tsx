import { useState, useEffect } from 'react';

interface StreamingTextProps {
  content: string;
  speed?: number; // Characters per millisecond
  onComplete?: () => void;
}

export function StreamingText({ content, speed = 15, onComplete }: StreamingTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(true);

  useEffect(() => {
    if (!content) return;
    
    let index = 0;
    setDisplayedText('');
    setIsStreaming(true);
    
    const streamInterval = setInterval(() => {
      if (index <= content.length) {
        setDisplayedText(content.slice(0, index));
        index++;
      } else {
        setIsStreaming(false);
        clearInterval(streamInterval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(streamInterval);
  }, [content, speed, onComplete]);

  return (
    <div className="prose prose-sm max-w-none">
      <p className="whitespace-pre-line text-sm leading-relaxed">
        {displayedText}
        {isStreaming && (
          <span className="inline-block w-2 h-4 ml-1 bg-purple-600 animate-pulse" />
        )}
      </p>
    </div>
  );
}