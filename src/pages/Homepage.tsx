import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import HomeNavbar from '../components/HomeNavbar'
import HomeFooter from '../components/HomeFooter'
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Lock,
  Wallet,
  TrendingUp,
  Users,
  Sparkles,
  ShoppingBag,
  Plane,
  Gift,
  Settings,
  Check,
  Award,
  CreditCard,
  Receipt,
  Clock,
  FileText,
  BarChart3,
  Bell,
} from 'lucide-react'
import { useRef } from 'react'

function Homepage() {
  const { resolvedTheme } = useTheme()
  const { scrollYProgress } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)

  // Scroll animations - removed fade effects
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50])

  const features = [
    {
      icon: Wallet,
      title: 'Multi-Wallet Management',
      description: 'Connect and manage multiple wallets from a single dashboard. Track all your assets in one place.',
      color: resolvedTheme === 'dark' ? 'from-white/10 to-white/5' : 'from-indigo-500/20 to-pink-500/20',
    },
    {
      icon: ShoppingBag,
      title: 'Crypto Marketplace',
      description: 'Buy products directly with cryptocurrency. Real-time balance checking and instant purchases.',
      color: resolvedTheme === 'dark' ? 'from-white/10 to-white/5' : 'from-pink-500/20 to-rose-500/20',
    },
    {
      icon: Receipt,
      title: 'Utility Payments',
      description: 'Pay all utility bills with crypto. 20,000+ billers across 20+ categories - electricity, water, gas, mobile, and more.',
      color: resolvedTheme === 'dark' ? 'from-white/10 to-white/5' : 'from-indigo-500/20 to-pink-500/20',
    },
    {
      icon: Plane,
      title: 'Travel Booking',
      description: 'Book flights and hotels within India using crypto. Search, compare, and book with your wallet balance.',
      color: resolvedTheme === 'dark' ? 'from-white/10 to-white/5' : 'from-indigo-500/20 to-pink-500/20',
    },
    {
      icon: Gift,
      title: 'Rewards & Tiers',
      description: 'Earn 1 seed per $1,000 spent. Progress through Bronze, Silver, Gold, and Diamond tiers.',
      color: resolvedTheme === 'dark' ? 'from-white/10 to-white/5' : 'from-pink-500/20 to-indigo-500/20',
    },
    {
      icon: TrendingUp,
      title: 'DeFi Integration',
      description: 'Swap, stake, and earn yield directly from your wallet across multiple blockchains.',
      color: resolvedTheme === 'dark' ? 'from-white/10 to-white/5' : 'from-pink-500/20 to-indigo-500/20',
    },
    {
      icon: Settings,
      title: 'Advanced Settings',
      description: 'Customize networks, themes, accounts, and preferences to match your needs.',
      color: resolvedTheme === 'dark' ? 'from-white/10 to-white/5' : 'from-indigo-500/20 to-pink-500/20',
    },
  ]

  const appFeatures = [
    {
      title: 'Dashboard',
      description: 'Real-time portfolio tracking with multi-chain support',
      screenshot: '📊',
      image: '💼',
      features: ['Token balances', 'Price tracking', 'Portfolio analytics', 'Transaction history'],
      color: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      title: 'Marketplace',
      description: 'Shop with crypto - instant purchases with balance validation',
      screenshot: '🛒',
      image: '🛍️',
      features: ['12+ products', 'Real-time pricing', 'Secure checkout', 'Purchase history'],
      color: 'from-purple-500/20 to-pink-500/20',
    },
    {
      title: 'Utility Payments',
      description: 'Pay all utility bills with crypto - 20,000+ billers across 20+ categories',
      screenshot: '💳',
      image: '⚡',
      features: ['20,000+ billers', '20+ categories', '24/7 availability', 'Instant payments'],
      color: 'from-green-500/20 to-emerald-500/20',
    },
    {
      title: 'Travel',
      description: 'Book flights and hotels across India using cryptocurrency',
      screenshot: '✈️',
      image: '🌴',
      features: ['12+ airports', 'Flight & hotel search', 'One-way & round-trip', 'Instant booking'],
      color: 'from-orange-500/20 to-red-500/20',
    },
    {
      title: 'Rewards',
      description: 'Earn seeds and unlock tier benefits',
      screenshot: '🎁',
      image: '🏆',
      features: ['1 seed per $1k', '4 tier levels', 'Progress tracking', 'Exclusive benefits'],
      color: 'from-yellow-500/20 to-amber-500/20',
    },
  ]

  const stats = [
    { value: '1M+', label: 'Active Users', icon: Users },
    { value: '$50B+', label: 'Assets Secured', icon: Wallet },
    { value: '50+', label: 'Supported Chains', icon: Globe },
    { value: '99.9%', label: 'Uptime', icon: Zap },
  ]

  // Text reveal animation component - works on scroll up and down
  const TextReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: false, margin: '-100px' })

    return (
      <motion.div
        ref={ref}
        initial={{ y: 50, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white overflow-hidden">
      <HomeNavbar />

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ y }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Animated Circles */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/2 left-1/2 w-[800px] h-[800px] border border-white/5 rounded-full"
            style={{ x: '-50%', y: '-50%' }}
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-[600px] h-[600px] border border-white/5 rounded-full"
            style={{ x: '-50%', y: '-50%' }}
            animate={{ rotate: -360, scale: [1, 0.9, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-[400px] h-[400px] border border-white/5 rounded-full"
            style={{ x: '-50%', y: '-50%' }}
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />


          {/* Floating orbs */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-40 h-40 bg-white/3 rounded-full blur-2xl"
              style={{
                left: `${15 + i * 12}%`,
                top: `${20 + i * 8}%`,
              }}
              animate={{
                y: [0, -40, 0],
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 5 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
          <TextReveal delay={0.2}>
            <h1 className="text-7xl md:text-9xl font-bold mb-8 leading-tight text-white">
              <span className="block">Pay, Earn,</span>
              <span className="block">Travel & Shop</span>
              <span className="block">with Crypto</span>
            </h1>
          </TextReveal>

          <TextReveal delay={1.2}>
            <motion.p
              className="text-2xl md:text-3xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              The all-in-one platform for crypto payments, rewards, travel booking, and marketplace shopping.
              <br />
              <span className="text-white/80">Everything you need in one secure wallet.</span>
            </motion.p>
          </TextReveal>

          <TextReveal delay={1.4}>
            <motion.div
              className="flex gap-4 justify-center flex-wrap"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <Link
                to="/app/dashboard"
                className="group px-10 py-5 bg-white text-black rounded-lg hover:bg-gray-200 transition-all font-semibold text-lg flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-10 py-5 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all font-semibold text-lg backdrop-blur-sm">
                Watch Demo
              </button>
            </motion.div>
          </TextReveal>

          {/* App Preview Cards */}
          <TextReveal delay={1.6}>
            <motion.div
              className="mt-24 grid grid-cols-2 md:grid-cols-5 gap-6 max-w-6xl mx-auto"
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              transition={{ delay: 1.7, duration: 0.8 }}
            >
              {appFeatures.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 20, scale: 0.9 }}
                  animate={{ y: 0, scale: 1 }}
                  transition={{ delay: 1.8 + i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:border-white/30 transition-all cursor-pointer"
                >
                  <div className="text-5xl mb-3">{feature.image}</div>
                  <div className="text-sm font-medium text-white">{feature.title}</div>
                </motion.div>
              ))}
            </motion.div>
          </TextReveal>
        </div>
      </motion.section>

      {/* Stats Section with Rolling Animation */}
      <motion.section
        className="py-32 border-y border-dark-border relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: '-50px' }}
        transition={{ duration: 0.6 }}
      >
        {/* Rolling background circles */}
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          animate={{ x: ['0%', '100%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          <div className="flex gap-40">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="w-60 h-60 border-2 border-white rounded-full flex-shrink-0" />
            ))}
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, y: 30, opacity: 0 }}
                  whileInView={{ scale: 1, y: 0, opacity: 1 }}
                  viewport={{ once: false, margin: '-50px' }}
                  transition={{ delay: i * 0.15, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                  className="text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="inline-block mb-6"
                  >
                    <Icon className="w-16 h-16 text-white mx-auto" />
                  </motion.div>
                  <motion.div
                    className="text-5xl md:text-6xl font-bold text-white mb-3"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-gray-400 text-lg">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>

      {/* App Features Showcase */}
      <section id="app" className="py-40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <TextReveal>
            <div className="text-center mb-32">
              <motion.h2
                className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              >
                Everything You Need
                <br />
                <span className="text-white">In One App</span>
              </motion.h2>
              <motion.p
                className="text-2xl text-gray-400 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Discover all the powerful features that make Rewi Club the ultimate crypto utility platform.
              </motion.p>
            </div>
          </TextReveal>

          <div className="space-y-40">
            {appFeatures.map((feature, i) => {
              const ref = useRef(null)
              const isInView = useInView(ref, { once: false, margin: '-200px' })

              return (
                <motion.div
                  key={i}
                  ref={ref}
                  className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16`}
                >
                  <motion.div
                    className="flex-1"
                    initial={{ x: i % 2 === 0 ? -100 : 100, opacity: 0 }}
                    animate={isInView ? { x: 0, opacity: 1 } : { x: i % 2 === 0 ? -100 : 100, opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02, y: -10 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className={`bg-gradient-to-br ${feature.color} border border-white/10 rounded-3xl p-12 backdrop-blur-lg relative overflow-hidden`}
                    >
                      <motion.div
                        className="absolute inset-0 opacity-20"
                        animate={{
                          backgroundPosition: ['0% 0%', '100% 100%'],
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          repeatType: 'reverse',
                        }}
                        style={{
                          backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%)',
                        }}
                      />
                      <div className="relative z-10">
                        <div className="text-9xl mb-8 text-center">{feature.image}</div>
                        <div className="h-[500px] bg-dark-surface/50 rounded-2xl border border-white/10 flex items-center justify-center backdrop-blur-sm">
                          <motion.div
                            className="text-8xl opacity-40"
                            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            {feature.screenshot}
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    className="flex-1"
                    initial={{ x: i % 2 === 0 ? 100 : -100, opacity: 0 }}
                    animate={isInView ? { x: 0, opacity: 1 } : { x: i % 2 === 0 ? 100 : -100, opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <motion.h3
                      className="text-5xl md:text-6xl font-bold mb-6 text-white"
                      initial={{ y: 20, opacity: 0 }}
                      animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      {feature.title}
                    </motion.h3>
                    <motion.p
                      className="text-xl md:text-2xl text-gray-400 mb-8 leading-relaxed"
                      initial={{ y: 20, opacity: 0 }}
                      animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                    >
                      {feature.description}
                    </motion.p>
                    <div className="space-y-4">
                      {feature.features.map((item, j) => (
                        <motion.div
                          key={j}
                          initial={{ x: -30, opacity: 0 }}
                          animate={isInView ? { x: 0, opacity: 1 } : { x: -30, opacity: 0 }}
                          transition={{ delay: 0.5 + j * 0.1, duration: 0.5 }}
                          className="flex items-center gap-4"
                        >
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 180 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0"
                          >
                            <Check className="w-5 h-5 text-black" />
                          </motion.div>
                          <span className="text-gray-300 text-lg">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-40 bg-dark-surface/30 relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-white rounded-full"
              style={{
                left: `${(i * 3.3) % 100}%`,
                top: `${(i * 4.7) % 100}%`,
              }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <TextReveal>
            <motion.div
              className="text-center mb-32"
              initial={{ y: 30 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-6xl md:text-8xl font-bold mb-8 text-white">
                Powerful Features
              </h2>
              <p className="text-2xl text-gray-400 max-w-3xl mx-auto">
                Everything you need to manage, pay, and earn with cryptocurrency.
              </p>
            </motion.div>
          </TextReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon
              const ref = useRef(null)
              const isInView = useInView(ref, { once: false, margin: '-100px' })

              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ y: 50, scale: 0.9, opacity: 0 }}
                  animate={isInView ? { y: 0, scale: 1, opacity: 1 } : { y: 50, scale: 0.9, opacity: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                  whileHover={{ y: -15, scale: 1.03 }}
                  className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all overflow-hidden backdrop-blur-sm"
                >
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    animate={{
                      scale: [1, 1.15, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.15 }}
                      transition={{ duration: 0.6, type: 'spring' }}
                      className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center mb-6 border border-white/20"
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Utility Payments Section */}
      <section className="py-40 bg-dark-bg relative">
        <div className="max-w-7xl mx-auto px-6">
          <TextReveal>
            <motion.div
              className="text-center mb-32"
              initial={{ y: 30 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-6xl md:text-8xl font-bold mb-8 text-white">
                All-in-One Utility Bill
                <br />
                <span className="text-white">Payment Solution</span>
              </h2>
              <p className="text-2xl text-gray-400 max-w-4xl mx-auto mb-16">
                Manage All Business Utility Bills From One Single Dashboard for Multiple Locations.
                <br />
                Pay with 20,000+ Billers Across 20+ Categories
              </p>
              <div className="flex items-center justify-center gap-6 flex-wrap">
                {[
                  { value: '20,000+', label: 'Billers' },
                  { value: '20+', label: 'Categories' },
                  { value: '24/7', label: 'Available' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2, duration: 0.6 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="bg-white/5 border border-white/10 rounded-xl px-8 py-6 backdrop-blur-sm"
                  >
                    <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TextReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: 'Pay Bills 24/7',
                description: 'Pay anytime, anywhere & never miss any due dates anymore!',
              },
              {
                icon: FileText,
                title: 'Multiple Bill Payments',
                description: 'Set multiple bills on auto-pay to avoid late fees and uninterrupted services.',
              },
              {
                icon: CreditCard,
                title: 'Credit Card Bills',
                description: 'Settle your credit card dues & ensure your monthly repayments are on time.',
              },
              {
                icon: BarChart3,
                title: 'Consolidated View',
                description: 'Access a detailed history of all your bill payments for better financial tracking.',
              },
              {
                icon: Bell,
                title: 'Alerts & Notifications',
                description: 'Get notifications & alerts via mail for bill dues and bill paid for smooth bill processing.',
              },
              {
                icon: Shield,
                title: 'Secure Payments',
                description: 'Bank-level security with multi-layered encryption for all your transactions.',
              },
            ].map((feature, i) => {
              const Icon = feature.icon
              const ref = useRef(null)
              const isInView = useInView(ref, { once: true, margin: '-100px' })

              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ y: 30, opacity: 0 }}
                  animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-8 hover:border-white/30 transition-all backdrop-blur-sm"
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-14 h-14 bg-primary/20 rounded-lg flex items-center justify-center mb-6"
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Rewards & Tiers Section */}
      <section className="py-40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <TextReveal>
            <motion.div
              className="text-center mb-32"
              initial={{ y: 30 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-6xl md:text-8xl font-bold mb-8 text-white">
                Earn Rewards
                <br />
                <span className="text-white">Level Up Your Tiers</span>
              </h2>
              <p className="text-2xl text-gray-400 max-w-3xl mx-auto">
                Get 1 seed for every $1,000 spent. Progress through Bronze, Silver, Gold, and Diamond tiers.
              </p>
            </motion.div>
          </TextReveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { name: 'Bronze', level: '1-3', color: 'from-amber-600 to-amber-800', benefits: ['1% cashback', 'Basic support'] },
              { name: 'Silver', level: '1-3', color: 'from-gray-400 to-gray-600', benefits: ['2% cashback', 'Priority support'] },
              { name: 'Gold', level: '1-3', color: 'from-yellow-400 to-yellow-600', benefits: ['3% cashback', 'VIP support'] },
              { name: 'Diamond', level: '1', color: 'from-cyan-400 to-blue-600', benefits: ['5% cashback', 'Exclusive perks'] },
            ].map((tier, i) => {
              const ref = useRef(null)
              const isInView = useInView(ref, { once: true, margin: '-100px' })

              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ y: 50, scale: 0.9, opacity: 0 }}
                  animate={isInView ? { y: 0, scale: 1, opacity: 1 } : { y: 50, scale: 0.9, opacity: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                  whileHover={{ y: -15, scale: 1.05 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-white/30 transition-all"
                >
                  <motion.div
                    className={`w-24 h-24 bg-gradient-to-br ${tier.color} rounded-full mx-auto mb-6 flex items-center justify-center`}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    whileHover={{ scale: 1.2, rotate: 0 }}
                  >
                    <Award className="w-12 h-12 text-white" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-center mb-3 text-white">{tier.name}</h3>
                  <p className="text-center text-gray-400 mb-6 text-lg">Level {tier.level}</p>
                  <div className="space-y-3">
                      {tier.benefits.map((benefit, j) => (
                        <motion.div
                          key={j}
                          initial={{ x: -20, opacity: 0 }}
                          animate={isInView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
                          transition={{ delay: i * 0.15 + j * 0.1 + 0.3, duration: 0.4 }}
                          className="flex items-center gap-3 text-gray-300"
                        >
                        <Check className="w-5 h-5 text-white" />
                        <span>{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-40 bg-dark-surface/30 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: false, margin: '-100px' }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <h2 className="text-6xl md:text-8xl font-bold mb-8 text-white leading-tight">
                Security You Can
                <br />
                <span className="text-white">Trust</span>
              </h2>
              <p className="text-2xl text-gray-400 mb-12 leading-relaxed">
                Your private keys never leave your device. Bank-level encryption and security practices.
              </p>
              <div className="space-y-6">
                {[
                  'Hardware wallet support',
                  'Multi-signature wallets',
                  'Biometric authentication',
                  'Regular security audits',
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ x: -30, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: false, margin: '-50px' }}
                        transition={{ delay: i * 0.15, duration: 0.6 }}
                        className="flex items-center gap-4"
                      >
                    <motion.div
                      whileHover={{ scale: 1.3, rotate: 180 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      <Lock className="w-6 h-6 text-black" />
                    </motion.div>
                    <span className="text-gray-300 text-xl">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: false, margin: '-100px' }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 border-2 border-white/10 rounded-3xl"
              />
              <motion.div
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-4 border-2 border-white/5 rounded-3xl"
              />
              <div className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-lg relative z-10">
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: false }}
                      transition={{ delay: i * 0.2, duration: 0.6 }}
                      className="bg-white/5 rounded-xl p-6 border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="h-5 bg-white/20 rounded w-40 animate-pulse" />
                        <div className="h-5 bg-white/30 rounded w-20" />
                      </div>
                      <div className="h-4 bg-white/10 rounded w-32 mt-3" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 relative overflow-hidden">
        {/* Animated circles */}
        <motion.div
          className="absolute inset-0 opacity-[0.05]"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] border-2 border-white rounded-full" style={{ transform: 'translate(-50%, -50%)' }} />
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] border-2 border-white rounded-full" style={{ transform: 'translate(-50%, -50%)' }} />
          <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] border-2 border-white rounded-full" style={{ transform: 'translate(-50%, -50%)' }} />
        </motion.div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <TextReveal>
            <motion.div
              initial={{ y: 30 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="inline-block mb-10"
              >
                <Sparkles className="w-20 h-20 text-white" />
              </motion.div>
              <motion.h2
                className="text-6xl md:text-8xl font-bold mb-10 text-white leading-tight"
                initial={{ y: 20 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Ready to Get Started?
              </motion.h2>
              <motion.p
                className="text-2xl text-gray-400 mb-12"
                initial={{ y: 20 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Join thousands of users who trust Rewi Club for their crypto payments and rewards.
              </motion.p>
              <motion.div
                initial={{ y: 20 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Link
                  to="/app/dashboard"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-lg hover:bg-gray-200 transition-all font-semibold text-xl"
                >
                  Launch Rewi Club
                  <ArrowRight size={24} />
                </Link>
              </motion.div>
            </motion.div>
          </TextReveal>
        </div>
      </section>

      <HomeFooter />
    </div>
  )
}

export default Homepage
