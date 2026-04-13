import { useLocation } from '@/shared/app/useLocation'
import { parsePublicRoute } from './routes'

export { navigate } from '@/shared/app/useLocation'

export function useAppRoute() {
  const location = useLocation()
  return parsePublicRoute(location.pathname, location.search)
}
