'use client';

import { useEffect, useState } from 'react';

interface ProgressPhotoMeta {
  id: string;
  date: string;
  note?: string;
  url?: string;
}

export function PhotoGrid() {
  const [photos, setPhotos] = useState<ProgressPhotoMeta[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem('syncfit-photos');
    if (stored) {
      setPhotos(JSON.parse(stored));
    } else {
      setPhotos([
        {
          id: 'photo-1',
          date: new Date().toISOString(),
          note: 'Semana 1 - luz natural'
        }
      ]);
    }
  }, []);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/50">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Fotos de progreso</h2>
        <button className="text-sm text-brand underline" type="button">
          Guía de privacidad
        </button>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {photos.map((photo) => (
          <div key={photo.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 p-4 text-sm dark:border-slate-800">
            <div className="flex h-40 items-center justify-center rounded-lg bg-slate-200 text-xs text-slate-500 dark:bg-slate-800">
              {photo.url ? 'Foto subida' : 'Metadatos guardados'}
            </div>
            <div>
              <p className="font-medium">{new Date(photo.date).toLocaleDateString('es-ES')}</p>
              {photo.note && <p className="text-xs text-slate-500">{photo.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
