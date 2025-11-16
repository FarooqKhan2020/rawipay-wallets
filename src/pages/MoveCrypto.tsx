import { useState } from 'react'
import { ChevronDown, ArrowUpDown, Settings, Info } from 'lucide-react'

function MoveCrypto() {
  const [fromToken, setFromToken] = useState('ETH')
  const [toToken, setToToken] = useState('')
  const [fromAmount, setFromAmount] = useState('0')
  const [toAmount, setToAmount] = useState('0')
  const [selectedNetwork, setSelectedNetwork] = useState('Ethereum')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', logo: '💎' },
    { symbol: 'USDT', name: 'Tether', logo: '💵' },
    { symbol: 'USDC', name: 'USD Coin', logo: '🪙' },
    { symbol: 'DAI', name: 'Dai Stablecoin', logo: '🔷' },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', logo: '₿' },
  ]

  const networks = ['Ethereum', 'Polygon', 'BNB Chain', 'Arbitrum', 'Optimism', 'Base']

  const handleSwap = () => {
    const temp = fromToken
    setFromToken(toToken || 'Select a token')
    setToToken(temp)
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Swap</h1>

      <div className="max-w-2xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 via-white/3 to-white/5 backdrop-blur-xl border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50"></div>
          <div className="relative p-8">
            {/* Network Selector */}
            <div className="mb-6">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl w-fit hover:bg-white/10 hover:border-white/20 transition-all">
                <div className="w-5 h-5 bg-primary rounded-full border border-primary/50"></div>
                <span className="font-medium">{selectedNetwork}</span>
                <ChevronDown size={16} className="opacity-60" />
              </div>
            </div>

            {/* Swap From */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">Swap from</label>
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm border border-white/10 p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center text-lg border border-primary/20">
                      {tokens.find((t) => t.symbol === fromToken)?.logo || '💎'}
                    </div>
                    <span className="font-semibold text-base">{fromToken}</span>
                    <ChevronDown size={16} className="opacity-60" />
                  </div>
                  <input
                    type="number"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    placeholder="0"
                    className="bg-transparent text-right text-2xl font-semibold text-white w-32 focus:outline-none"
                  />
                </div>
                <div className="text-sm text-gray-400">Balance: 0.5 {fromToken}</div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center my-2">
              <button
                onClick={handleSwap}
                className="w-14 h-14 bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <ArrowUpDown className="text-white" size={22} />
              </button>
            </div>

            {/* Swap To */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">Swap to</label>
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm border border-white/10 p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {toToken ? (
                      <>
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center text-lg border border-primary/20">
                          {tokens.find((t) => t.symbol === toToken)?.logo || '🪙'}
                        </div>
                        <span className="font-semibold text-base">{toToken}</span>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10"></div>
                        <span className="text-gray-400">Select a token</span>
                      </>
                    )}
                    <ChevronDown size={16} className="opacity-60" />
                  </div>
                  <input
                    type="number"
                    value={toAmount}
                    onChange={(e) => setToAmount(e.target.value)}
                    placeholder="0"
                    className="bg-transparent text-right text-2xl font-semibold text-white w-32 focus:outline-none"
                  />
                </div>
                {toToken && <div className="text-sm text-gray-400">Balance: 0 {toToken}</div>}
              </div>
            </div>

            {/* Advanced Options */}
            <div className="mb-6">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <span>Advanced Options</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                />
              </button>
              {showAdvanced && (
                <div className="mt-4 p-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Slippage tolerance</span>
                    <span className="text-sm text-white font-medium">0.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Transaction deadline</span>
                    <span className="text-sm text-white font-medium">20 minutes</span>
                  </div>
                </div>
              )}
            </div>

            {/* Get Quotes Button */}
            <button className="w-full py-4 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl font-semibold hover:from-primary/90 hover:to-primary/70 transition-all mb-4">
              Get Quotes
            </button>

            {/* Terms */}
            <div className="text-center">
              <a href="#" className="text-sm text-primary hover:underline">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MoveCrypto
