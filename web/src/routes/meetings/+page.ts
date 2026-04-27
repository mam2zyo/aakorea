import { publicContentApi } from '$lib/api/publicContent';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const districts = await publicContentApi.getDistricts({ fetcher: fetch });

  return {
    districts: districts || []
  };
};
