// utils/format.ts
// export function formatCurrency(amount: number) {
//   return new Intl.NumberFormat('id-ID', {
//     style: 'currency',
//     currency: 'IDR'
//   }).format(amount);
// }
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2
  }).format(amount);
}