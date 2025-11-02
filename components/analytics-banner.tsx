'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { pushToast } from '@/components/ui/toaster';

export function AnalyticsBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem('syncfit-analytics');
    if (!stored) setVisible(true);
  }, []);

  if (!visible) return null;

  const accept = () => {
    window.localStorage.setItem('syncfit-analytics', 'opt-in');
    setVisible(false);
    pushToast('Gracias por apoyar la mejora de SyncFit.');
  };

  const decline = () => {
    window.localStorage.setItem('syncfit-analytics', 'opt-out');
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white px-6 py-4 shadow-xl dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Usamos métricas locales opt-in para mejorar la experiencia. ¿Aceptas compartir uso anónimo?
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={decline}>
            Rechazar
          </Button>
          <Button size="sm" onClick={accept}>
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
}
