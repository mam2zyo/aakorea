import apiClient from './request';
import { OfficeAuthApi } from './auth';
import { OfficeUserApi } from './users';
import { OfficeGroupApi } from './groups';
import { OfficeContentApi } from './content';
import { OfficeDistrictApi } from './districts';
import { OfficeAssetApi } from './assets';
import { OfficeAttachmentApi } from './attachments';
import { OfficeMeetingApi } from './meetings';
import { OfficeGroupContactApi } from './groupContacts';

// 인스턴스 생성 및 내보내기
export const authApi = new OfficeAuthApi(apiClient);
export const userApi = new OfficeUserApi(apiClient);
export const groupApi = new OfficeGroupApi(apiClient);
export const contentApi = new OfficeContentApi(apiClient);
export const districtApi = new OfficeDistrictApi(apiClient);
export const assetApi = new OfficeAssetApi(apiClient);
export const attachmentApi = new OfficeAttachmentApi(apiClient);
export const meetingApi = new OfficeMeetingApi(apiClient);
export const groupContactApi = new OfficeGroupContactApi(apiClient);

// 공통 유틸리티 및 헬퍼 내보내기
export { getApiFieldErrors, omitFieldErrors, readFieldError } from './formErrors';
export { request } from './request';
export type { ApiError } from './types';
