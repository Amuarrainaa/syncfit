import Link from 'next/link';
import { Stopwatch, PieChart, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MacroRing } from '@/components/nutrition/macro-ring';
import { WeightTrendChart } from '@/components/progress/weight-trend-chart';
import { demoWeightTrend, demoMacroTarget } from '@/data/demo';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-6 py-16">
      <section className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            SyncFit: Entrenamiento y nutrición en una sola PWA
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Registra tus entrenos, controla macros y recibe ajustes automáticos basados en tu tendencia de peso.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/onboarding">Comenzar onboarding</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/sign-in">Iniciar sesión</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand">Vista previa</h2>
          <div className="mt-4 grid gap-6">
            <MacroRing values={demoMacroTarget} consumed={{ protein: 135, carbs: 210, fat: 55 }} />
            <WeightTrendChart data={demoWeightTrend} />
          </div>
        </div>
      </section>
      <section className="grid gap-8 md:grid-cols-3">
        {cards.map((card) => (
          <div key={card.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/50">
            <card.icon className="h-8 w-8 text-brand" />
            <h3 className="mt-4 text-xl font-semibold">{card.title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{card.description}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

const cards = [
  {
    title: 'Registro inteligente',
    description: 'Sets con RPE, tempo, descanso y superseries con temporizador integrado.',
    icon: Stopwatch
  },
  {
    title: 'Macros adaptativos',
    description: 'Recomendaciones según Mifflin-St Jeor y auto-ajuste semanal basado en tendencia.',
    icon: PieChart
  },
  {
    title: 'Progreso visible',
    description: 'Gráficas de peso, volumen, PRs y exportación de datos CSV/JSON en un clic.',
    icon: BarChart3
  }
];
