import { publicContentApi } from '$lib/api/publicContent';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const notices = await publicContentApi.getNotices({ fetcher: fetch });
    
    return {
      latestNotices: Array.isArray(notices) ? notices.slice(0, 3) : []
    };
  } catch (e) {
    console.error('Failed to load notices for homepage', e);
    return {
      latestNotices: []
    };
  }
};
