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

      {/* Action Buttons - Blended Design */}
      <div className="flex gap-3 flex-wrap">
        {actionButtons.map((button) => (
          <button
            key={button.label}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-200"
          >
            <span className="text-sm font-medium">{button.label}</span>
            {button.hasDropdown && <ChevronDown size={16} className="opacity-60" />}
          </button>
        ))}
      </div>

      {/* Decentralized accounts section - Blended Design */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Decentralized accounts</h2>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all">
              <span className="text-xl">+</span>
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
              <div className="w-6 h-6 bg-primary rounded-full"></div>
              <ChevronDown size={16} className="opacity-60" />
            </div>
          </div>
        </div>

        {/* Balance Display - Seamless Blended Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 via-white/3 to-white/5 backdrop-blur-xl border border-white/10">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50"></div>
          
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-5xl font-bold mb-2">${totalBalance.toFixed(2)}</p>
                <p className="text-green-400 text-sm font-medium">
                  +${balanceChange.toFixed(2)} (+{balanceChangePercent.toFixed(2)}%)
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                <Wallet className="text-primary" size={32} />
              </div>
            </div>

            {/* Filters - Blended Design */}
            <div className="flex items-center gap-3 flex-wrap mb-6">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-sm hover:bg-white/10 hover:border-white/20 transition-all">
                {selectedAccount}
                <ChevronDown size={14} className="opacity-60" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-sm hover:bg-white/10 hover:border-white/20 transition-all">
                <div className="flex gap-1">
                  <div className="w-4 h-4 bg-blue-500 rounded-full border border-blue-400/50"></div>
                  <div className="w-4 h-4 bg-purple-500 rounded-full border border-purple-400/50"></div>
                  <div className="w-4 h-4 bg-green-500 rounded-full border border-green-400/50"></div>
                </div>
                {selectedNetworks}
                <ChevronDown size={14} className="opacity-60" />
              </button>
              <button className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-sm hover:bg-white/10 hover:border-white/20 transition-all">
                More
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-sm hover:bg-white/10 hover:border-white/20 transition-all">
                <Gift size={14} className="opacity-60" />
                No airdrops
              </button>
            </div>

            {/* Tabs - Seamless Design */}
            <div className="flex gap-8 border-b border-white/10">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`pb-4 px-1 transition-all duration-200 relative ${
                    selectedTab === tab
                      ? 'text-white font-semibold'
                      : 'text-gray-400 hover:text-white'
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
        </div>

        {/* Token List - Blended Table Design */}
        {selectedTab === 'Tokens' && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 via-white/3 to-white/5 backdrop-blur-xl border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-transparent opacity-30"></div>
            <div className="relative">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
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
                      className={`border-b border-white/5 hover:bg-white/5 transition-all duration-200 ${
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
          </div>
        )}

        {/* Placeholder for other tabs */}
        {selectedTab !== 'Tokens' && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 via-white/3 to-white/5 backdrop-blur-xl border border-white/10 p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-transparent opacity-30"></div>
            <p className="text-gray-400 relative z-10">{selectedTab} content coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
