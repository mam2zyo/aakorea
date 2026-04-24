// 공유 타입 — groupReducer와 utils 간의 순환 참조를 방지하기 위해 별도 파일에 정의

export interface EditorState {
  open: boolean;
  source: 'manual' | 'route' | 'local';
  groupId: number | null;
}

export interface CreateForm {
  phone: string;
  email: string;
  districtId: string;
  postalDetailAddress: string;
  postalCode: string;
  postalRecipient: string;
  postalRoadAddress: string;
  name: string;
  meetings: any[];
}
