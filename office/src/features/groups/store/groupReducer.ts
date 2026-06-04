import type { Dispatch } from 'react';
import type { EditorState, CreateForm, Group, District } from '../types';
import { createClosedEditor, createEmptyCreateForm } from '../utils';

// ── 액션 타입 ──────────────────────────────────────────────

export const GROUP_MGMT_ACTION = {
  SET_LOADING: 'SET_LOADING',
  SET_SAVING: 'SET_SAVING',
  SET_DELETING: 'SET_DELETING',
  LOAD_INDEX_SUCCESS: 'LOAD_INDEX_SUCCESS',
  UPDATE_SEARCH_QUERY: 'UPDATE_SEARCH_QUERY',
  TOGGLE_SORT_MODE: 'TOGGLE_SORT_MODE',
  START_CREATING: 'START_CREATING',
  START_EDITING: 'START_EDITING',
  CLOSE_EDITOR: 'CLOSE_EDITOR',
  UPDATE_CREATE_FORM: 'UPDATE_CREATE_FORM',
  SET_CREATE_ERRORS: 'SET_CREATE_ERRORS',
  SET_CREATE_STEP: 'SET_CREATE_STEP',
  RESET_POSTAL_INFO: 'RESET_POSTAL_INFO',
  SET_DISTRICT_FILTER: 'SET_DISTRICT_FILTER',
} as const;

// 타입 재수출
export type { EditorState, CreateForm };

// ── 상태 타입 ──────────────────────────────────────────────

export interface GroupManagementState {
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  districts: District[];
  groups: Group[];
  searchQuery: string;
  sortMode: 'name-asc' | 'name-desc';
  createForm: CreateForm;
  createErrors: Record<string, string>;
  createStep: number;
  districtFilter: number | null;
  editor: EditorState;
}

export type GroupMgmtAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_DELETING'; payload: boolean }
  | { type: 'LOAD_INDEX_SUCCESS'; payload: { districts: District[]; groups: Group[] } }
  | { type: 'UPDATE_SEARCH_QUERY'; payload: string }
  | { type: 'TOGGLE_SORT_MODE' }
  | { type: 'START_CREATING' }
  | { type: 'START_EDITING'; payload: { groupId: number; source?: 'manual' | 'route' } }
  | { type: 'CLOSE_EDITOR' }
  | { type: 'UPDATE_CREATE_FORM'; payload: Partial<CreateForm> }
  | { type: 'SET_CREATE_ERRORS'; payload: Record<string, string> }
  | { type: 'SET_CREATE_STEP'; payload: number }
  | { type: 'RESET_POSTAL_INFO' }
  | { type: 'SET_DISTRICT_FILTER'; payload: number | null };

export type GroupMgmtDispatch = Dispatch<GroupMgmtAction>;

// ── 초기 상태 ──────────────────────────────────────────────

export const initialState: GroupManagementState = {
  loading: false,
  saving: false,
  deleting: false,
  districts: [],
  groups: [],
  searchQuery: '',
  sortMode: 'name-asc',
  createForm: createEmptyCreateForm(),
  createErrors: {},
  createStep: 1,
  districtFilter: null,
  editor: createClosedEditor(),
};

// ── 리듀서 ────────────────────────────────────────────────

export function groupManagementReducer(
  state: GroupManagementState,
  action: GroupMgmtAction,
): GroupManagementState {
  switch (action.type) {
    case GROUP_MGMT_ACTION.SET_LOADING:
      return { ...state, loading: action.payload };
    case GROUP_MGMT_ACTION.SET_SAVING:
      return { ...state, saving: action.payload };
    case GROUP_MGMT_ACTION.SET_DELETING:
      return { ...state, deleting: action.payload };
    case GROUP_MGMT_ACTION.LOAD_INDEX_SUCCESS:
      return {
        ...state,
        districts: action.payload.districts,
        groups: action.payload.groups,
        loading: false,
      };
    case GROUP_MGMT_ACTION.UPDATE_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    case GROUP_MGMT_ACTION.TOGGLE_SORT_MODE:
      return {
        ...state,
        sortMode: state.sortMode === 'name-asc' ? 'name-desc' : 'name-asc',
      };
    case GROUP_MGMT_ACTION.START_CREATING:
      return {
        ...state,
        createForm: createEmptyCreateForm(),
        createErrors: {},
        createStep: 1,
        editor: { open: true, source: 'manual', groupId: null },
      };
    case GROUP_MGMT_ACTION.START_EDITING: {
      const { groupId, source = 'manual' } = action.payload;
      return {
        ...state,
        editor: { open: true, source, groupId },
      };
    }
    case GROUP_MGMT_ACTION.CLOSE_EDITOR:
      return {
        ...state,
        editor: createClosedEditor(),
        createForm: createEmptyCreateForm(),
        createErrors: {},
        createStep: 1,
      };
    case GROUP_MGMT_ACTION.UPDATE_CREATE_FORM:
      return {
        ...state,
        createForm: { ...state.createForm, ...action.payload },
      };
    case GROUP_MGMT_ACTION.SET_CREATE_ERRORS:
      return { ...state, createErrors: action.payload };
    case GROUP_MGMT_ACTION.SET_CREATE_STEP:
      return { ...state, createStep: action.payload };
    case GROUP_MGMT_ACTION.RESET_POSTAL_INFO:
      return {
        ...state,
        createForm: {
          ...state.createForm,
          postalRecipient: '',
          postalCode: '',
          postalRoadAddress: '',
          postalDetailAddress: '',
        },
      };
    case GROUP_MGMT_ACTION.SET_DISTRICT_FILTER:
      return { ...state, districtFilter: action.payload };
    default:
      return state;
  }
}
