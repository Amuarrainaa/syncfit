import { MealComposer } from '@/components/nutrition/meal-composer';
import { FoodSearch } from '@/components/nutrition/food-search';

export const metadata = {
  title: 'Nutrición | SyncFit'
};

export default function NutritionPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Registra tu nutrición</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Busca alimentos, reutiliza comidas frecuentes y controla tus macros diarios.
        </p>
      </header>
      <section className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
        <FoodSearch />
        <MealComposer />
      </section>
    </main>
  );
}
