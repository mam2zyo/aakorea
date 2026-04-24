import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';

// 백엔드 공통 에러 구조 정의
export interface ApiErrorDetail {
  code: string | null;
  message: string;
  fields: Record<string, string> | null;
}

export interface ApiResponse<T = any> {
  data: T;
  error?: ApiErrorDetail;
}

// 기존 ApiError 클래스 유지 (호환성)
export class ApiError extends Error {
  code: string | null;
  fields: Record<string, string> | null;
  status: number;

  constructor(message: string, { code = null, fields = null, status = 500 }: Partial<ApiErrorDetail> & { status?: number } = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.fields = fields;
    this.status = status;
  }
}

// Axios 인스턴스 생성
const client = axios.create({
  // Vite Proxy 설정을 활용하기 위해 baseURL은 비워두거나 /api로 설정 가능합니다.
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// 응답 인터셉터: 에러 처리 및 데이터 언래핑
client.interceptors.response.use(
  (response: AxiosResponse) => {
    // 백엔드 응답 구조가 { data: ... } 형태인 경우 언래핑
    return response.data.data !== undefined ? response.data.data : response.data;
  },
  (error: AxiosError<ApiResponse>) => {
    const status = error.response?.status ?? 500;
    const errorDetail = error.response?.data?.error;

    throw new ApiError(errorDetail?.message ?? error.message, {
      code: errorDetail?.code ?? null,
      fields: errorDetail?.fields ?? null,
      status,
    });
  }
);

export default client;

/**
 * 기존 request 함수와의 호환성을 위한 래퍼
 */
export async function request(path: string, options: any = {}) {
  const { method = 'GET', body, headers } = options;
  
  const response = await client.request({
    url: path,
    method,
    data: body,
    headers,
  });

  return response;
}
