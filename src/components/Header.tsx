import { Search, Bell, Play, Plus, Sun, Moon, Wallet, X, ChevronDown } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAppKit } from '@reown/appkit/react'
import { useAccount, useDisconnect } from 'wagmi'
import { useState } from 'react'
import { useApp } from '../context/AppContext'

function Header() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { open } = useAppKit()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { wallets, addWallet, removeWallet, disconnectWallet } = useApp()
  const [showWalletDrawer, setShowWalletDrawer] = useState(false)

  const handleConnectWallet = () => {
    open()
  }

  const handleAddWallet = async () => {
    if (address && !wallets.find(w => w.address === address)) {
      addWallet(address)
    }
    open()
  }

  const handleSwitchWallet = () => {
    open({ view: 'Account' })
  }

  const handleRemoveWallet = (walletAddress: string) => {
    removeWallet(walletAddress)
    if (address === walletAddress) {
      disconnect()
    }
  }

  const handleClearAllWallets = () => {
    wallets.forEach(wallet => {
      disconnectWallet(wallet.address)
    })
    disconnect()
    setShowWalletDrawer(false)
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

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

          {!isConnected ? (
            <button 
              onClick={handleConnectWallet}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover rounded-lg transition-colors"
            >
              <Wallet size={20} />
              <span>Connect Wallet</span>
            </button>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setShowWalletDrawer(!showWalletDrawer)}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover rounded-lg transition-colors"
              >
                <Wallet size={20} />
                <span>{formatAddress(address!)}</span>
                <ChevronDown size={16} />
              </button>

              {showWalletDrawer && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowWalletDrawer(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">Connected Wallets</h3>
                        <button 
                          onClick={() => setShowWalletDrawer(false)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                      {wallets.map((wallet) => (
                        <div 
                          key={wallet.address}
                          className={`p-3 flex items-center justify-between hover:bg-muted/50 ${
                            wallet.address === address ? 'bg-muted' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <Wallet size={16} className="text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {formatAddress(wallet.address)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {wallet.balance.toFixed(4)} ETH
                              </p>
                            </div>
                          </div>
                          {wallet.address === address && (
                            <span className="text-xs text-primary font-medium">Active</span>
                          )}
                          <button
                            onClick={() => handleRemoveWallet(wallet.address)}
                            className="ml-2 text-muted-foreground hover:text-destructive"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 border-t border-border space-y-2">
                      <button
                        onClick={handleAddWallet}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover rounded-lg transition-colors text-primary-foreground"
                      >
                        <Plus size={18} />
                        <span>Add Wallet</span>
                      </button>
                      <button
                        onClick={handleSwitchWallet}
                        className="w-full px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-foreground"
                      >
                        Switch Wallet
                      </button>
                      {wallets.length > 0 && (
                        <button
                          onClick={handleClearAllWallets}
                          className="w-full px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors"
                        >
                          Clear All Wallets
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header

