# MVP SyncFit: Registro de Progreso de Gimnasio y Nutrición

## 1) Resumen ejecutivo
### Propuesta de valor
Una sola PWA que centraliza entrenamiento de fuerza y seguimiento nutricional para aficionados/as que entrenan 3–6 días a la semana. Permite registrar sesiones, controlar calorías/macros, visualizar tendencias y recibir ajustes automáticos.

### KPIs principales
- Adherencia semanal a registros de entreno (≥80% sesiones planificadas registradas).
- Tendencia de peso a 14 días vs objetivo (±0.5% semanal según fase).
- Número de PRs detectados por usuario por mes.
- Precisión calórica (diferencia entre objetivo y consumo real ±10%).
- Ratio de sesiones registradas con RPE y descanso completo (para evaluar calidad de datos).

### Diferenciadores clave
- Algoritmo integrado de auto-ajuste calórico basado en tendencia y adherencia.
- Registro de superseries y RPE por set con temporizador de descanso sincronizado.
- Plantillas de progresión recomendadas según disponibilidad semanal y equipamiento.
- Experiencia offline básica y telemetría ética opt-in.
- Exportación de datos en CSV/JSON para transparencia y control del usuario.

## 2) Roadmap
### MVP (4–6 semanas)
- Onboarding con captura de datos iniciales (edad, sexo, altura, peso, experiencia, disponibilidad, equipamiento, objetivo, restricciones dietéticas). **Punto a confirmar:** presupuesto y preferencias alimentarias.
- Dashboard con resumen de peso, calorías, próximos entrenos y recordatorios.
- CRUD de entrenos: plantillas base (empuje/tirón/pierna, full body) + registro de sets con RPE, tempo, descanso, tags de superserie.
- Registro de nutrición: búsqueda de alimentos, comidas frecuentes, macros diarios.
- Métricas corporales (peso, medidas clave) y fotos (metadatos y guía de privacidad).
- Algoritmo de auto-ajuste de calorías y recomendaciones de macros.
- Exportación manual de datos (CSV/JSON) desde ajustes.
- Autenticación email y Google via NextAuth; RBAC básico (user/admin).
- Funcionalidad offline básica (cacheo último dashboard y creación diferida de registros).

### Versión 1.0 (8–12 semanas)
- Integración de escáner de código de barras para alimentos.
- Programación de progresiones personalizadas y compartir plantillas.
- Seguimiento de métricas adicionales (sueño, energía subjetiva).
- Integración con wearables (Apple Health/Google Fit) para calorías totales.
- Reportes avanzados y comparativas (volumen semanal por grupo muscular).
- Modo coach con gestión de múltiples clientes (RBAC extendido).

### “Nice to have” futuro
- App móvil nativa (Expo) con notificaciones push ricas.
- IA para análisis de técnica a partir de vídeos (privacidad primero).
- Marketplace de plantillas de entreno/nutrición.
- Integración con básculas inteligentes y dispositivos de cocina.

## 3) Arquitectura de alto nivel
### Opción A (recomendada)
- Frontend: Next.js 15 (App Router), TypeScript, Tailwind CSS + shadcn/ui, PWA (Workbox) con soporte offline parcial.
- Backend: API Routes / Route Handlers con Next.js; Prisma ORM conectado a PostgreSQL (Neon o Supabase).
- Autenticación: NextAuth (Email, Google). Middleware para RBAC básico.
- Almacenamiento: PostgreSQL (datos estructurados), almacenamiento de fotos opcional en proveedor cifrado (S3-compatible) solo en versiones posteriores; en MVP solo metadatos.
- Gráficas: Recharts con cálculos memoizados en cliente.
- Cache offline: IndexedDB via workbox-background-sync para entrenos/nutrición.

### Opción B
- React Native (Expo) + paquete core compartido (business logic en TypeScript compartida). Backend igual (Next.js API). Sincronización offline mediante SQLite/WatermelonDB.

### Diagrama textual (ASCII)
```
[UI Next.js (PWA)]
    |  (App Router, páginas, componentes shadcn/ui)
    v
[State Mgmt (React Query + Zustand para temporizadores)]
    |  (fetch API routes)
    v
[API Routes / Route Handlers]
    |  (tRPC opcional)          [Background jobs (Next Cron/Vercel)]
    |                                   |
    v                                   v
[Services de dominio (TS utils: tdee, macros, oneRm, trend, planner)]
    |
    v
[Prisma ORM]
    |
    v
[PostgreSQL]

[IndexedDB/Cache Storage] <--> [Service Worker] <--> [UI Offline]
```

