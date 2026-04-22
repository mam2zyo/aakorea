import {
  createClosedEditor,
  createEmptyCreateForm,
} from './utils'

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
}

export const initialState = {
  loading: false,
  saving: false,
  deleting: false,
  districts: [],
  groups: [],
  searchQuery: '',
  sortMode: 'district',
  createForm: createEmptyCreateForm(),
  createErrors: {},
  createStep: 1,
  editor: createClosedEditor(),
}

export function groupManagementReducer(state, action) {
  switch (action.type) {
    case GROUP_MGMT_ACTION.SET_LOADING:
      return { ...state, loading: action.payload }
    case GROUP_MGMT_ACTION.SET_SAVING:
      return { ...state, saving: action.payload }
    case GROUP_MGMT_ACTION.SET_DELETING:
      return { ...state, deleting: action.payload }
    case GROUP_MGMT_ACTION.LOAD_INDEX_SUCCESS:
      return {
        ...state,
        districts: action.payload.districts,
        groups: action.payload.groups,
        loading: false,
      }
    case GROUP_MGMT_ACTION.UPDATE_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload }
    case GROUP_MGMT_ACTION.TOGGLE_SORT_MODE:
      return {
        ...state,
        sortMode: state.sortMode === 'district' ? 'name' : 'district',
      }
    case GROUP_MGMT_ACTION.START_CREATING:
      return {
        ...state,
        createForm: createEmptyCreateForm(),
        createErrors: {},
        createStep: 1,
        editor: { open: true, source: 'manual', groupId: null },
      }
    case GROUP_MGMT_ACTION.START_EDITING:
      const { groupId, source = 'manual' } = typeof action.payload === 'object' 
        ? action.payload 
        : { groupId: action.payload }
      return {
        ...state,
        editor: { open: true, source, groupId },
      }
    case GROUP_MGMT_ACTION.CLOSE_EDITOR:
      return {
        ...state,
        editor: createClosedEditor(),
        createForm: createEmptyCreateForm(),
        createErrors: {},
        createStep: 1,
      }
    case GROUP_MGMT_ACTION.UPDATE_CREATE_FORM:
      return {
        ...state,
        createForm: { ...state.createForm, ...action.payload },
      }
    case GROUP_MGMT_ACTION.SET_CREATE_ERRORS:
      return { ...state, createErrors: action.payload }
    case GROUP_MGMT_ACTION.SET_CREATE_STEP:
      return { ...state, createStep: action.payload }
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
      }
    default:
      return state
  }
}
