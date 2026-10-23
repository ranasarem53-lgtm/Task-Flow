import type { ReactNode } from 'react'
import { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../features/auth/auth-context'
import { APP_CONSTANTS } from '../../shared/constants/app'
import Button from '../ui/button/button'

type AppLayoutProps = {
  children: ReactNode
}

const NAV_ITEMS = [
  { to: APP_CONSTANTS.ROUTES.DASHBOARD, label: 'Dashboard' },
  { to: APP_CONSTANTS.ROUTES.TASKS, label: 'Tasks' },
]

export function AppLayout({ children }: AppLayoutProps) {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('AppLayout must be used within AuthProvider')
  }
  const { user, logout } = context
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    logout()
    setIsLoggingOut(false)
  }

  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-start">
          <button
            type="button"
            className="app-sidebar-toggle button button-ghost button-md"
            aria-label="Toggle navigation"
            aria-expanded={isSidebarOpen}
            onClick={() => setIsSidebarOpen((open) => !open)}
          >
            ☰
          </button>
          <span className="app-header-brand">TaskFlow</span>
        </div>
        <nav className="app-topnav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `app-nav-link${isActive ? ' app-nav-link-active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="app-header-actions">
          {user ? (
            <>
              <span className="app-header-username">{user.name}</span>
              <Button onClick={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </>
          ) : null}
        </div>
      </header>

      <div className="app-body">
        <aside
          className={`app-sidebar${isSidebarOpen ? ' app-sidebar-open' : ''}`}
          aria-hidden={!isSidebarOpen}
        >
          <nav className="app-sidebar-nav" aria-label="Sidebar navigation">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `app-nav-link${isActive ? ' app-nav-link-active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="app-main" onClick={closeSidebar}>{children}</main>
      </div>
    </div>
  )
}

export default AppLayout