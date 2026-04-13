import { createContext, useContext } from 'react'

const AdminThemeContext = createContext({
  resolvedTheme: 'light',
  themePreference: 'system',
  systemTheme: 'light',
})

export function AdminThemeProvider({ children, value }) {
  return (
    <AdminThemeContext.Provider value={value}>
      {children}
    </AdminThemeContext.Provider>
  )
}

export function useAdminThemeContext() {
  return useContext(AdminThemeContext)
}
