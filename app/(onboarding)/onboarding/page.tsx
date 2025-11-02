import { OnboardingForm } from '@/components/onboarding/onboarding-form';

export const metadata = {
  title: 'Onboarding | SyncFit'
};

export default function OnboardingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-12">
      <h1 className="text-3xl font-semibold">Personaliza tu experiencia</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Completa los datos iniciales para calcular tu TDEE, macros y plantillas recomendadas. Puedes editarlos más tarde.
      </p>
      <OnboardingForm />
    </main>
  );
}
