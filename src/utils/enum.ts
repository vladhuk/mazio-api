export function ordinals<T>(e: { [s: string]: T }): T[] {
  const values = Object.values(e);
  return values.slice(values.length / 2);
}

export function names<T>(e: { [s: string]: T }): T[] {
  const values = Object.values(e);
  return values.slice(0, values.length / 2);
}
