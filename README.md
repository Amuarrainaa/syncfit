# SyncFit

Aplicación PWA construida con Next.js 14 que unifica el seguimiento de entrenamientos de fuerza y nutrición. El diseño responde al plan definido en `docs/mvp-plan.md`.

## Requisitos

- Node.js 20+
- PostgreSQL 14+

## Puesta en marcha

```bash
cp .env.example .env
# Actualiza DATABASE_URL y credenciales OAuth/SMTP
pnpm install
pnpm db:push
pnpm db:seed
pnpm dev
```

La app estará disponible en `http://localhost:3000`.

## Scripts útiles

- `pnpm lint`: Ejecuta ESLint con reglas de Next.js.
- `pnpm test`: Pruebas unitarias (Vitest) para TDEE/Macros y 1RM.
- `pnpm test:e2e`: Prueba E2E mínima (Playwright) para onboarding.
- `pnpm db:push`: Sincroniza el esquema Prisma con la base de datos.
- `pnpm db:seed`: Carga ejercicios y alimentos de ejemplo.

## Datos de ejemplo

Consulta la carpeta `data/` para encontrar workouts, comidas y registros de muestra en formatos JSON y CSV listos para importar.
