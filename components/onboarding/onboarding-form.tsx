'use client';

import { useMemo, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { mifflinStJeor } from '@/lib/tdee';
import { macroTargets } from '@/lib/macros';
import { Button } from '@/components/ui/button';
import { pushToast } from '@/components/ui/toaster';

const schema = z.object({
  sex: z.enum(['male', 'female', 'other']),
  age: z.number().min(16).max(90),
  heightCm: z.number().min(120).max(220),
  weightKg: z.number().min(35).max(200),
  experience: z.enum(['beginner', 'intermediate', 'advanced']),
  days: z.number().min(1).max(7),
  goal: z.enum(['cut', 'recomp', 'bulk', 'maintain']),
  activityFactor: z.number().min(1.2).max(1.8)
});

type FormValues = z.infer<typeof schema>;

export function OnboardingForm() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      sex: 'male',
      age: 30,
      heightCm: 178,
      weightKg: 78,
      experience: 'intermediate',
      days: 4,
      goal: 'recomp',
      activityFactor: 1.5
    }
  });

  const values = form.watch();

  const tdee = useMemo(() => {
    try {
      return Math.round(
        mifflinStJeor({
          sex: values.sex,
          age: Number(values.age),
          heightCm: Number(values.heightCm),
          weightKg: Number(values.weightKg),
          activityFactor: Number(values.activityFactor)
        })
      );
    } catch (error) {
      return 0;
    }
  }, [values]);

  const macros = useMemo(() => {
    if (!tdee) return null;
    return macroTargets({ tdee, goal: values.goal, weightKg: Number(values.weightKg) });
  }, [tdee, values.goal, values.weightKg]);

  const onSubmit = (data: FormValues) => {
    window.localStorage.setItem('syncfit-onboarding', JSON.stringify({ ...data, tdee, macros }));
    pushToast('Datos guardados. ¡Listo para entrenar!');
    router.push('/dashboard');
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid gap-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950/60"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Sexo" error={form.formState.errors.sex?.message}>
          <select className="input" {...form.register('sex')}>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
            <option value="other">Otro</option>
          </select>
        </Field>
        <Field label="Edad" error={form.formState.errors.age?.message}>
          <input type="number" className="input" {...form.register('age', { valueAsNumber: true })} />
        </Field>
        <Field label="Altura (cm)" error={form.formState.errors.heightCm?.message}>
          <input type="number" className="input" {...form.register('heightCm', { valueAsNumber: true })} />
        </Field>
        <Field label="Peso (kg)" error={form.formState.errors.weightKg?.message}>
          <input type="number" className="input" {...form.register('weightKg', { valueAsNumber: true })} />
        </Field>
        <Field label="Experiencia" error={form.formState.errors.experience?.message}>
          <select className="input" {...form.register('experience')}>
            <option value="beginner">Principiante</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzado</option>
          </select>
        </Field>
        <Field label="Días disponibles" error={form.formState.errors.days?.message}>
          <input type="number" className="input" {...form.register('days', { valueAsNumber: true })} />
        </Field>
        <Field label="Objetivo" error={form.formState.errors.goal?.message}>
          <select className="input" {...form.register('goal')}>
            <option value="cut">Déficit</option>
            <option value="recomp">Recomposición</option>
            <option value="maintain">Mantenimiento</option>
            <option value="bulk">Superávit</option>
          </select>
        </Field>
        <Field label="Factor de actividad" error={form.formState.errors.activityFactor?.message}>
          <input step="0.1" type="number" className="input" {...form.register('activityFactor', { valueAsNumber: true })} />
        </Field>
      </div>
      <div className="rounded-xl bg-slate-100 p-6 dark:bg-slate-900/60">
        <h2 className="text-lg font-semibold">Resumen estimado</h2>
        <div className="mt-4 grid gap-4 text-sm">
          <p>TDEE estimado: <strong>{tdee ? `${tdee} kcal` : '—'}</strong></p>
          {macros && (
            <ul className="grid gap-2">
              <li>Proteína: {macros.proteinGrams} g</li>
              <li>Grasas: {macros.fatGrams} g</li>
              <li>Carbohidratos: {macros.carbsGrams} g</li>
            </ul>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Guardar y continuar
        </Button>
      </div>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="font-medium text-slate-700 dark:text-slate-200">{label}</span>
      {children}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}
