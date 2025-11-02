import { WorkoutLog } from '@/components/workouts/workout-log';

export const metadata = {
  title: 'Registrar entrenamiento | SyncFit'
};

export default function TrainingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Sesión de hoy</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Registra tus sets con RPE, tempo y descanso. Las superseries se agrupan automáticamente.
        </p>
      </header>
      <WorkoutLog />
    </main>
  );
}
