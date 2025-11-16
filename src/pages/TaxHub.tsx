import { useState } from 'react'
import { Eye, EyeOff, Globe } from 'lucide-react'

function TaxHub() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-4xl font-bold text-center">Calculate your crypto taxes</h1>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Get started with Tax Hub</h2>
            <button className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:bg-white/[0.04] transition-all">
              <Globe size={16} />
              <span className="text-sm">EN</span>
            </button>
          </div>

          <p className="text-gray-400">
            Have an account? <a href="#" className="text-primary hover:underline">Log in</a>
          </p>

          {/* MetaMask Connect Button */}
          <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-xl transition-all mb-6">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-xs">🦊</span>
            </div>
            <span className="font-semibold">Connect with Rewi Club</span>
          </button>

          {/* Separator */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.05]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-dark-bg text-gray-400">Or sign up with email</span>
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all pr-12"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <p className="text-sm text-gray-400">
            By creating an account you agree to the{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
          </p>

          {/* Sign Up Button */}
          <button className="w-full px-6 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:bg-white/[0.04] transition-all font-semibold">
            Sign up
          </button>

          {/* Powered By */}
          <div className="text-center pt-6 border-t border-white/[0.05]">
            <p className="text-xs text-gray-500 mb-2">POWERED BY</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center text-white font-bold text-sm">
                C
              </div>
              <span className="text-sm font-semibold">CryptoTax Calculator</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaxHub
