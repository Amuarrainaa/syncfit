'use client';

interface Props {
  value: number;
  onChange: (value: number) => void;
}

const options = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

export function RPESelector({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-500">RPE</span>
      <div className="flex items-center gap-1">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`rounded-md px-2 py-1 text-xs font-semibold transition ${
              value === option ? 'bg-brand text-white shadow-sm' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
