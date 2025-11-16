import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import ConfirmModal from '../components/ConfirmModal'
import {
  Search,
  Zap,
  Droplet,
  Wifi,
  CreditCard,
  Building,
  GraduationCap,
  Car,
  Phone,
  Tv,
  FileText,
  CheckCircle,
  Smartphone,
  DollarSign,
} from 'lucide-react'

interface Biller {
  id: string
  name: string
  category: string
  icon: any
  logo?: string
}

interface Bill {
  id: string
  billerId: string
  customerId: string
  amount: number
  dueDate: string
  status: 'pending' | 'paid'
}

function UtilityPayments() {
  const { wallets, updateSpending } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedBiller, setSelectedBiller] = useState<Biller | null>(null)
  const [customerId, setCustomerId] = useState('')
  const [amount, setAmount] = useState('')
  const [bills, setBills] = useState<Bill[]>([])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingPayment, setPendingPayment] = useState<{ biller: Biller; amount: number; customerId: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const API_BASE = 'http://localhost:3001/api'
  const walletAddress = wallets[0]?.address || '0xBD77...D599B8'

  const billers: Biller[] = [
    { id: '1', name: 'Mobile Recharge', category: 'Telecom', icon: Phone },
    { id: '2', name: 'Electricity', category: 'Utilities', icon: Zap },
    { id: '3', name: 'Water', category: 'Utilities', icon: Droplet },
    { id: '4', name: 'Gas (LPG)', category: 'Utilities', icon: Car },
    { id: '5', name: 'Broadband', category: 'Telecom', icon: Wifi },
    { id: '6', name: 'Cable TV', category: 'Entertainment', icon: Tv },
    { id: '7', name: 'DTH', category: 'Entertainment', icon: Tv },
    { id: '8', name: 'Credit Card', category: 'Finance', icon: CreditCard },
    { id: '9', name: 'Education Fees', category: 'Education', icon: GraduationCap },
    { id: '10', name: 'Insurance', category: 'Finance', icon: FileText },
    { id: '11', name: 'Landline', category: 'Telecom', icon: Phone },
    { id: '12', name: 'Fastag Recharge', category: 'Transport', icon: Car },
    { id: '13', name: 'Municipal Taxes', category: 'Government', icon: Building },
    { id: '14', name: 'Subscription', category: 'Entertainment', icon: Tv },
    { id: '15', name: 'Hospital & Pathology', category: 'Healthcare', icon: Building },
    { id: '16', name: 'Club & Association', category: 'Other', icon: Building },
  ]

  const categories = ['All', 'Telecom', 'Utilities', 'Entertainment', 'Finance', 'Education', 'Transport', 'Government', 'Healthcare', 'Other']

  useEffect(() => {
    fetchBills()
  }, [])

  const fetchBills = async () => {
    try {
      const response = await fetch(`${API_BASE}/utility/bills/${walletAddress}`)
      const data = await response.json()
      setBills(data.bills || [])
    } catch (error) {
      console.error('Error fetching bills:', error)
    }
  }

  const filteredBillers = billers.filter((biller) => {
    const matchesSearch = biller.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || biller.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleBillerSelect = (biller: Biller) => {
    setSelectedBiller(biller)
    setCustomerId('')
    setAmount('')
  }

  const handleFetchBill = async () => {
    if (!selectedBiller || !customerId) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE}/utility/fetch-bill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          billerId: selectedBiller.id,
          customerId,
        }),
      })

      const data = await response.json()
      if (data.error) {
        alert(data.error)
      } else {
        setAmount(data.amount.toString())
      }
    } catch (error) {
      console.error('Error fetching bill:', error)
      alert('Error fetching bill. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePayBill = () => {
    if (!selectedBiller || !customerId || !amount) {
      return
    }

    const paymentAmount = parseFloat(amount)
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      return
    }

    setPendingPayment({
      biller: selectedBiller,
      amount: paymentAmount,
      customerId,
    })
    setShowConfirmModal(true)
  }

  const confirmPayment = async () => {
    if (!pendingPayment) return

    setIsLoading(true)
    try {
      const balanceResponse = await fetch(`${API_BASE}/user/${walletAddress}/balance`)
      const balanceData = await balanceResponse.json()

      if (balanceData.balance < pendingPayment.amount) {
        setShowConfirmModal(false)
        alert(`Insufficient balance. You have $${balanceData.balance.toFixed(2)}, but need $${pendingPayment.amount.toFixed(2)}`)
        return
      }

      const paymentResponse = await fetch(`${API_BASE}/utility/pay-bill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          billerId: pendingPayment.biller.id,
          billerName: pendingPayment.biller.name,
          customerId: pendingPayment.customerId,
          amount: pendingPayment.amount,
        }),
      })

      const paymentData = await paymentResponse.json()

      if (paymentData.error) {
        setShowConfirmModal(false)
        alert(paymentData.error)
      } else {
        setShowConfirmModal(false)
        setPaymentSuccess(true)
        updateSpending(pendingPayment.amount)
        fetchBills()
        setSelectedBiller(null)
        setCustomerId('')
        setAmount('')
        setPendingPayment(null)

        setTimeout(() => {
          setPaymentSuccess(false)
        }, 3000)
      }
    } catch (error) {
      console.error('Error paying bill:', error)
      setShowConfirmModal(false)
      alert('Error processing payment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Utility Payments</h1>
      </div>

      {/* Success Message */}
      {paymentSuccess && (
        <div className="p-4 flex items-center gap-3 max-w-2xl">
          <CheckCircle className="text-green-400" size={20} />
          <span className="text-green-400">Payment successful! Bill has been paid.</span>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Billers Selection - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Categories */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for billers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                      selectedCategory === category
                        ? 'bg-white/[0.06] border border-white/[0.1] text-gray-900 dark:text-white'
                        : 'bg-white/[0.02] border border-white/[0.05] text-gray-400 hover:bg-white/[0.04] hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Section Header */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Select Biller</h3>
          </div>

          {/* Billers Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBillers.map((biller) => {
              const Icon = biller.icon
              const isSelected = selectedBiller?.id === biller.id

              return (
                <button
                  key={biller.id}
                  onClick={() => handleBillerSelect(biller)}
                  className="relative p-4 flex flex-col items-center text-center transition-all hover:scale-105"
                >
                  <div className={`relative rounded-xl flex items-center justify-center w-14 h-14 mb-3 transition-all ${
                    isSelected ? 'bg-primary/20 border border-primary/30' : 'bg-white/[0.02] border border-white/[0.05]'
                  }`}>
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-primary' : 'text-gray-400'}`} />
                  </div>
                  <div className={`text-sm font-medium relative ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                    {biller.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 relative">{biller.category}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Payment Form - Right Side */}
        <div className="lg:col-span-1">
          <div className="p-6 sticky top-6 space-y-4">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Smartphone className="text-primary" size={20} />
              Pay Bill
            </h3>

            {selectedBiller ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Biller
                  </label>
                  <div className="flex items-center gap-2 p-3">
                    <selectedBiller.icon className="w-5 h-5 text-primary" />
                    <span className="text-white">{selectedBiller.name}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Customer ID / Account Number
                  </label>
                  <input
                    type="text"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    placeholder="Enter customer ID"
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>

                <button
                  onClick={handleFetchBill}
                  disabled={!customerId || isLoading}
                  className="w-full px-4 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Fetching...
                    </>
                  ) : (
                    <>
                      <Search size={18} />
                      Fetch Bill
                    </>
                  )}
                </button>

                {amount && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Amount Due
                      </label>
                      <div className="p-5">
                        <div className="text-3xl font-bold text-white mb-1">${parseFloat(amount).toFixed(2)}</div>
                        <div className="text-sm text-gray-400">Payable amount</div>
                      </div>
                    </div>

                    <button
                      onClick={handlePayBill}
                      disabled={!amount || isLoading}
                      className="w-full px-4 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <DollarSign size={18} />
                      Pay Now
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select a biller to pay</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Bills */}
      {bills.length > 0 && (
        <div className="max-w-7xl mx-auto mt-12">
          <h2 className="text-2xl font-bold mb-6">Recent Bills</h2>
          <div className="divide-y divide-white/[0.02]">
            <div className="grid grid-cols-5 gap-4 p-4 border-b border-white/[0.05]">
                <div className="text-sm font-medium text-gray-400">Biller</div>
                <div className="text-sm font-medium text-gray-400">Customer ID</div>
                <div className="text-sm font-medium text-gray-400">Amount</div>
                <div className="text-sm font-medium text-gray-400">Due Date</div>
                <div className="text-sm font-medium text-gray-400">Status</div>
              </div>
              {bills.map((bill, index) => {
                const biller = billers.find((b) => b.id === bill.billerId)
                return (
                  <div
                    key={bill.id}
                    className={`grid grid-cols-5 gap-4 p-4 hover:bg-white/[0.02] transition-all duration-200 ${
                      index === bills.length - 1 ? '' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {biller && (
                        <>
                          <biller.icon className="w-5 h-5 text-primary" />
                          <span className="font-medium">{biller.name}</span>
                        </>
                      )}
                    </div>
                    <div className="text-gray-300">{bill.customerId}</div>
                    <div className="font-semibold">${bill.amount.toFixed(2)}</div>
                    <div className="text-gray-400">{bill.dueDate}</div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          bill.status === 'paid'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}
                      >
                        {bill.status === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false)
          setPendingPayment(null)
        }}
        onConfirm={confirmPayment}
        title="Confirm Bill Payment"
        message={
          pendingPayment
            ? `Pay $${pendingPayment.amount.toFixed(2)} to ${pendingPayment.biller.name} (Customer ID: ${pendingPayment.customerId})?`
            : ''
        }
        confirmText="Pay Now"
        cancelText="Cancel"
        type="info"
        isLoading={isLoading}
      />
    </div>
  )
}

export default UtilityPayments