## 4) Modelo de datos (ERD + DDL SQL)
### ERD ASCII
```
User ──< Goal ──< MacroTarget
 |\
 | \─< BodyMetric
 | \─< ProgressPhoto
 | \─< Workout ──< Exercise (via WorkoutExercise) ──< Set
 |                 |
 |                 └─< PersonalRecord
 |\
 | \─< AdjustmentLog
 | \─< Meal ──< MealItem >── Food
```
Nota: Exercise catálogo global; WorkoutExercise tabla pivote (no listada explícitamente en requisitos pero necesaria para relacionar ejercicios planificados). PersonalRecord puede vincularse a Exercise y User.

### Esquema SQL
```sql
CREATE TABLE "User" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  name TEXT,
  sex TEXT CHECK (sex IN ('male','female','other')),
  birth_date DATE,
  height_cm NUMERIC(5,2),
  weight_kg NUMERIC(5,2),
  experience_level TEXT CHECK (experience_level IN ('beginner','intermediate','advanced')),
  availability_days INT CHECK (availability_days BETWEEN 1 AND 7),
  equipment TEXT[],
  goal_type TEXT CHECK (goal_type IN ('cut','recomp','bulk','maintain')),
  dietary_restrictions TEXT[],
  allergies TEXT[],
  budget_eur NUMERIC(7,2),
  food_preferences TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Goal" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES "User"(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  target_weight NUMERIC(5,2),
  daily_calories INT,
  objective TEXT CHECK (objective IN ('cut','recomp','bulk','maintain')),
  notes TEXT
);

CREATE TABLE "MacroTarget" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES "Goal"(id) ON DELETE CASCADE,
  protein_g NUMERIC(6,2),
  carbs_g NUMERIC(6,2),
  fats_g NUMERIC(6,2),
  fiber_g NUMERIC(6,2),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(goal_id, date)
);

CREATE TABLE "BodyMetric" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES "User"(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weight_kg NUMERIC(5,2),
  waist_cm NUMERIC(5,2),
  hips_cm NUMERIC(5,2),
  chest_cm NUMERIC(5,2),
  notes TEXT,
  UNIQUE(user_id, date)
);

CREATE TABLE "ProgressPhoto" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES "User"(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  pose TEXT,
  uri TEXT NOT NULL,
  storage_type TEXT CHECK (storage_type IN ('local','external')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Exercise" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  equipment TEXT,
  primary_muscle TEXT,
  secondary_muscles TEXT[],
  is_bodyweight BOOLEAN DEFAULT FALSE,
  default_tempo TEXT,
  UNIQUE(name)
);

CREATE TABLE "Workout" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES "User"(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  template_type TEXT,
  notes TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "WorkoutExercise" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID REFERENCES "Workout"(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES "Exercise"(id) ON DELETE RESTRICT,
  order_index INT NOT NULL,
  tags TEXT[],
  UNIQUE(workout_id, order_index)
);

CREATE TABLE "Set" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_exercise_id UUID REFERENCES "WorkoutExercise"(id) ON DELETE CASCADE,
  set_number INT NOT NULL,
  reps INT NOT NULL,
  weight_kg NUMERIC(6,2),
  rpe NUMERIC(3,1),
  tempo TEXT,
  rest_seconds INT,
  is_warmup BOOLEAN DEFAULT FALSE,
  superset_tag TEXT,
  notes TEXT,
  UNIQUE(workout_exercise_id, set_number)
);

CREATE INDEX idx_set_superset ON "Set"(superset_tag);

CREATE TABLE "PersonalRecord" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES "User"(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES "Exercise"(id) ON DELETE RESTRICT,
  reps INT,
  weight_kg NUMERIC(6,2),
  estimated_1rm NUMERIC(6,2),
  achieved_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, exercise_id, reps)
);

CREATE TABLE "Food" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT,
  serving_size_g NUMERIC(6,2),
  calories INT NOT NULL,
  protein_g NUMERIC(5,2) NOT NULL,
  carbs_g NUMERIC(5,2) NOT NULL,
  fats_g NUMERIC(5,2) NOT NULL,
  fiber_g NUMERIC(5,2),
  barcode TEXT,
  UNIQUE(name, brand)
);

CREATE TABLE "Meal" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES "User"(id) ON DELETE CASCADE,
  logged_at TIMESTAMP NOT NULL DEFAULT NOW(),
  meal_type TEXT CHECK (meal_type IN ('breakfast','lunch','dinner','snack','pre','post')),
  notes TEXT
);

CREATE TABLE "MealItem" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID REFERENCES "Meal"(id) ON DELETE CASCADE,
  food_id UUID REFERENCES "Food"(id) ON DELETE RESTRICT,
  quantity NUMERIC(6,2) NOT NULL,
  unit TEXT DEFAULT 'g',
  calories INT,
  protein_g NUMERIC(5,2),
  carbs_g NUMERIC(5,2),
  fats_g NUMERIC(5,2),
  fiber_g NUMERIC(5,2)
);

CREATE TABLE "AdjustmentLog" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES "User"(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  reason TEXT,
  delta_calories INT,
  new_calorie_target INT,
  notes TEXT
);

CREATE INDEX idx_bodymetric_date ON "BodyMetric"(user_id, date DESC);
CREATE INDEX idx_workout_date ON "Workout"(user_id, date DESC);
CREATE INDEX idx_meal_logged ON "Meal"(user_id, logged_at DESC);
```

