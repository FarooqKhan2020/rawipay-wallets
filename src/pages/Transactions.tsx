import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { ArrowDown, ArrowUp, Clock, ShoppingBag, Plane, Receipt, Filter } from 'lucide-react'

interface Transaction {
  id: number
  type: string
  amount: number
  description: string
  created_at: string
}

function Transactions() {
  const { wallets } = useApp()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'purchase' | 'flight' | 'utility'>('all')

  const API_BASE = 'http://localhost:3001/api'
  const walletAddress = wallets[0]?.address || '0xBD77...D599B8'

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/user/${walletAddress}/transactions`)
      const data = await response.json()
      setTransactions(data || [])
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTransactionIcon = (type: string) => {
    if (type.includes('marketplace') || type.includes('purchase')) {
      return ShoppingBag
    } else if (type.includes('flight')) {
      return Plane
    } else if (type.includes('utility')) {
      return Receipt
    }
    return ArrowDown
  }

  const getTransactionColor = (type: string) => {
    if (type.includes('marketplace') || type.includes('purchase')) {
      return 'text-purple-400'
    } else if (type.includes('flight')) {
      return 'text-blue-400'
    } else if (type.includes('utility')) {
      return 'text-green-400'
    }
    return 'text-primary'
  }

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'all') return true
    if (filter === 'purchase') return tx.type.includes('marketplace') || tx.type.includes('purchase')
    if (filter === 'flight') return tx.type.includes('flight')
    if (filter === 'utility') return tx.type.includes('utility')
    return true
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Transaction History</h1>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />
          <div className="flex gap-2">
            {(['all', 'purchase', 'flight', 'utility'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  filter === f
                    ? 'bg-white/[0.06] border border-white/[0.1] text-gray-900 dark:text-white'
                    : 'bg-white/[0.02] border border-white/[0.05] text-gray-400 hover:bg-white/[0.04] hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <p className="text-gray-400">Loading transactions...</p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-gray-400">No transactions found</p>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.02]">
          {filteredTransactions.map((transaction, index) => {
            const Icon = getTransactionIcon(transaction.type)
            const isNegative = transaction.amount < 0
            const iconColor = getTransactionColor(transaction.type)

            return (
              <div
                key={transaction.id}
                className={`p-6 hover:bg-white/[0.02] transition-all duration-200 ${
                  index === filteredTransactions.length - 1 ? '' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-white/[0.03] rounded-xl flex items-center justify-center border border-white/[0.05]`}>
                      <Icon size={24} className={iconColor} />
                    </div>
                    <div>
                      <div className="font-semibold text-base mb-1">{transaction.description}</div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {formatDate(transaction.created_at)} at {formatTime(transaction.created_at)}
                        </span>
                        <span className="px-2 py-0.5 bg-white/[0.02] border border-white/[0.05] rounded-lg text-xs">
                          {transaction.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`text-xl font-bold ${isNegative ? 'text-red-400' : 'text-green-400'}`}>
                        {isNegative ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {isNegative ? 'Debit' : 'Credit'}
                      </div>
                    </div>
                    {isNegative ? (
                      <ArrowDown className="text-red-400" size={20} />
                    ) : (
                      <ArrowUp className="text-green-400" size={20} />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Transactions
