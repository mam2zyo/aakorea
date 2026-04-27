/**
 * 요일 문자열을 한국어 요일로 변환합니다.
 */
export function formatDay(day: string): string {
  const days: Record<string, string> = {
    MONDAY: '월요일',
    TUESDAY: '화요일',
    WEDNESDAY: '수요일',
    THURSDAY: '목요일',
    FRIDAY: '금요일',
    SATURDAY: '토요일',
    SUNDAY: '일요일'
  };
  return days[day] || day;
}

/**
 * 모임 유형 문자열을 한국어 설명으로 변환합니다.
 */
export function formatType(type: string): string {
  const types: Record<string, string> = {
    OPEN: '공개',
    CLOSED: '비공개',
    NOTFIXED: '가변'
  };
  return types[type] || type;
}