### Reglas de integridad
- Borrado en cascada para datos dependientes del usuario (BodyMetric, ProgressPhoto, Workout, Meal, AdjustmentLog) para facilitar GDPR.
- Restricción RESTRICT para Exercise y Food en PersonalRecord y MealItem para evitar borrar catálogos en uso.
- Unicidad en registros diarios (BodyMetric, MacroTarget) para mantener consistencia.

## 5) API (REST) y contratos
### Endpoints clave
- `POST /api/auth/signin` (NextAuth) → gestiona OAuth/email.
- `GET/POST /api/workouts` → listado/creación.
- `GET/PUT/DELETE /api/workouts/{id}` → detalle.
- `POST /api/sets` → crear set asociado.
- `GET /api/exercises` → catálogo.
- `GET/POST /api/nutrition/foods` → búsqueda/creación admin.
- `GET/POST /api/nutrition/meals` → registrar comida.
- `GET/POST /api/metrics` → peso/medidas.
- `POST /api/photos` → registrar metadatos.
- `GET/POST /api/goals` → objetivos y macros.
- `POST /api/adjustments` → registrar cambios automáticos.

### Ejemplos JSON
```json
POST /api/workouts
{
  "date": "2024-06-10",
  "title": "Empuje A",
  "templateType": "push",
  "exercises": [
    {
      "exerciseId": "uuid-press-banca",
      "order": 1,
      "sets": [
        {"reps": 8, "weight": 80, "rpe": 8, "tempo": "2010", "rest": 120}
      ]
    }
  ]
}
```
Respuesta:
```json
201 Created
{
  "id": "uuid-workout",
  "date": "2024-06-10",
  "completed": false
}
```

```json
POST /api/nutrition/meals
{
  "loggedAt": "2024-06-10T08:30:00Z",
  "mealType": "breakfast",
  "items": [
    {"foodId": "uuid-overnight-oats", "quantity": 120, "unit": "g"}
  ]
}
```
Respuesta 201:
```json
{
  "id": "uuid-meal",
  "totals": {"calories": 450, "protein": 25, "carbs": 55, "fats": 12}
}
```

### Validaciones y códigos de estado
- 200/201 para éxito, 400 para datos inválidos (zod schemas), 401 para no autenticado, 403 para sin permisos, 404 recurso no encontrado, 409 conflicto (duplicidad), 500 error interno.
- Validar fechas (no futuras para peso), RPE 1–10, reps/weight ≥0, macros totales coherentes.
- Rate limiting (por IP y usuario) para endpoints críticos.

## 6) Lógica de dominio (explicación y utilidades TS)
### TDEE con Mifflin-St Jeor y macros
- Fórmula: `BMR = (10 * peso_kg) + (6.25 * altura_cm) - (5 * edad) + s`, donde `s = +5` hombres, `-161` mujeres.
- `TDEE = BMR * factor_actividad` (1.2 sedentario, 1.375 ligero, 1.55 moderado, 1.725 intenso, 1.9 muy intenso).
- Reparto macros: proteína 1.6–2.2 g/kg (usar 2.0 por defecto), grasas 0.6–1.0 g/kg (0.8), resto carbohidratos.
- Ajuste calórico según objetivo: déficit −15% (cut), mantenimiento 0%, superávit +10% (bulk), recomposición ±5% según IMC.

### Estimación 1RM
- Epley: `1RM = peso * (1 + reps/30)`.
- Brzycki: `1RM = peso * (36 / (37 - reps))`.
- Usar media cuando reps 1–10; escoger fórmula válida según rango.

