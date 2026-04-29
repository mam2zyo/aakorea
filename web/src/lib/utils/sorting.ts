import type { Meeting } from '$lib/api/publicContent';

export enum SearchMode {
  REGION = 'region',
  NEARBY = 'nearby'
}

const DAY_ORDER: Record<string, number> = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7
};

export function sortMeetings(meetings: Meeting[], searchMode: SearchMode = SearchMode.REGION): Meeting[] {
  if (searchMode === SearchMode.NEARBY) {
    return [...meetings].sort((a, b) => {
      // 1. Distance (ASC)
      const distA = a.distanceKm ?? Infinity;
      const distB = b.distanceKm ?? Infinity;
      if (distA !== distB) return distA - distB;

      // 2. DayOfWeek (MONDAY -> SUNDAY)
      const dayA = (a.dayOfWeek ? DAY_ORDER[a.dayOfWeek] : 0) || 0;
      const dayB = (b.dayOfWeek ? DAY_ORDER[b.dayOfWeek] : 0) || 0;
      if (dayA !== dayB) return dayA - dayB;

      // 3. StartTime (ASC)
      if (a.startTime !== b.startTime) {
        return (a.startTime || '').localeCompare(b.startTime || '');
      }

      // 4. ID (ASC)
      return (a.id || 0) - (b.id || 0);
    });
  }

  return [...meetings].sort((a, b) => {
    // 1. DayOfWeek
    const dayA = (a.dayOfWeek ? DAY_ORDER[a.dayOfWeek] : 0) || 0;
    const dayB = (b.dayOfWeek ? DAY_ORDER[b.dayOfWeek] : 0) || 0;
    if (dayA !== dayB) return dayA - dayB;

    // 2. StartTime
    if (a.startTime !== b.startTime) {
      return (a.startTime || '').localeCompare(b.startTime || '');
    }

    // 3. ID
    return (a.id || 0) - (b.id || 0);
  });
}
