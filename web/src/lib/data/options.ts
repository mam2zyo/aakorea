export const SEARCH_PROVINCE_OPTIONS = [
  { value: 'all', label: '전국' },
  { value: 'gangwon', label: '강원' },
  { value: 'gyeonggi', label: '경기' },
  { value: 'gwangju,jeonnam,jeonbuk', label: '광주·전남·전북' },
  { value: 'daegu,gyeongbuk', label: '대구·경북' },
  { value: 'daejeon,sejong,chungnam,chungbuk', label: '대전·세종·충남·충북' },
  { value: 'busan,ulsan,gyeongnam', label: '부산·울산·경남' },
  { value: 'seoul', label: '서울' },
  { value: 'incheon', label: '인천' },
  { value: 'jeju', label: '제주' }
];

export const DAY_OF_WEEK_OPTIONS = [
  { value: 'MONDAY', label: '월요일' },
  { value: 'TUESDAY', label: '화요일' },
  { value: 'WEDNESDAY', label: '수요일' },
  { value: 'THURSDAY', label: '목요일' },
  { value: 'FRIDAY', label: '금요일' },
  { value: 'SATURDAY', label: '토요일' },
  { value: 'SUNDAY', label: '일요일' }
];

export const SEARCH_DAY_OF_WEEK_OPTIONS = [
  { value: 'ALL', label: '요일 전체' },
  ...DAY_OF_WEEK_OPTIONS
];

export const MEETING_TYPE_OPTIONS = [
  { value: 'OPEN', label: '공개' },
  { value: 'CLOSED', label: '비공개' },
  { value: 'NOTFIXED', label: '가변' }
];

export const SEARCH_MEETING_TYPE_OPTIONS = [
  { value: 'ALL', label: '유형 전체' },
  ...MEETING_TYPE_OPTIONS
];
