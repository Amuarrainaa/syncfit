'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  initialSeconds?: number;
}

export function RestTimer({ initialSeconds = 120 }: Props) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const toggle = () => setRunning((value) => !value);
  const reset = () => {
    setRunning(false);
    setSeconds(initialSeconds);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="text-4xl font-mono tabular-nums">{formatTime(seconds)}</span>
      <div className="flex gap-2">
        <Button size="sm" onClick={toggle}>
          {running ? 'Pausar' : 'Iniciar'}
        </Button>
        <Button size="sm" variant="outline" onClick={reset}>
          Reiniciar
        </Button>
      </div>
    </div>
  );
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${secs}`;
}
