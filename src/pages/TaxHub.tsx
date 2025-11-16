import { useState } from 'react'
import { Eye, EyeOff, Globe } from 'lucide-react'

function TaxHub() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-8 text-center">Calculate your crypto taxes</h1>
        
        <div className="bg-dark-card border border-dark-border rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Get started with Tax Hub</h2>
            <button className="flex items-center gap-2 px-3 py-2 bg-dark-surface border border-dark-border rounded-lg hover:bg-dark-bg transition-colors">
              <Globe size={16} />
              <span className="text-sm">EN</span>
            </button>
          </div>

          <p className="text-gray-400 mb-6">
            Have an account? <a href="#" className="text-primary hover:underline">Log in</a>
          </p>

          {/* MetaMask Connect Button */}
          <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary hover:bg-primary-hover rounded-lg transition-colors mb-6">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-xs">🦊</span>
            </div>
            <span className="font-semibold">Connect with Rewi Club</span>
          </button>

          {/* Separator */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-dark-card text-gray-400">Or sign up with email</span>
            </div>
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary pr-12"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <p className="text-sm text-gray-400 mb-6">
            By creating an account you agree to the{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
          </p>

          {/* Sign Up Button */}
          <button className="w-full px-6 py-3 bg-dark-surface border border-dark-border rounded-lg hover:bg-dark-bg transition-colors font-semibold mb-6">
            Sign up
          </button>

          {/* Powered By */}
          <div className="text-center pt-6 border-t border-dark-border">
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
