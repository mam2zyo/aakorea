import { request, type RequestOptions } from './client';
import type { components } from './api';

export type Notice = components['schemas']['PublicNoticeData'];
export type ContentPage = components['schemas']['PublicContentPageData'];
export type District = components['schemas']['PublicDistrictResponse'];
export type Meeting = components['schemas']['MeetingSummary'];
export type GroupDetail = components['schemas']['GroupDetail'];
export type GroupMeeting = components['schemas']['GroupMeeting'];

export interface MeetingFilters {
  province?: string;
  districtId?: string | number;
  dayOfWeek?: string;
  type?: string;
  keyword?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
}

export const publicContentApi = {
  getNotices(options?: RequestOptions) {
    return request<components['schemas']['PublicNoticeSummary'][]>('/api/public/notices', options);
  },

  getNotice(id: string | number, options?: RequestOptions) {
    return request<Notice>(`/api/public/notices/${id}`, options);
  },

  getContentPage(key: string, options?: RequestOptions) {
    return request<ContentPage>(`/api/public/content-pages/${encodeURIComponent(key)}`, options);
  },

  getMeetings(filters: MeetingFilters = {}, options?: RequestOptions) {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === '') return;

      if (key === 'province') {
        const provinceValues = value.toString().split(',');
        provinceValues.forEach((v: string) => query.append(key, v.trim()));
      } else if (value !== 'ALL') {
        query.append(key, value.toString());
      }
    });

    const path = `/api/public/meetings${query.toString() ? '?' + query.toString() : ''}`;
    return request<Meeting[]>(path, options);
  },

  getDistricts(options?: RequestOptions) {
    return request<District[]>('/api/public/districts', options);
  },

  getGroup(id: string | number, options?: RequestOptions) {
    return request<GroupDetail>(`/api/public/groups/${id}`, options);
  }
};
