import { Search, Bell, Play, Plus, Sun, Moon, Wallet, X, ChevronDown, ArrowRight, Trash2, LogOut, Check } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAppKit } from '@reown/appkit/react'
import { useAccount, useDisconnect, useConnect } from 'wagmi'
import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'

function Header() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { open } = useAppKit()
  const { address, connector: currentConnector } = useAccount()
  const { disconnect } = useDisconnect()
  const { connect, connectors } = useConnect()
  const { wallets, addWallet, removeWallet } = useApp()
  const [showWalletDrawer, setShowWalletDrawer] = useState(false)

  // Add wallet to list when new address connects
  useEffect(() => {
    if (address && currentConnector) {
      const walletExists = wallets.find(w => w.address.toLowerCase() === address.toLowerCase())
      if (!walletExists) {
        const connectorName = currentConnector.name || 'Unknown'
        const newWallet = {
          id: Date.now().toString(),
          address,
          balance: 0,
          connection: 'Connected' as const,
          network: 'Ethereum',
          connector: connectorName,
        }
        addWallet(newWallet)
      }
    }
  }, [address, currentConnector])

  const handleConnectWallet = () => {
    open()
  }

  const handleAddWallet = async () => {
    // Disconnect current wallet first so user can choose a different connector
    if (address) {
      disconnect()
      // Give the disconnect time to process before opening modal
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    // Show Reown wallet selection modal immediately after disconnect completes
    open()
  }

  const handleSwitchWallet = (walletAddress: string) => {
    // Find the wallet to switch to
    const wallet = wallets.find(w => w.address.toLowerCase() === walletAddress.toLowerCase())
    if (wallet) {
      // Find the connector that matches this wallet's connector name
      const matchingConnector = connectors.find(c => c.name === wallet.connector)
      
      if (matchingConnector) {
        // Connect using the matching connector
        connect({ connector: matchingConnector })
        setShowWalletDrawer(false)
      } else {
        // Fallback: open AppKit to manually select
        open({ view: 'Account' })
        setShowWalletDrawer(false)
      }
    }
  }

  const handleRemoveWallet = (walletId: string) => {
    const walletToRemove = wallets.find(w => w.id === walletId)
    removeWallet(walletId)
    
    // If removing the currently active wallet, disconnect
    if (walletToRemove && address === walletToRemove.address) {
      disconnect()
    }
  }

  const handleClearAllWallets = () => {
    wallets.forEach(wallet => {
      removeWallet(wallet.id)
    })
    disconnect()
    setShowWalletDrawer(false)
  }

  const formatAddress = (addr?: string) => {
    if (!addr) return "N/A"
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const isActiveWallet = (walletAddress: string) => {
    return address && address.toLowerCase() === walletAddress.toLowerCase()
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

          {/* Wallet Button */}
          {wallets.length > 0 ? (
            <div className="relative">
              <button
                onClick={() => setShowWalletDrawer(!showWalletDrawer)}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/70 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Wallet size={18} />
                <span className="text-sm font-medium">
                  {wallets.length} {wallets.length === 1 ? 'Wallet' : 'Wallets'}
                </span>
                <ChevronDown size={16} className={`transition-transform duration-300 ${showWalletDrawer ? 'rotate-180' : ''}`} />
              </button>

              {showWalletDrawer && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/30 dark:bg-black/50"
                    onClick={() => setShowWalletDrawer(false)}
                  />
                  <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary/5 to-primary/0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground text-base">Connected Wallets</h3>
                          <p className="text-xs text-muted-foreground mt-1">{wallets.length} wallet{wallets.length !== 1 ? 's' : ''} connected</p>
                        </div>
                        <button
                          onClick={() => setShowWalletDrawer(false)}
                          className="text-muted-foreground hover:text-foreground hover:bg-white/10 p-1.5 rounded-lg transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Wallets List */}
                    <div className="max-h-[320px] overflow-y-auto">
                      <div className="space-y-1 p-2">
                        {wallets.map((wallet) => (
                          <div
                            key={wallet.id}
                            onClick={() => {
                              // If this is the already-active wallet, open account modal (w3m-like card)
                              if (isActiveWallet(wallet.address)) {
                                open({ view: 'Account' })
                                setShowWalletDrawer(false)
                              }
                            }}
                            className={`p-3 flex items-center justify-between rounded-lg transition-all duration-200 group ${
                              isActiveWallet(wallet.address)
                                ? 'bg-primary/10 border border-primary/30 ring-1 ring-primary/20'
                                : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750'
                            }`}>
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="relative flex-shrink-0">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  isActiveWallet(wallet.address)
                                    ? 'bg-primary/20'
                                    : 'bg-gray-200 dark:bg-gray-700 group-hover:bg-gray-300 dark:group-hover:bg-gray-600'
                                } transition-colors`}>
                                  <Wallet size={16} className={isActiveWallet(wallet.address) ? 'text-primary' : 'text-muted-foreground'} />
                                </div>
                                {isActiveWallet(wallet.address) && (
                                  <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5 shadow-sm">
                                    <Check size={12} className="text-primary-foreground" />
                                  </div>
                                )}
                              </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <code className="text-xs font-mono block truncate text-foreground">{formatAddress(wallet.address)}</code>
                                    {isActiveWallet(wallet.address) && (
                                      <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded whitespace-nowrap">
                                        Active
                                      </span>
                                    )}
                                  </div>
                                  {wallet.connector && (
                                    <p className="text-xs text-muted-foreground mt-0.5">{wallet.connector}</p>
                                  )}
                                  <p className="text-xs text-muted-foreground mt-0.5">{(wallet.balance ?? 0).toFixed(4)} ETH</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!isActiveWallet(wallet.address) && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleSwitchWallet(wallet.address)
                                  }}
                                  className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                  title="Switch to this wallet"
                                >
                                  <ArrowRight size={14} />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveWallet(wallet.id)
                                }}
                                className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                title="Remove wallet"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-2 bg-gray-50 dark:bg-gray-800">
                      <button
                        onClick={() => {
                          handleAddWallet()
                          setShowWalletDrawer(false)
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/70 text-white rounded-lg transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                      >
                        <Plus size={16} />
                        <span>Add Another Wallet</span>
                      </button>
                      {wallets.length > 1 && (
                        <button
                          onClick={handleClearAllWallets}
                          className="w-full px-4 py-2.5 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors font-medium text-sm border border-destructive/20"
                        >
                          <LogOut size={16} className="inline mr-2" />
                          Clear All Wallets
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={handleConnectWallet}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/70 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              <Wallet size={20} />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header