### Volumen y PRs
- Volumen por ejercicio: `sum(weight * reps)` (convertir a toneladas).
- PR detectado si `estimated1RM` supera valor anterior o si `weight` para `reps` supera registro previo.

### Plantillas de progresión
- Progresión doble: aumentar reps hasta tope (ej. 8–12), luego subir peso 2.5–5 kg y reset reps mínimas.
- Sobrecarga progresiva: incremento semanal de 2.5% si RPE <8.
- Autorregulación: usar RPE objetivo; si RPE registrado >9, reducir peso 2.5%; si <7, aumentar 2.5%.

### Algoritmo auto-ajuste calorías
- Calcular tendencia de peso 14 días (regresión lineal). Comparar tasa semanal vs objetivo:
  - Si objetivo = cut y tendencia ≥ -0.5%/sem (no pierde lo suficiente) → reducir calorías 5–10% (respetar proteína/grasa mínimas).
  - Si tendencia ≤ -0.5%/sem (pierde demasiado) → aumentar 5–10%.
  - Similar para bulk (usar signo opuesto).
- Registrar en `AdjustmentLog` con motivo y nuevo target.

### Distribución semanal
- Disponibilidad 3 días: full body A/B/C.
- 4 días: upper/lower o empuje/tirón + full body.
- 5–6 días: empuje/tirón/pierna + accesorios (utilizar catálogo). Ajustar volumen por grupo muscular (10–20 series/sem).

### Utilidades TypeScript
```ts
// lib/tdee.ts
export function mifflinStJeor({ weightKg, heightCm, age, sex }: { weightKg: number; heightCm: number; age: number; sex: 'male'|'female'|'other'; }) {
  const s = sex === 'male' ? 5 : sex === 'female' ? -161 : -78;
  return 10 * weightKg + 6.25 * heightCm - 5 * age + s;
}

export function tdeeEstimate(params: { bmr: number; activityFactor: number; goal: 'cut'|'recomp'|'bulk'|'maintain'; imc: number; }) {
  const { bmr, activityFactor, goal, imc } = params;
  const base = bmr * activityFactor;
  const adj = goal === 'cut' ? -0.15 : goal === 'bulk' ? 0.1 : goal === 'recomp' ? (imc > 25 ? -0.05 : 0.05) : 0;
  return Math.round(base * (1 + adj));
}
```

```ts
// lib/macros.ts
export function macroSplit({ calories, weightKg }: { calories: number; weightKg: number; }) {
  const protein = Math.round(weightKg * 2 * 4); // cal de proteína
  const fats = Math.round(weightKg * 0.8 * 9);
  const remaining = Math.max(calories - protein - fats, 0);
  return {
    proteinG: Math.round((protein / 4) * 10) / 10,
    fatsG: Math.round((fats / 9) * 10) / 10,
    carbsG: Math.round((remaining / 4) * 10) / 10
  };
}
```

```ts
// lib/oneRm.ts
export function epley(weight: number, reps: number) {
  return reps === 1 ? weight : weight * (1 + reps / 30);
}

export function brzycki(weight: number, reps: number) {
  return weight * (36 / (37 - reps));
}

export function estimate1RM(weight: number, reps: number) {
  if (reps <= 1) return weight;
  if (reps > 12) return epley(weight, reps);
  return (epley(weight, reps) + brzycki(weight, reps)) / 2;
}
```

```ts
// lib/trend.ts
export function linearTrend(data: { date: Date; value: number }[]) {
  const n = data.length;
  if (n === 0) return { slope: 0, intercept: 0 };
  const meanX = data.reduce((acc, _, i) => acc + i, 0) / n;
  const meanY = data.reduce((acc, p) => acc + p.value, 0) / n;
  let num = 0, den = 0;
  data.forEach((p, idx) => {
    num += (idx - meanX) * (p.value - meanY);
    den += (idx - meanX) ** 2;
  });
  const slope = den === 0 ? 0 : num / den;
  const intercept = meanY - slope * meanX;
  return { slope, intercept };
}

export function weeklyTrendPercent(data: { date: Date; value: number }[]) {
  const { slope } = linearTrend(data);
  const current = data.at(-1)?.value ?? 0;
  return current === 0 ? 0 : (slope * 7) / current;
}
```

## 7) UI/UX
### Sitemap MVP
Onboarding → Dashboard → Entreno → Nutrición → Progreso → Ajustes.

