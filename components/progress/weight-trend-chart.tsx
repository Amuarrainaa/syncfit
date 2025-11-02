'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface WeightPoint {
  date: string;
  weight: number;
  trend: number;
}

export function WeightTrendChart({ data }: { data: WeightPoint[] }) {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), 'd MMM', { locale: es })} fontSize={12} />
          <YAxis domain={['auto', 'auto']} tickFormatter={(value) => `${value.toFixed(1)} kg`} fontSize={12} />
          <Tooltip labelFormatter={(value) => format(new Date(value), 'dd/MM', { locale: es })} formatter={(value: number) => `${value.toFixed(1)} kg`} />
          <Line type="monotone" dataKey="weight" stroke="#6A5ACD" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="trend" stroke="#38BDF8" strokeDasharray="4 3" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
