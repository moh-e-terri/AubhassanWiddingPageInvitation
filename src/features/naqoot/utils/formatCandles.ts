export function formatCandles(amount: number) {
  if (amount === 1) return '1 شمعة';
  if (amount === 2) return '2 شمعتان';
  if (amount >= 3 && amount <= 10) return `${amount} شموع`;
  return `${amount} شمعة`;
}