### Wireframes ASCII
Dashboard:
```
+--------------------------------------------------+
| Header (logo, calorías restantes, avatar)        |
|--------------------------------------------------|
| Peso tendencia 14d (chart)   | Calorías anillo   |
|------------------------------|-------------------|
| Próximo entreno (plantilla)                       |
|--------------------------------------------------|
| Ajuste recomendado: -5% calorías                 |
+--------------------------------------------------+
```
Entreno:
```
+-----------------------------+
| Empuje A  (Fecha, tempor.) |
| [RestTimer 90s]             |
| Press banca                |
| Set 1: 8 x 80kg  RPE 8 [Editar]
| Set 2: 8 x 80kg  RPE 9
| + Añadir set (superset tag) |
+-----------------------------+
```
Nutrición:
```
+----------------------------------+
| Buscador [pollo...]              |
| Resultados (gramos, macros)      |
| [Añadir a desayuno]              |
|----------------------------------|
| Comidas de hoy                   |
| 08:30 Desayuno 450 kcal          |
+----------------------------------+
```
Progreso:
```
+------------------------------+
| Peso (14d)   | Medidas       |
|--------------------------------
| Fotos (grid 3 columnas)      |
+------------------------------+
```
Ajustes:
```
+------------------------------+
| Objetivos | Exportar CSV     |
| Preferencias offline         |
+------------------------------+
```

### Componentes (Props/State principales)
- `WorkoutSetRow`: props `{ setNumber, reps, weight, rpe, tempo, restSeconds, supersetTag, onChange }` estado local controlado.
- `RestTimer`: props `{ durationSeconds, onComplete }`, estado interno `remaining` con intervalos.
- `RPESelector`: props `{ value, onSelect }`, lista de botones 1–10 accesibles.
- `MacroRing`: props `{ consumed, target }`, utiliza Recharts PieChart.
- `CalorieProgressBar`: props `{ consumed, target }`.
- `WeightTrendChart`: props `{ data }`.
- `FoodSearch`: props `{ query, onSelect }`, estado `results`, integra React Query.
- `MealComposer`: props `{ mealType, items, onAddItem }`.
- `PhotoGrid`: props `{ photos }`, usa `<figure>` con texto alternativo.

### Accesibilidad y preferencias
- Todos los componentes con etiquetas aria y navegación teclado.
- Modo oscuro mediante clase `dark` y `next-themes`.
- Preparado para i18n (next-intl), con archivos ES/EN.

## 8) Seguridad, privacidad y cumplimiento
- Autenticación con NextAuth (Email Magic Link + Google). Hash de contraseñas con bcrypt cuando se use login tradicional.
- Middleware de rate limiting (Upstash Redis o Ratelimit.js) para endpoints sensibles.
- RBAC: roles `user`, `admin`; `admin` puede crear/editar catálogo de alimentos/ejercicios.
- GDPR: consentimiento en onboarding para tratamiento de datos, política clara. Exportación y borrado de datos desde ajustes. Retención: eliminar cuentas inactivas >24 meses (aviso previo).
- Fotos: en MVP solo metadatos y ruta opcional, sugerencia de almacenamiento local; guías sobre privacidad.
- Datos cifrados en tránsito (HTTPS) y en reposo (PostgreSQL con cifrado gestionado). Backups diarios en proveedor (Neon/Supabase) + exportación semanal S3 cifrada.

## 9) Telemetría ética y analítica local-primero
- Métricas de uso no PII: nº de sesiones registradas, tasa de finalización de onboarding, uso de offline.
- Opt-in explícito, con posibilidad de revocar.
- Almacenamiento local y envío anonimizado a panel interno (Supabase Edge Function) 1 vez/día.
- Panel interno minimalista (tabla + gráficos) accesible solo para admins.

