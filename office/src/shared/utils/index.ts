export function syncSelectionWithList<T>(
  previous: any,
  key: string,
  items: T[] | null | undefined
): any {
  if (!items || items.length === 0) return previous;

  const currentSelection = previous[key];
  const exists = items.some((item: any) => 
    (item.id || item.value) === currentSelection
  );

  if (exists) return previous;

  const firstItem: any = items[0];
  return {
    ...previous,
    [key]: firstItem.id || firstItem.value,
  };
}

export function lookupLabel(options: { value: any, label: string }[], value: any) {
  return options?.find(o => o.value === value)?.label || value;
}

export function formatDate(dateStr: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('ko-KR');
}
