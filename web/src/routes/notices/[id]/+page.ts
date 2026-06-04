import { publicContentApi } from '$lib/api/publicContent';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
  try {
    const notice = await publicContentApi.getNotice(params.id, { fetcher: fetch });
    if (!notice) {
      throw error(404, '공지사항을 찾을 수 없습니다.');
    }
    return {
      notice
    };
  } catch (e) {
    console.error('Failed to load notice', e);
    throw error(404, '공지사항을 불러오는 중 오류가 발생했습니다.');
  }
};
