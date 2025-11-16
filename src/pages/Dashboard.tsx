import { ChevronDown, Gift, Wallet, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'

interface Token {
  name: string
  symbol: string
  logo: string
  portfolioPercent: number
  price: number
  priceChange24h: number
  balance: number
  balanceValue: number
}

function Dashboard() {
  const { wallets } = useApp()
  const [selectedTab, setSelectedTab] = useState('Tokens')
  const [selectedAccount, setSelectedAccount] = useState('0xa878...b0e1D1')
  const [selectedNetworks, setSelectedNetworks] = useState('8 Networks')

  const totalBalance = wallets[0]?.balance || 1.70
  const balanceChange = 0.03
  const balanceChangePercent = 2.03

  const tokens: Token[] = [
    {
      name: 'Binance Coin',
      symbol: 'BNB',
      logo: '🟡',
      portfolioPercent: 100,
      price: 929.18,
      priceChange24h: 2.07,
      balance: 0.0018,
      balanceValue: totalBalance,
    },
  ]

  const tabs = ['Tokens', 'NFTs', 'DeFi', 'Transactions', 'Spending Caps']

  const actionButtons = [
    { label: 'Buy', hasDropdown: true },
    { label: 'Swap' },
    { label: 'Bridge' },
    { label: 'Send' },
    { label: 'Sell' },
    { label: 'Stake' },
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Title */}
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Action Buttons - Minimal Design */}
      <div className="flex gap-3 flex-wrap">
        {actionButtons.map((button) => (
          <button
            key={button.label}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl transition-all duration-200 border border-white/[0.05] hover:border-white/[0.08]"
          >
            <span className="text-sm font-medium">{button.label}</span>
            {button.hasDropdown && <ChevronDown size={16} className="opacity-60" />}
          </button>
        ))}
      </div>

      {/* Decentralized accounts section - Seamless Design */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Decentralized accounts</h2>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl flex items-center justify-center border border-white/[0.05] hover:border-white/[0.08] transition-all">
              <span className="text-xl">+</span>
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.05] rounded-xl">
              <div className="w-6 h-6 bg-primary rounded-full"></div>
              <ChevronDown size={16} className="opacity-60" />
            </div>
          </div>
        </div>

        {/* Balance Display - Seamless Integrated Design */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-5xl font-bold mb-2">${totalBalance.toFixed(2)}</p>
              <p className="text-green-400 text-sm font-medium">
                +${balanceChange.toFixed(2)} (+{balanceChangePercent.toFixed(2)}%)
              </p>
            </div>
          </div>

          {/* Filters - Minimal Design */}
          <div className="flex items-center gap-3 flex-wrap">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/[0.08] rounded-xl text-sm transition-all">
              {selectedAccount}
              <ChevronDown size={14} className="opacity-60" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/[0.08] rounded-xl text-sm transition-all">
              <div className="flex gap-1">
                <div className="w-4 h-4 bg-blue-500 rounded-full border border-blue-400/50"></div>
                <div className="w-4 h-4 bg-purple-500 rounded-full border border-purple-400/50"></div>
                <div className="w-4 h-4 bg-green-500 rounded-full border border-green-400/50"></div>
              </div>
              {selectedNetworks}
              <ChevronDown size={14} className="opacity-60" />
            </button>
            <button className="px-4 py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/[0.08] rounded-xl text-sm transition-all">
              More
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/[0.08] rounded-xl text-sm transition-all">
              <Gift size={14} className="opacity-60" />
              No airdrops
            </button>
          </div>

          {/* Tabs - Minimal Seamless Design */}
          <div className="flex gap-8 border-b border-white/[0.05]">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                  className={`pb-4 px-1 transition-all duration-200 relative ${
                    selectedTab === tab
                      ? 'text-gray-900 dark:text-white font-semibold'
                      : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
              >
                {tab}
                {selectedTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary to-primary/50 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Token List - Seamless Table Design */}
        {selectedTab === 'Tokens' && (
          <div className="mt-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Token</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    Portfolio %
                    <ChevronDown size={14} className="inline ml-1 opacity-60" />
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Price (24hr)</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Balance</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token, index) => (
                  <tr
                    key={token.symbol}
                    className={`border-b border-white/[0.02] hover:bg-white/[0.02] transition-all duration-200 ${
                      index === tokens.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-400/10 rounded-xl flex items-center justify-center text-2xl border border-yellow-500/20">
                          {token.logo}
                        </div>
                        <div>
                          <div className="font-semibold text-base">{token.symbol}</div>
                          <div className="text-sm text-gray-400">{token.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className="text-white font-medium">{token.portfolioPercent}%</span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="font-semibold">${token.price.toFixed(2)}</div>
                      <div className={`text-sm font-medium ${token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {token.priceChange24h >= 0 ? '+' : ''}
                        {token.priceChange24h.toFixed(2)}%
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="font-semibold text-base">${token.balanceValue.toFixed(2)}</div>
                      <div className="text-sm text-gray-400">
                        {token.balance} {token.symbol}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {selectedTab !== 'Tokens' && (
          <div className="mt-4 p-12 text-center">
            <p className="text-gray-400">{selectedTab} content coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
