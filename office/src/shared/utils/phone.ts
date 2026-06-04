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
  const digits = value.replace(/\D/g, '');
  
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  } else if (digits.length <= 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  
  return digits.slice(0, 11).replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
}
