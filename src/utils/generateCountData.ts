type CountResult<T> = { name: T; count: number };

export function generateCountData<T extends string | number>(
  data: Record<string, T[]>
): Record<string, CountResult<T>[]> {
  const result: Record<string, CountResult<T>[]> = {};
  for (const key of Object.keys(data)) {
    const arr = data[key];
    const map = new Map<T, number>();
    for (let i = 0, len = arr.length; i < len; i++) {
      const item = arr[i];
      map.set(item, (map.get(item) || 0) + 1);
    }
    const output: CountResult<T>[] = [];
    map.forEach((count, name) => output.push({ name, count }));
    result[key] = output;
  }
  return result;
}