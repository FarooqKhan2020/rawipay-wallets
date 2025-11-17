import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

function HomeFooter() {
  const { theme } = useTheme()

  return (
    <footer className="border-t border-dark-border py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={theme === 'dark' ? '/logo.png' : '/log2.png'}
              alt="Rewi Club"
              className="h-10 w-auto transition-transform hover:scale-110"
            />
          </Link>
          <div className="flex gap-8 text-gray-400">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Support</a>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm">
          © 2025 Rewi Club. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default HomeFooter
