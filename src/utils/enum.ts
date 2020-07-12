export function values<T>(e: { [s: string]: T }): T[] {
  const values = Object.values(e);
  return values.slice(values.length / 2);
}