## 10) Código de arranque
### `next.config.js`
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true },
  images: { domains: [] },
  reactStrictMode: true,
  output: 'standalone'
};
module.exports = nextConfig;
```

### `prisma/schema.prisma`
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String?
  name      String?
  sex       String?
  birthDate DateTime?
  heightCm  Float?
  weightKg  Float?
  experienceLevel String?
  availabilityDays Int?
  equipment String[]
  goalType  String?
  dietaryRestrictions String[]
  allergies String[]
  budgetEur Float?
  foodPreferences String[]
  goals     Goal[]
  bodyMetrics BodyMetric[]
  progressPhotos ProgressPhoto[]
  workouts  Workout[]
  meals     Meal[]
  adjustments AdjustmentLog[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Goal {
  id        String   @id @default(uuid())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String
  startDate DateTime
  endDate   DateTime?
  targetWeight Float?
  dailyCalories Int?
  objective String
  notes     String?
  macroTargets MacroTarget[]
}

model MacroTarget {
  id      String   @id @default(uuid())
  goal    Goal     @relation(fields: [goalId], references: [id], onDelete: Cascade)
  goalId  String
  date    DateTime @default(now())
  protein Float
  carbs   Float
  fats    Float
  fiber   Float?
  @@unique([goalId, date])
}

model BodyMetric {
  id      String   @id @default(uuid())
  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId  String
  date    DateTime
  weight  Float?
  waist   Float?
  hips    Float?
  chest   Float?
  notes   String?
  @@unique([userId, date])
}

model ProgressPhoto {
  id      String   @id @default(uuid())
  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId  String
  date    DateTime
  pose    String?
  uri     String
  storageType String?
  createdAt DateTime @default(now())
}

model Exercise {
  id        String   @id @default(uuid())
  name      String   @unique
  equipment String?
  primaryMuscle String?
  secondaryMuscles String[]
  isBodyweight Boolean @default(false)
  defaultTempo String?
  workoutExercises WorkoutExercise[]
  prs       PersonalRecord[]
}

model Workout {
  id        String   @id @default(uuid())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String
  title     String
  date      DateTime
  templateType String?
  notes     String?
  completed Boolean @default(false)
  createdAt DateTime @default(now())
  exercises WorkoutExercise[]
}

model WorkoutExercise {
  id        String   @id @default(uuid())
  workout   Workout  @relation(fields: [workoutId], references: [id], onDelete: Cascade)
  workoutId String
  exercise  Exercise @relation(fields: [exerciseId], references: [id], onDelete: Restrict)
  exerciseId String
  order     Int
  tags      String[]
  sets      Set[]
  @@unique([workoutId, order])
}

model Set {
  id        String   @id @default(uuid())
  workoutExercise WorkoutExercise @relation(fields: [workoutExerciseId], references: [id], onDelete: Cascade)
  workoutExerciseId String
  number    Int
  reps      Int
  weight    Float?
  rpe       Float?
  tempo     String?
  restSeconds Int?
  isWarmup  Boolean @default(false)
  supersetTag String?
  notes     String?
  @@unique([workoutExerciseId, number])
}

model PersonalRecord {
  id        String   @id @default(uuid())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String
  exercise  Exercise @relation(fields: [exerciseId], references: [id], onDelete: Restrict)
  exerciseId String
  reps      Int
  weight    Float
  estimated1RM Float
  achievedAt DateTime @default(now())
  @@unique([userId, exerciseId, reps])
}

model Food {
  id        String   @id @default(uuid())
  name      String
  brand     String?
  servingSize Float?
  calories  Int
  protein   Float
  carbs     Float
  fats      Float
  fiber     Float?
  barcode   String?
  mealItems MealItem[]
  @@unique([name, brand])
}

model Meal {
  id        String   @id @default(uuid())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String
  loggedAt  DateTime @default(now())
  mealType  String
  notes     String?
  items     MealItem[]
}

model MealItem {
  id        String   @id @default(uuid())
  meal      Meal     @relation(fields: [mealId], references: [id], onDelete: Cascade)
  mealId    String
  food      Food     @relation(fields: [foodId], references: [id], onDelete: Restrict)
  foodId    String
  quantity  Float
  unit      String @default("g")
  calories  Int?
  protein   Float?
  carbs     Float?
  fats      Float?
  fiber     Float?
}

model AdjustmentLog {
  id        String   @id @default(uuid())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String
  createdAt DateTime @default(now())
  reason    String?
  deltaCalories Int?
  newCalorieTarget Int?
  notes     String?
}
```

### Scripts de migración
```
npx prisma migrate dev --name init
```

### Componentes base
```tsx
// app/dashboard/page.tsx
import { WeightTrendChart, MacroRing } from '@/components/dashboard';

export default async function DashboardPage() {
  // fetch datos (server component)
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2">
        <WeightTrendChart />
        <MacroRing />
      </section>
      <section>
        <h2 className="text-lg font-semibold">Próximo entreno</h2>
        {/* Placeholder */}
      </section>
    </div>
  );
}
```

```tsx
// app/workout/page.tsx
'use client';
import { useState } from 'react';
import { WorkoutSetRow, RestTimer } from '@/components/workout';

export default function WorkoutPage() {
  const [timer, setTimer] = useState(0);
  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Empuje A</h1>
        <RestTimer durationSeconds={timer} onComplete={() => setTimer(0)} />
      </header>
      <WorkoutSetRow setNumber={1} reps={8} weight={80} rpe={8} restSeconds={120} onChange={() => {}} />
    </div>
  );
}
```

