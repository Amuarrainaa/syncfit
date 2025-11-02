import Link from 'next/link';
import { MacroRing } from '@/components/nutrition/macro-ring';
import { WeightTrendChart } from '@/components/progress/weight-trend-chart';
import { RestTimer } from '@/components/workouts/rest-timer';
import { CalorieProgressBar } from '@/components/nutrition/calorie-progress-bar';
import { demoMacroTarget, demoWeightTrend } from '@/data/demo';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Dashboard | SyncFit'
};

export default function DashboardPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Hola, atleta</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">Tu resumen de hoy y próximos pasos.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/training">Registrar entreno</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/nutrition">Añadir comida</Link>
          </Button>
        </div>
      </header>
      <section className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/50">
          <h2 className="text-lg font-semibold">Tendencia de peso 14 días</h2>
          <WeightTrendChart data={demoWeightTrend} />
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/50">
            <h2 className="text-lg font-semibold">Macros de hoy</h2>
            <MacroRing values={demoMacroTarget} consumed={{ protein: 120, carbs: 180, fat: 60 }} />
            <CalorieProgressBar target={demoMacroTarget.calories} consumed={2150} trendDelta={-0.004} />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/50">
            <h2 className="text-lg font-semibold">Descanso activo</h2>
            <RestTimer initialSeconds={90} />
          </div>
        </div>
      </section>
      <section className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Exporta tus datos y revisa recomendaciones de ajuste calórico desde <Link href="/settings" className="underline">
            Ajustes
          </Link>.
        </p>
      </section>
    </main>
  );
}
