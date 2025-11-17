import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

function HomeNavbar() {
  const { theme } = useTheme()

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 w-full z-50 bg-dark-bg/80 backdrop-blur-xl border-b border-dark-border"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.img
            src={theme === 'dark' ? '/logo.png' : '/log2.png'}
            alt="Rewi Club"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="h-10 w-auto transition-transform group-hover:scale-110"
          />
        </Link>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden md:block">
            Features
          </a>
          <a href="#app" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden md:block">
            App
          </a>
          <a href="#security" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden md:block">
            Security
          </a>
          <Link
            to="/app/dashboard"
            className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-all font-medium"
          >
            Launch App
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}

export default HomeNavbar