```tsx
// app/nutrition/page.tsx
'use client';
import { FoodSearch, MealComposer } from '@/components/nutrition';

export default function NutritionPage() {
  return (
    <div className="space-y-6">
      <FoodSearch query="" onSelect={() => {}} />
      <MealComposer mealType="breakfast" items={[]} onAddItem={() => {}} />
    </div>
  );
}
```

```tsx
// app/progress/page.tsx
import { WeightTrendChart, PhotoGrid } from '@/components/progress';

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <WeightTrendChart />
      <PhotoGrid photos={[]} />
    </div>
  );
}
```

### Utilidades TS incluidas en sección 6.

### API routes de ejemplo
```ts
// app/api/workouts/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

const workoutSchema = z.object({
  date: z.string(),
  title: z.string(),
  templateType: z.string().optional(),
  exercises: z.array(z.object({
    exerciseId: z.string(),
    order: z.number(),
    sets: z.array(z.object({
      reps: z.number().min(1),
      weight: z.number().min(0),
      rpe: z.number().min(1).max(10),
      tempo: z.string().optional(),
      rest: z.number().optional()
    }))
  }))
});

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const parsed = workoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const workout = await prisma.workout.create({
    data: {
      userId: session.user.id,
      date: parsed.data.date,
      title: parsed.data.title,
      templateType: parsed.data.templateType,
      exercises: {
        create: parsed.data.exercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          order: ex.order,
          sets: {
            create: ex.sets.map((set, idx) => ({
              number: idx + 1,
              reps: set.reps,
              weight: set.weight,
              rpe: set.rpe,
              restSeconds: set.rest
            }))
          }
        }))
      }
    },
    include: { exercises: { include: { sets: true } } }
  });
  return NextResponse.json(workout, { status: 201 });
}
```

```ts
// app/api/nutrition/log/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

const mealSchema = z.object({
  loggedAt: z.string().optional(),
  mealType: z.string(),
  items: z.array(z.object({
    foodId: z.string(),
    quantity: z.number().positive(),
    unit: z.string().default('g')
  }))
});

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const parsed = mealSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const meal = await prisma.meal.create({
    data: {
      userId: session.user.id,
      loggedAt: parsed.data.loggedAt ? new Date(parsed.data.loggedAt) : undefined,
      mealType: parsed.data.mealType,
      items: {
        create: parsed.data.items.map((item) => ({
          foodId: item.foodId,
          quantity: item.quantity,
          unit: item.unit
        }))
      }
    },
    include: { items: true }
  });
  return NextResponse.json(meal, { status: 201 });
}
```

### Tests unitarios (Vitest)
```ts
// tests/tdee.test.ts
import { describe, it, expect } from 'vitest';
import { mifflinStJeor, tdeeEstimate } from '../lib/tdee';

describe('TDEE', () => {
  it('calcula BMR y TDEE', () => {
    const bmr = mifflinStJeor({ weightKg: 80, heightCm: 180, age: 30, sex: 'male' });
    const tdee = tdeeEstimate({ bmr, activityFactor: 1.55, goal: 'recomp', imc: 24.7 });
    expect(Math.round(bmr)).toBeGreaterThan(1700);
    expect(tdee).toBeGreaterThan(2500);
  });
});
```

```ts
// tests/oneRm.test.ts
import { describe, it, expect } from 'vitest';
import { estimate1RM } from '../lib/oneRm';

describe('1RM', () => {
  it('estima 1RM coherente', () => {
    const est = estimate1RM(100, 5);
    expect(est).toBeGreaterThan(100);
  });
});
```

### Test E2E (Playwright)
```ts
// tests/e2e/workout.spec.ts
import { test, expect } from '@playwright/test';

test('login y crear entreno', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'demo@example.com');
  await page.click('button[type="submit"]');
  // asumir magic link simulado
  await page.goto('http://localhost:3000/dashboard');
  await page.click('a[href="/workout"]');
  await page.click('text=Nuevo entreno');
  await page.fill('input[name="title"]', 'Empuje A');
  await page.click('text=Guardar');
  await expect(page.locator('h1', { hasText: 'Empuje A' })).toBeVisible();
});
```

