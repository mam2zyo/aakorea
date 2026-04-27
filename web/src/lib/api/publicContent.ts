import { request, type RequestOptions } from './client';

export interface Notice {
  id: number;
  title: string;
  content: string;
  important: boolean;
  viewCount: number;
  createdAt: string;
}

export interface ContentPage {
  key: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface District {
  id: number;
  name: string;
}

export interface Meeting {
  id: number;
  groupId: number;
  groupName: string;
  province: string;
  dayOfWeek: string;
  startTime: string;
  type: 'OPEN' | 'CLOSED' | 'NOTFIXED';
  locationDetail: string;
  locationAddress: string;
  latitude: number;
  longitude: number;
  districtId: number;
  distanceKm?: number;
}

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

export interface GroupMeeting {
  id: number;
  contactPhone: string;
  province: string;
  dayOfWeek: string;
  startTime: string;
  type: 'OPEN' | 'CLOSED' | 'NOTFIXED';
  locationDetail: string;
  locationAddress: string;
  latitude: number;
  longitude: number;
}

export interface GroupDetail {
  id: number;
  name: string;
  district: District;
  contactPhone: string;
  notice: string;
  meetings: GroupMeeting[];
}

export const publicContentApi = {
  getNotices(options?: RequestOptions) {
    return request<Notice[]>('/api/public/notices', options);
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
