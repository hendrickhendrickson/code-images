export function forceArray<T>(t: T | T[] | undefined | null): T[] {
  return t ? (Array.isArray(t) ? t : [t]) : [];
}
