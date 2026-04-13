import { useLocation } from '@/shared/app/useLocation'
import { parseAdminRoute } from './routes'

export { navigate } from '@/shared/app/useLocation'
export {
  buildAdminLoginPath,
  buildAdminRegisterPath,
  DEFAULT_ADMIN_PATH,
  requiresAdminSession,
  sanitizeAdminRedirect,
} from './routes'

export function useAppRoute() {
  const location = useLocation()
  return parseAdminRoute(location.pathname, location.search)
}
