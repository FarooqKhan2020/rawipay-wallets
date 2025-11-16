import { useState } from 'react'
import { Search, Trophy, Flame, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react'

interface Token {
  rank: number
  name: string
  symbol: string
  price: number
  change24h: number
  changePercent24h: number
  trend: 'up' | 'down'
  marketCap: string
  fdv: string
  age: string
}

function Discover() {
  const [activeTab, setActiveTab] = useState('Tokens')
  const [activeFilter, setActiveFilter] = useState('Popular')
  const [selectedNetwork, setSelectedNetwork] = useState('All networks')

  const tabs = ['Tokens', 'Sites', 'NFTs', 'Games', 'Networks']

  const featuredApps = [
    {
      name: 'Everstake',
      logo: '⚙️',
      description: 'Earn up to 9% on SOL and ETH — MEV-boosted staking, airdrops &...',
    },
    {
      name: 'Turtle',
      logo: '🐢',
      description: 'Boost your rewards and earn 10%-30%+ APR on USD, BTC, and ET...',
    },
    {
      name: 'MetaLend',
      logo: 'A',
      description: 'Earn 10%+ and spend anywhere with the MetaMask Card! Fully on-chain -...',
    },
    {
      name: 'Figment',
      logo: 'F',
      description: 'Get up to 8% Staking Rewards on your SOL with Figment\'s industry-...',
    },
    {
      name: 'Index Coop',
      logo: '✓',
      description: 'One click spot leverage with $150,000 in rewards up for grabs...',
    },
  ]

  const tokens: Token[] = [
    {
      rank: 1,
      name: 'Ethereum',
      symbol: 'ETH',
      price: 3139.73,
      change24h: -55.70,
      changePercent24h: -1.77,
      trend: 'down',
      marketCap: '$379.9B',
      fdv: '$379.9B',
      age: '8y',
    },
    {
      rank: 2,
      name: 'Wrapped Bitcoin',
      symbol: 'WBTC',
      price: 95646.0,
      change24h: -1044.03,
      changePercent24h: -1.09,
      trend: 'down',
      marketCap: '$12.1B',
      fdv: '$12.1B',
      age: '8y',
    },
    {
      rank: 3,
      name: 'Meta Games Coin',
      symbol: 'MGC',
      price: 4.81,
      change24h: -0.0027,
      changePercent24h: -0.06,
      trend: 'down',
      marketCap: '$481.1B',
      fdv: '$481.1B',
      age: '1y',
    },
    {
      rank: 4,
      name: 'quq',
      symbol: 'QUQ',
      price: 277.79,
      change24h: 21432150.2,
      changePercent24h: 7715186.16,
      trend: 'up',
      marketCap: '$277.8B',
      fdv: '$277.8B',
      age: '7M',
    },
    {
      rank: 5,
      name: 'BNB',
      symbol: 'BNB',
      price: 386.57,
      change24h: -1.7,
      changePercent24h: -0.44,
      trend: 'down',
      marketCap: '$57.9B',
      fdv: '$57.9B',
      age: '7y',
    },
  ]

  const filters = [
    { id: 'Popular', icon: Trophy },
    { id: 'Trending', icon: Flame },
    { id: 'Gainers', icon: TrendingUp },
    { id: 'Losers', icon: TrendingDown },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Discover</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-white/[0.05]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-1 transition-colors relative ${
              activeTab === tab
                ? 'text-gray-900 dark:text-white font-medium'
                : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary to-primary/50 rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'Tokens' && (
        <>
          {/* Featured Apps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {featuredApps.map((app, i) => (
              <div
                key={i}
                className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:bg-white/[0.04] hover:border-white/[0.08] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-xl border border-primary/20">
                    {app.logo}
                  </div>
                  <div className="font-semibold">{app.name}</div>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">{app.description}</p>
              </div>
            ))}
          </div>

          {/* Token Filters */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {filters.map((filter) => {
                const Icon = filter.icon
                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      activeFilter === filter.id
                        ? 'bg-white/[0.06] border border-white/[0.1] text-gray-900 dark:text-white'
                        : 'bg-white/[0.02] border border-white/[0.05] text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{filter.id}</span>
                  </button>
                )
              })}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/[0.05] rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/[0.04] transition-all">
              <span>{selectedNetwork}</span>
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Token Table */}
          <div className="mt-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">#</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Token</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Change (24h)</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Change % (24h)</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Trend (24h)</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Market cap</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">FDV</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Age</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token) => (
                  <tr key={token.rank} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-all">
                    <td className="py-4 px-4 text-gray-400">{token.rank}</td>
                    <td className="py-4 px-4">
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-sm text-gray-400">{token.name}</div>
                    </td>
                    <td className="py-4 px-4 font-medium">${token.price.toLocaleString()}</td>
                    <td className={`py-4 px-4 ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {token.change24h >= 0 ? '+' : ''}${token.change24h.toLocaleString()}
                    </td>
                    <td className={`py-4 px-4 ${token.changePercent24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {token.changePercent24h >= 0 ? '+' : ''}
                      {token.changePercent24h.toFixed(2)}%
                    </td>
                    <td className="py-4 px-4">
                      <div className={`w-16 h-8 flex items-center ${token.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        {token.trend === 'up' ? '📈' : '📉'}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-400">{token.marketCap}</td>
                    <td className="py-4 px-4 text-gray-400">{token.fdv}</td>
                    <td className="py-4 px-4 text-gray-400">{token.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab !== 'Tokens' && (
        <div className="p-12 text-center">
          <p className="text-gray-400">{activeTab} content coming soon</p>
        </div>
      )}
    </div>
  )
}

export default Discover
