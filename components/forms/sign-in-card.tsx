'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function SignInCard() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-800/40 bg-slate-900/80 p-10 text-slate-50 shadow-2xl backdrop-blur">
      <h1 className="text-3xl font-semibold">Bienvenido/a de nuevo</h1>
      <p className="mt-2 text-sm text-slate-300">Accede para sincronizar tus entrenamientos y nutrición.</p>
      <div className="mt-8 grid gap-4">
        <Button onClick={() => signIn('google')} size="lg">
          Continuar con Google
        </Button>
        <Button variant="outline" size="lg" onClick={() => signIn('email')}>
          Acceder con enlace mágico
        </Button>
      </div>
    </div>
  );
}
