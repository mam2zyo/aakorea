// 공유 타입 — groupReducer와 utils 간의 순환 참조를 방지하기 위해 별도 파일에 정의

export interface EditorState {
  open: boolean;
  source: 'manual' | 'route' | 'local';
  groupId: number | null;
}

export interface Group {
  id: number;
  districtId: number;
  name: string;
  notice?: string;
}

export interface District {
  id: number;
  name: string;
}

export interface Meeting {
  id: number;
  groupId: number;
  locationDetail: string;
  locationAddress: string;
  contactPhoneOverride: string;
  dayOfWeek: string;
  startTime: string;
  type: string;
  active: boolean;
}

export interface GroupContact {
  id: number;
  groupId: number;
  phone: string;
  email: string;
  postalContact?: {
    recipient?: string;
    postalCode?: string;
    roadAddress?: string;
    detailAddress?: string;
  };
}

export interface PostalContactForm {
  postalRecipient: string;
  postalCode: string;
  postalRoadAddress: string;
  postalDetailAddress: string;
}

export interface CreateForm extends PostalContactForm {
  phone: string;
  email: string;
  districtId: string;
  name: string;
  meetings: Meeting[];
}
