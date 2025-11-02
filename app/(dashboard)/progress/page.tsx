import { WeightTrendChart } from '@/components/progress/weight-trend-chart';
import { PhotoGrid } from '@/components/progress/photo-grid';
import { demoWeightTrend } from '@/data/demo';

export const metadata = {
  title: 'Progreso | SyncFit'
};

export default function ProgressPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Tu progreso</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Revisa tendencias de peso, medidas corporales y fotos (solo metadatos almacenados).
        </p>
      </header>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/50">
        <h2 className="text-lg font-semibold">Peso y tendencia</h2>
        <WeightTrendChart data={demoWeightTrend} />
      </section>
      <PhotoGrid />
    </main>
  );
}
