'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  onUndo?: () => void;
  onDismiss: () => void;
  duration?: number;
}

export function Toast({ message, onUndo, onDismiss, duration = 4000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
      style={{
        background: 'var(--charcoal-brown, #3d3229)',
        color: '#fff',
      }}
    >
      <span className="text-sm font-medium">{message}</span>
      {onUndo && (
        <button
          onClick={() => {
            onUndo();
            setVisible(false);
            setTimeout(onDismiss, 300);
          }}
          className="text-sm font-semibold underline underline-offset-2 hover:opacity-80"
          style={{ color: 'rgb(253, 230, 138)' }}
        >
          Undo
        </button>
      )}
    </div>
  );
}
