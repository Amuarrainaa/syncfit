'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface MacroRingProps {
  values: {
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
  };
  consumed: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

const COLORS = ['#6A5ACD', '#38BDF8', '#F59E0B'];

export function MacroRing({ values, consumed }: MacroRingProps) {
  const data = [
    { name: 'Proteínas', value: Math.min(consumed.protein / values.proteinGrams, 1) * 100 },
    { name: 'Carbohidratos', value: Math.min(consumed.carbs / values.carbsGrams, 1) * 100 },
    { name: 'Grasas', value: Math.min(consumed.fat / values.fatGrams, 1) * 100 }
  ];

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
        {`P ${consumed.protein}/${values.proteinGrams}g • C ${consumed.carbs}/${values.carbsGrams}g • G ${consumed.fat}/${values.fatGrams}g`}
      </div>
    </div>
  );
}
