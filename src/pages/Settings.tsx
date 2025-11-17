import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'
import { Settings as SettingsIcon, Network, User, Shield, Bell, Copy, MoreVertical, Plus, LogOut, ChevronDown, Check } from 'lucide-react'

function Settings() {
  const [activeSection, setActiveSection] = useState('General')
  const { wallets, addWallet, disconnectWallet } = useApp()
  const [showAddWallet, setShowAddWallet] = useState(false)
  const [newWalletAddress, setNewWalletAddress] = useState('')
  
  // General settings state
  const [currency, setCurrency] = useState('USD - US Dollar')
  const { theme: appTheme, setTheme: setAppTheme } = useTheme()
  const [identicon, setIdenticon] = useState('Maskicon')
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false)
  const [showIdenticonDropdown, setShowIdenticonDropdown] = useState(false)
  
  // Networks state
  const [networks, setNetworks] = useState([
    { id: 'ethereum', name: 'Ethereum', icon: '💎', enabled: true, default: true },
    { id: 'optimism', name: 'Optimism', icon: 'OP', enabled: true, default: true },
    { id: 'bnb', name: 'BNB Chain', icon: 'BNB', enabled: true, default: true },
    { id: 'polygon', name: 'Polygon', icon: '∞', enabled: true, default: true },
    { id: 'base', name: 'Base', icon: 'Base', enabled: true, default: true },
    { id: 'arbitrum', name: 'Arbitrum', icon: 'A', enabled: true, default: true },
    { id: 'linea', name: 'Linea', icon: 'L', enabled: true, default: true },
    { id: 'sei', name: 'Sei', icon: 'Sei', enabled: true, default: true },
    { id: 'cronos', name: 'Cronos', icon: 'C', enabled: false, default: false },
  ])

  const settingsSections = [
    { id: 'General', icon: SettingsIcon },
    { id: 'Networks', icon: Network },
    { id: 'Accounts', icon: User },
    { id: 'About & Privacy', icon: Shield },
    { id: 'Notifications', icon: Bell },
  ]

  const handleAddWallet = () => {
    if (newWalletAddress.trim()) {
      const newWallet = {
        id: Date.now().toString(),
        address: newWalletAddress.trim(),
        balance: 0,
        connection: 'Connected' as const,
        network: 'Ethereum',
      }
      addWallet(newWallet)
      setNewWalletAddress('')
      setShowAddWallet(false)
    }
  }

  const handleDisconnectAll = () => {
    wallets.forEach((wallet) => disconnectWallet(wallet.id))
  }

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
  }

  const formatAddress = (address?: string) => {
  if (!address) return "N/A"
  return `${address.slice(0, 6)}...${address.slice(-6)}`
}

  return (
    <div className="flex h-full min-h-[calc(100vh-80px)] p-6">
      {/* Settings Sidebar */}
      <div className="w-64 border-r border-white/[0.05]">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          <nav className="space-y-1">
            {settingsSections.map((section) => {
              const Icon = section.icon
              const isActive = activeSection === section.id
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                    isActive
                      ? 'bg-white/[0.06] border border-white/[0.1] text-gray-900 dark:text-white'
                      : 'text-gray-400 hover:bg-white/[0.02] hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{section.id}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeSection === 'Accounts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Accounts</h2>
                <p className="text-gray-400">Connect or watch multiple accounts at once.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDisconnectAll}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 transition-all"
                >
                  <LogOut size={16} />
                  Disconnect wallets
                </button>
                <button
                  onClick={() => setShowAddWallet(!showAddWallet)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-dark-bg rounded-xl hover:bg-gray-200 transition-all"
                >
                  <Plus size={16} />
                  Add account
                </button>
              </div>
            </div>

            {showAddWallet && (
              <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Add New Wallet</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter wallet address (0x...)"
                    value={newWalletAddress}
                    onChange={(e) => setNewWalletAddress(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white/[0.02] border border-white/[0.05] rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                  />
                  <button
                    onClick={handleAddWallet}
                    className="px-6 py-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-xl transition-all"
                  >
                    Connect
                  </button>
                  <button
                    onClick={() => {
                      setShowAddWallet(false)
                      setNewWalletAddress('')
                    }}
                    className="px-6 py-2 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:bg-white/[0.04] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Accounts Table */}
            <div className="mt-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Address</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Balance</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Connection</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {wallets.map((wallet) => (
                    <tr key={wallet.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-all">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold">R</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{formatAddress(wallet.address)}</span>
                            <button
                              onClick={() => copyAddress(wallet.address)}
                              className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold">${(wallet.balance ?? 0).toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            wallet.connection === 'Connected'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}
                        >
                          {wallet.connection}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button className="text-gray-400 hover:text-white transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'General' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">General</h2>
            
            {/* Currency Conversion */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Currency Conversion</h3>
                <p className="text-sm text-gray-400 mb-4">Base Currency for market value</p>
                <div className="relative">
                  <button
                    onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                    className="w-full md:w-64 px-4 py-2 bg-white/[0.02] border border-white/[0.05] rounded-xl flex items-center justify-between hover:border-primary/50 transition-all"
                  >
                    <span>{currency}</span>
                    <ChevronDown size={16} />
                  </button>
                  {showCurrencyDropdown && (
                    <div className="absolute top-full mt-2 w-full md:w-64 bg-white/[0.03] border border-white/[0.05] rounded-xl shadow-lg z-10 backdrop-blur-xl">
                      {['USD - US Dollar', 'EUR - Euro', 'GBP - British Pound', 'JPY - Japanese Yen', 'CNY - Chinese Yuan'].map((curr) => (
                        <button
                          key={curr}
                          onClick={() => {
                            setCurrency(curr)
                            setShowCurrencyDropdown(false)
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-white/[0.04] flex items-center justify-between transition-all"
                        >
                          <span>{curr}</span>
                          {currency === curr && <Check size={16} className="text-primary" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Theme */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Theme</h3>
              <div className="flex gap-4">
                {(['light', 'dark', 'system'] as const).map((th) => {
                  const displayName = th.charAt(0).toUpperCase() + th.slice(1)
                  return (
                    <button
                      key={th}
                      onClick={() => setAppTheme(th)}
                      className={`px-6 py-3 rounded-xl border transition-all ${
                        appTheme === th
                          ? 'bg-primary border-primary text-white'
                          : 'bg-white/[0.02] border-white/[0.05] text-gray-400 hover:border-primary/50 hover:bg-white/[0.04]'
                      }`}
                    >
                      {displayName}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Account Identicon */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Account Identicon</h3>
                <div className="relative">
                  <button
                    onClick={() => setShowIdenticonDropdown(!showIdenticonDropdown)}
                    className="w-full md:w-64 px-4 py-2 bg-white/[0.02] border border-white/[0.05] rounded-xl flex items-center justify-between hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center text-xs font-bold">M</div>
                      <span>{identicon}</span>
                    </div>
                    <ChevronDown size={16} />
                  </button>
                  {showIdenticonDropdown && (
                    <div className="absolute top-full mt-2 w-full md:w-64 bg-white/[0.03] border border-white/[0.05] rounded-xl shadow-lg z-10 backdrop-blur-xl">
                      {['Jazzicon', 'Blockies', 'Maskicon'].map((icon) => (
                        <button
                          key={icon}
                          onClick={() => {
                            setIdenticon(icon)
                            setShowIdenticonDropdown(false)
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-white/[0.04] flex items-center justify-between transition-all"
                        >
                          <span>{icon}</span>
                          {identicon === icon && <Check size={16} className="text-primary" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'Networks' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Supported Networks</h2>
              <p className="text-gray-400">Enable or disable networks to load portfolio data for that network.</p>
            </div>
            
            <div className="mt-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Network</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {networks.map((network) => (
                    <tr key={network.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-all">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold">
                            {network.icon}
                          </div>
                          <span className="font-medium">{network.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {network.default ? (
                          <span className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-medium">
                            Default
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setNetworks(networks.map((n) =>
                                n.id === network.id ? { ...n, enabled: !n.enabled } : n
                              ))
                            }}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              network.enabled ? 'bg-primary' : 'bg-gray-600'
                            }`}
                          >
                            <div
                              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                network.enabled ? 'translate-x-6' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'About & Privacy' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">About & Privacy</h2>
            <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-xl">
              <p className="text-gray-400">About & Privacy settings coming soon</p>
            </div>
          </div>
        )}

        {activeSection === 'Notifications' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Notifications</h2>
            <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-xl">
              <p className="text-gray-400">Notification settings coming soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings
