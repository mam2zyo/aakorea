export function formatKoreanPhoneNumber(value: string): string {
  if (!value) return '';
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2,3})(\d{3,4})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return value;
}

export function normalizePhoneFieldValue(value: string): string {
  if (!value) return '';
  return value.replace(/\D/g, '');
}