### Seed script
```ts
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const exercises = [
    { name: 'Sentadilla trasera', equipment: 'barra', primaryMuscle: 'cuádriceps' },
    { name: 'Press banca', equipment: 'barra', primaryMuscle: 'pecho' },
    { name: 'Peso muerto convencional', equipment: 'barra', primaryMuscle: 'espalda baja' },
    { name: 'Remo con barra', equipment: 'barra', primaryMuscle: 'espalda media' },
    { name: 'Dominadas', equipment: 'barra dominadas', primaryMuscle: 'espalda' }
  ];
  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: {},
      create: exercise
    });
  }
  const foods = [
    { name: 'Pechuga de pollo', calories: 110, protein: 23, carbs: 0, fats: 1.5 },
    { name: 'Arroz integral cocido', calories: 130, protein: 3, carbs: 28, fats: 1 }
    // añadir hasta 20 alimentos en implementación completa
  ];
  for (const food of foods) {
    await prisma.food.upsert({
      where: { name_brand: { name: food.name, brand: null } },
      update: {},
      create: { ...food, brand: null }
    });
  }
}

main().finally(() => prisma.$disconnect());
```

## 11) Datos de ejemplo para validación
### CSV (entrenos)
```csv
date,title,exercise,reps,weight_kg,rpe
2024-05-27,Empuje A,Press banca,8,80,8
2024-05-27,Empuje A,Press inclinado mancuernas,10,30,8
2024-05-27,Empuje A,Press militar,6,50,9
2024-05-29,Tirón A,Remo con barra,8,70,8
2024-05-29,Tirón A,Dominadas,6,0,9
2024-05-29,Tirón A,Face pull,12,20,7
2024-06-01,Pierna A,Sentadilla trasera,6,110,9
2024-06-01,Pierna A,Peso muerto rumano,8,90,8
2024-06-01,Pierna A,Prensa,12,180,7
```

### JSON (comidas)
```json
[
  {
    "loggedAt": "2024-05-27T08:00:00Z",
    "mealType": "breakfast",
    "items": [
      { "food": "Avena", "quantity": 80, "unit": "g" },
      { "food": "Clara de huevo", "quantity": 200, "unit": "g" }
    ]
  },
  {
    "loggedAt": "2024-05-27T13:30:00Z",
    "mealType": "lunch",
    "items": [
      { "food": "Pechuga de pollo", "quantity": 200, "unit": "g" },
      { "food": "Arroz integral cocido", "quantity": 150, "unit": "g" }
    ]
  }
]
```

### Perfil demo
- Usuario demo: `demo@example.com`, sexo masculino, 30 años, 180 cm, 82 kg, experiencia intermedia, disponibilidad 5 días, equipamiento gimnasio completo, objetivo recomposición.
- Macros calculadas: 2 g/kg proteína → 164 g, grasas 0.8 g/kg → 66 g, calorías objetivo 2600 kcal, resto carbohidratos 279 g.

## 12) Criterios de aceptación
- [ ] Registrar un entrenamiento con 3 ejercicios y ver PR detectado en Press banca.
- [ ] Buscar alimento “Pechuga de pollo” y registrar comida.
- [ ] Visualizar gráfica de peso 14 días con tendencia y recomendación de ajuste calórico.
- [ ] Exportar datos (entrenos y nutrición) a CSV desde Ajustes.
- [ ] Funcionalidad offline: crear set sin conexión y sincronizar al reconectar.

## 13) Riesgos y mitigaciones
- **Adherencia de registro:** introducir recordatorios push/email, UX rápida (autocompletado, plantillas).
- **Calidad de datos:** validaciones de entrada, sugerencias de RPE, plantillas con tempos y descansos.
- **Latencia móvil:** cache optimista con React Query, sincronización diferida.
- **Privacidad fotos:** almacenamiento opcional, cifrado, mensajes claros.

## 14) Plan de publicación
- Ejecución local: `npm install`, `npm run dev`. Variables: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, credenciales OAuth Google.
- Migraciones: `npx prisma migrate dev` + `npx prisma db seed`.
- Despliegue: Vercel (frontend/API) + PostgreSQL gestionado (Neon/Supabase). Configurar Edge Functions opcionales.
- Versionado: etiqueta `v0.1.0` tras completar MVP, habilitar feedback in-app (modal) y canal Slack/Discord.
- Feedback loop: encuesta semanal in-app + sesión de usuario cada sprint.

## Siguientes pasos en 1 día
1. Definir datos pendientes del usuario (presupuesto, preferencias alimentarias).
2. Configurar repositorio Next.js con Prisma y NextAuth.
3. Preparar migración inicial y seed de ejercicios/alimentos.
4. Implementar utilidades de cálculo (tdee, macros, 1RM, trend) con tests Vitest.
5. Diseñar componentes base con Tailwind + shadcn/ui (estados vacíos incluidos).
