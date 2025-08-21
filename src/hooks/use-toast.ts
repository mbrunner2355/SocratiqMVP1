// Simple toast hook for development
import { useState } from 'react';

export interface Toast {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (toast: Toast) => {
    console.log('Toast:', toast.title, toast.description);
    setToasts(prev => [...prev, toast]);
    
    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t !== toast));
    }, 3000);
  };

  return { toast, toasts };
}