'use client';

import { Button } from '@/components/ui/button';

export function ExportPanel() {
  const exportData = (format: 'csv' | 'json') => {
    const payload = {
      workouts: JSON.parse(window.localStorage.getItem('syncfit-workout') ?? '[]'),
      meals: JSON.parse(window.localStorage.getItem('syncfit-meals') ?? '[]'),
      metrics: JSON.parse(window.localStorage.getItem('syncfit-metrics') ?? '[]')
    };
    const blob = new Blob([
      format === 'json' ? JSON.stringify(payload, null, 2) : toCsv(payload)
    ], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `syncfit-export.${format}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/50">
      <h2 className="text-lg font-semibold">Exportación de datos</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Descarga tus registros en CSV o JSON para cumplir con GDPR. Puedes solicitar borrado en soporte@syncfit.test.
      </p>
      <div className="mt-4 flex gap-3">
        <Button type="button" onClick={() => exportData('csv')}>
          Exportar CSV
        </Button>
        <Button type="button" variant="outline" onClick={() => exportData('json')}>
          Exportar JSON
        </Button>
      </div>
    </section>
  );
}

function toCsv(payload: { workouts: unknown[]; meals: unknown[]; metrics: unknown[] }) {
  const lines = ['type,data'];
  lines.push(`workouts,"${JSON.stringify(payload.workouts).replace(/"/g, '""')}"`);
  lines.push(`meals,"${JSON.stringify(payload.meals).replace(/"/g, '""')}"`);
  lines.push(`metrics,"${JSON.stringify(payload.metrics).replace(/"/g, '""')}"`);
  return lines.join('\n');
}
