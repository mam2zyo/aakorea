export function syncSelectionWithList<T extends Record<string, unknown>, K extends keyof T>(
  previous: T,
  key: K,
  items: (Record<string, unknown> & { id?: unknown, value?: unknown })[] | null | undefined
): T {
  if (!items || items.length === 0) return previous;

  const currentSelection = previous[key];
  const exists = items.some((item) => 
    (item.id || item.value) === currentSelection
  );

  if (exists) return previous;

  const firstItem = items[0];
  return {
    ...previous,
    [key]: firstItem.id || firstItem.value,
  };
}

export function lookupLabel(options: { value: unknown, label: string }[], value: unknown) {
  return options?.find(o => o.value === value)?.label || String(value);
}

export function formatDate(dateStr: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('ko-KR');
}
