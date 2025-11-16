import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ArrowRightLeft, Compass, FileText, Plane, Settings, Gift, ShoppingBag, Receipt, History, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

function Sidebar() {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { resolvedTheme } = useTheme()

  const menuItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/app/move-crypto', label: 'Move crypto', icon: ArrowRightLeft },
    { path: '/app/discover', label: 'Discover', icon: Compass },
    { path: '/app/marketplace', label: 'Marketplace', icon: ShoppingBag },
    { path: '/app/utility-payments', label: 'Utility Payments', icon: Receipt },
    { path: '/app/rewards', label: 'Rewards', icon: Gift },
    { path: '/app/transactions', label: 'Transaction History', icon: History },
    { path: '/app/tax-hub', label: 'Tax Hub', icon: FileText },
    { path: '/app/travel', label: 'Travel', icon: Plane, badge: 'Pilot' },
    { path: '/app/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} border-r border-white/[0.05] flex flex-col transition-all duration-300 relative`}>
      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-white/[0.02] border border-white/[0.05] rounded-full flex items-center justify-center hover:bg-white/[0.04] transition-colors z-10"
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="text-gray-400" size={16} />
        ) : (
          <ChevronLeft className="text-gray-400" size={16} />
        )}
      </button>

      {/* Logo */}
      <div className={`p-6 border-b border-white/[0.05] ${isCollapsed ? 'px-4' : ''}`}>
        <div className="flex items-center gap-3 justify-center">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold">R</span>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-semibold whitespace-nowrap">Rewi Club</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto scrollbar-hide">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-colors relative group ${
                    isActive
                      ? 'bg-white/[0.06] text-gray-900 dark:text-white'
                      : 'text-gray-400 hover:bg-white/[0.02] hover:text-gray-900 dark:hover:text-white'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-white/[0.03] border border-white/[0.05] backdrop-blur-xl rounded-lg text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      {item.label}
                      {item.badge && (
                        <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                  {/* Active indicator line */}
                  {isActive && !isCollapsed && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom icon */}
      <div className={`p-4 border-t border-white/[0.05] ${isCollapsed ? 'px-4' : ''}`}>
        <div className={`w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center ${isCollapsed ? 'mx-auto' : ''}`}>
          <span className="text-lg">🦊</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
