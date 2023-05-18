export function pick<T>(obj: any, picks: (string | number)[]): T {
  const picked: Record<string, unknown> = {};
  picks.forEach((pick) => {
    picked[pick] = obj[pick];
  });
  return picked as T;
}

// Object.keys but returns (keyof T)[] instead of string[]
 
export const ObjectKeys = Object.keys as <T>(
  o: T
) => Extract<keyof T, string | number>[];

// Object.entries but returns [keyof T, Value][] instead of [string, Value][]
export const ObjectEntries = Object.entries as <
  T extends
    | {
        [s: string]: unknown;
      }
    | ArrayLike<T>
>(
  o: T
) => [Extract<keyof T, string | number>, T[keyof T]][];

// Object.values
export const ObjectValues = Object.values