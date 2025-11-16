import { Search, Bell, Play, Plus, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

function Header() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  return (
    <div className="border-b border-white/[0.05] p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for a token..."
              className="w-full pl-10 pr-4 py-2 bg-white/[0.02] border border-white/[0.05] rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
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
              className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] border border-white/[0.05] rounded-lg hover:bg-white/[0.04] transition-colors"
              title={`Theme: ${theme} (${resolvedTheme})`}
            >
              {resolvedTheme === 'light' ? (
                <Sun className="text-yellow-500" size={18} />
              ) : (
                <Moon className="text-blue-400" size={18} />
              )}
            </button>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover rounded-lg transition-colors">
            <Plus size={20} />
            <span>Add an account</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header

