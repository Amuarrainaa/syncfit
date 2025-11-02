'use client';

import { useEffect, useState } from 'react';

interface Toast {
  id: number;
  message: string;
}

let listeners: ((toast: Toast) => void)[] = [];
let counter = 0;

export function pushToast(message: string) {
  const toast: Toast = { id: ++counter, message };
  listeners.forEach((listener) => listener(toast));
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts((current) => [...current, toast]);
      setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== toast.id));
      }, 3200);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div key={toast.id} className="rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
          {toast.message}
        </div>
      ))}
    </div>
  );
}
