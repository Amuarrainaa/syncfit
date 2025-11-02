export function linearRegressionTrend(values: { date: Date; value: number }[]) {
  if (values.length === 0) {
    return { slope: 0, intercept: 0 };
  }
  const n = values.length;
  const xs = values.map((_, index) => index + 1);
  const ys = values.map((point) => point.value);
  const sumX = xs.reduce((acc, x) => acc + x, 0);
  const sumY = ys.reduce((acc, y) => acc + y, 0);
  const sumXY = xs.reduce((acc, x, index) => acc + x * ys[index]!, 0);
  const sumX2 = xs.reduce((acc, x) => acc + x * x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

export function projectedValue({ slope, intercept }: { slope: number; intercept: number }, index: number) {
  return intercept + slope * index;
}

export function percentageChange(values: { date: Date; value: number }[]) {
  if (values.length < 2) return 0;
  const first = values[0]!.value;
  const last = values[values.length - 1]!.value;
  if (first === 0) return 0;
  return (last - first) / first;
}
