import { Search, Bell, Play, Plus, Sun, Moon, Menu } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

interface HeaderProps {
  onMenuToggle: () => void
}

function Header({ onMenuToggle }: HeaderProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  return (
    <div className="bg-dark-surface border-b border-dark-border p-4">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile menu button */}
        <button 
          onClick={onMenuToggle}
          className="md:hidden text-gray-400 hover:text-white"
        >
          <Menu size={24} />
        </button>

        {/* Search - hidden on small mobile, shown on larger screens */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for a token..."
              className="w-full pl-10 pr-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notification icons - hidden on very small screens */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <Bell className="text-gray-400" size={20} />
            <Play className="text-gray-400" size={20} />
          </div>
          
          {/* Theme Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system']
                const currentIndex = themes.indexOf(theme)
                const nextIndex = (currentIndex + 1) % themes.length
                setTheme(themes[nextIndex])
              }}
              className="flex items-center gap-2 px-3 py-2 bg-dark-card border border-dark-border rounded-lg hover:bg-dark-surface transition-colors"
              title={`Theme: ${theme} (${resolvedTheme})`}
            >
              {resolvedTheme === 'light' ? (
                <Sun className="text-yellow-500" size={18} />
              ) : (
                <Moon className="text-blue-400" size={18} />
              )}
            </button>
          </div>

          {/* Add account button - text hidden on small screens */}
          <button className="flex items-center gap-2 px-3 md:px-4 py-2 bg-primary hover:bg-primary-hover rounded-lg transition-colors">
            <Plus size={20} />
            <span className="hidden md:inline">Add an account</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header

