import { publicContentApi } from '$lib/api/publicContent';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const notices = await publicContentApi.getNotices({ fetcher: fetch });

  return {
    notices
  };
};
