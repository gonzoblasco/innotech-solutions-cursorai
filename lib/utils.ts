// Utilidad para concatenar clases condicionalmente (como clsx)
export function cn(...args: any[]): string {
  return args
    .flat(Infinity)
    .filter(Boolean)
    .join(' ');
} 