import { AdjustmentInsights } from '@/components/settings/adjustment-insights';
import { ExportPanel } from '@/components/settings/export-panel';

export const metadata = {
  title: 'Ajustes | SyncFit'
};

export default function SettingsPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Ajustes y privacidad</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Gestiona tus objetivos, descarga tus datos y revisa los ajustes automáticos de calorías.
        </p>
      </header>
      <AdjustmentInsights />
      <ExportPanel />
    </main>
  );
}
