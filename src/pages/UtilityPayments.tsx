import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import {
  Search,
  Zap,
  Droplet,
  Wifi,
  CreditCard,
  Building,
  Phone,
  Tv,
  FileText,
  CheckCircle,
  Smartphone,
  DollarSign,
  Loader2,
  AlertCircle,
  Flame,
  Home,
  Shield,
  X,
  ArrowRight,
} from 'lucide-react'

interface Provider {
  provider_id: number
  provider_name: string
  service_id: number
  service_name: string
  provider_icon: string
}

interface ValidationParam {
  name: string
  placeholder: string
}

interface BillVerification {
  provider_name: string
  number: string
  amount: string
  name: string
  duedate: string
  provider_id: string
  optional1?: string
  optional2?: string
  optional3?: string
  optional4?: string
}

const API_TOKEN = 'tQNo599kUDOCtYp4Jm40dzVIYUFglSTUMiHCHql1X6IhdVFLqVIL3kt8XYsp'
const API_BASE = 'https://auth.scrizapay.in/api'

const SERVICE_ICONS: Record<number, any> = {
  1: Smartphone, // Mobile
  2: Tv, // DTH
  3: Phone, // Mobile Postpaid
  4: Phone, // Landline
  5: Zap, // Electricity
  6: Droplet, // Water
  7: Flame, // Pipe Gas
  8: CreditCard, // FASTag
  9: DollarSign, // Loan Repayment
  10: Wifi, // Broadband
  11: Flame, // LPG Cylinder
  12: Shield, // Insurance
  13: Tv, // Cable TV
  14: FileText, // Subscription
  15: Home, // Housing Society
  37: CreditCard, // Credit Card
  39: Zap, // Electricity Offline
  40: Shield, // Insurance Premium Offline
  42: Flame, // LPG Cylinder Offline
  47: Zap, // Prepaid Meter
}

function UtilityPayments() {
  const { wallets, updateSpending } = useApp()
  const [providers, setProviders] = useState<Provider[]>([])
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([])
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Form fields
  const [number, setNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [validationParams, setValidationParams] = useState<ValidationParam[]>([])
  const [optionalFields, setOptionalFields] = useState<Record<string, string>>({})
  const [billDetails, setBillDetails] = useState<BillVerification | null>(null)
  const [showBillDetails, setShowBillDetails] = useState(false)

  const walletAddress = wallets[0]?.address || '0x0000000000000000000000000000000000000000'

  useEffect(() => {
    fetchProviders()
  }, [])

  useEffect(() => {
    if (selectedService) {
      const filtered = providers.filter(p => p.service_id === selectedService)
      setFilteredProviders(filtered)
    } else {
      setFilteredProviders(providers)
    }
  }, [selectedService, providers])

  const fetchProviders = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/application/v1/get-provider?api_token=${API_TOKEN}`, {
        method: 'POST',
      })
      const data = await response.json()
      if (data.status === 'success') {
        setProviders(data.providers)
        setFilteredProviders(data.providers)
      }
    } catch (err) {
      setError('Failed to fetch providers')
    } finally {
      setLoading(false)
    }
  }

  const handleProviderSelect = async (provider: Provider) => {
    setSelectedProvider(provider)
    setError('')
    setSuccess('')
    setBillDetails(null)
    setShowBillDetails(false)
    setNumber('')
    setAmount('')
    setOptionalFields({})
    
    // For services other than Mobile and DTH, fetch validation params
    if (provider.service_id !== 1 && provider.service_id !== 2) {
      await fetchValidationParams(provider.provider_id)
    }
  }

  const fetchValidationParams = async (providerId: number) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('api_token', API_TOKEN)
      formData.append('provider_id', providerId.toString())

      const response = await fetch(`${API_BASE}/telecom/v1/provider-validation`, {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (data.status === 'success' && data.is_validation === 1) {
        setValidationParams(data.params || [])
      }
    } catch (err) {
      setError('Failed to fetch validation parameters')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyBill = async () => {
    if (!selectedProvider || !number) {
      setError('Please fill all required fields')
      return
    }

    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('api_token', API_TOKEN)
      formData.append('provider_id', selectedProvider.provider_id.toString())
      
      validationParams.forEach((param, index) => {
        const fieldValue = optionalFields[param.name] || ''
        formData.append(`optional${index + 1}`, fieldValue)
      })

      const response = await fetch(`${API_BASE}/telecom/v1/bill-verify`, {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      
      if (data.status === 'success') {
        setBillDetails(data)
        setAmount(data.amount)
        setShowBillDetails(true)
      } else {
        setError(data.message || 'Failed to verify bill')
      }
    } catch (err) {
      setError('Failed to verify bill')
    } finally {
      setLoading(false)
    }
  }

  const generateClientId = () => {
    return `${walletAddress.slice(0, 8)}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const handlePayment = async () => {
    if (!selectedProvider || !number || !amount) {
      setError('Please fill all required fields')
      return
    }

    const currentBalance = wallets[0]?.balance || 0
    const paymentAmount = parseFloat(amount)

    if (currentBalance < paymentAmount) {
      setError('Insufficient balance')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const clientId = generateClientId()
      let url = `${API_BASE}/telecom/v1/payment?api_token=${API_TOKEN}&number=${number}&amount=${amount}&provider_id=${selectedProvider.provider_id}&client_id=${clientId}`

      // Add optional fields for non-mobile/DTH services
      if (selectedProvider.service_id !== 1 && selectedProvider.service_id !== 2 && billDetails) {
        if (billDetails.optional1) url += `&optional1=${billDetails.optional1}`
        if (billDetails.optional2) url += `&optional2=${billDetails.optional2}`
        if (billDetails.optional3) url += `&optional3=${billDetails.optional3}`
        if (billDetails.optional4) url += `&optional4=${billDetails.optional4}`
        url += `&payment_mode=UPI`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (data.status === 'success') {
        setSuccess(data.message)
        updateSpending(paymentAmount)
        // Reset form
        setTimeout(() => {
          setSelectedProvider(null)
          setNumber('')
          setAmount('')
          setBillDetails(null)
          setShowBillDetails(false)
          setOptionalFields({})
        }, 3000)
      } else if (data.status === 'pending') {
        setSuccess('Payment is pending. Please check back later.')
      } else {
        setError(data.message || 'Payment failed')
      }
    } catch (err) {
      setError('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const services = Array.from(new Set(providers.map(p => ({ id: p.service_id, name: p.service_name }))))
    .sort((a, b) => a.id - b.id)

  const searchFiltered = filteredProviders.filter(p =>
    p.provider_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Utility Payments</h1>
          <p className="text-muted-foreground">Pay bills for mobile, electricity, water, and more</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
            <CheckCircle className="text-green-500" size={20} />
            <p className="text-green-500 text-sm">{success}</p>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-destructive" size={20} />
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Service Selection */}
          <div className="lg:col-span-2">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  placeholder="Search providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Service Categories */}
            <div className="mb-6 flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedService(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedService === null
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white dark:bg-gray-900 text-foreground hover:bg-primary/10 border border-gray-200 dark:border-gray-700'
                }`}
              >
                All Services
              </button>
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedService === service.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white dark:bg-gray-900 text-foreground hover:bg-primary/10 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {service.name}
                </button>
              ))}
            </div>

            {/* Providers Grid */}
            {loading && !selectedProvider ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {searchFiltered.map((provider) => {
                  const Icon = SERVICE_ICONS[provider.service_id] || Building
                  return (
                    <button
                      key={provider.provider_id}
                      onClick={() => handleProviderSelect(provider)}
                      className={`p-4 bg-white dark:bg-gray-900 border rounded-xl transition-all hover:shadow-lg hover:scale-105 ${
                        selectedProvider?.provider_id === provider.provider_id
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center gap-3">
                        {provider.provider_icon && provider.provider_icon !== 'https://cdn.mroa.in/' ? (
                          <img 
                            src={provider.provider_icon} 
                            alt={provider.provider_name}
                            className="w-12 h-12 object-contain"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="text-primary" size={24} />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground text-sm">{provider.provider_name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{provider.service_name}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right Panel - Payment Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                {selectedProvider ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-foreground">Payment Details</h3>
                      <button
                        onClick={() => {
                          setSelectedProvider(null)
                          setBillDetails(null)
                          setShowBillDetails(false)
                        }}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <X size={18} className="text-muted-foreground" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Provider Info */}
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Selected Provider</p>
                        <p className="font-medium text-foreground">{selectedProvider.provider_name}</p>
                      </div>

                      {/* Customer Number */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {selectedProvider.service_id === 1 ? 'Mobile Number' : 'Customer Number'}
                        </label>
                        <input
                          type="text"
                          value={number}
                          onChange={(e) => setNumber(e.target.value)}
                          placeholder="Enter number"
                          className="w-full px-4 py-2 bg-background border border-gray-200 dark:border-gray-700 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      {/* Optional Fields for non-Mobile/DTH */}
                      {validationParams.map((param, index) => (
                        <div key={index}>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            {param.placeholder}
                          </label>
                          <input
                            type="text"
                            value={optionalFields[param.name] || ''}
                            onChange={(e) => setOptionalFields({ ...optionalFields, [param.name]: e.target.value })}
                            placeholder={param.placeholder}
                            className="w-full px-4 py-2 bg-background border border-gray-200 dark:border-gray-700 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      ))}

                      {/* Amount (editable for Mobile/DTH) */}
                      {(selectedProvider.service_id === 1 || selectedProvider.service_id === 2) && (
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Amount</label>
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full px-4 py-2 bg-background border border-gray-200 dark:border-gray-700 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      )}

                      {/* Bill Details */}
                      {showBillDetails && billDetails && (
                        <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg space-y-2">
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle className="text-green-500" size={18} />
                            <p className="font-medium text-green-500">Bill Verified</p>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Name:</span>
                              <span className="text-foreground font-medium">{billDetails.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Amount:</span>
                              <span className="text-foreground font-medium">₹{billDetails.amount}</span>
                            </div>
                            {billDetails.duedate && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Due Date:</span>
                                <span className="text-foreground font-medium">{billDetails.duedate}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="space-y-3 pt-4">
                        {/* Verify Bill Button (for non-Mobile/DTH) */}
                        {selectedProvider.service_id !== 1 && selectedProvider.service_id !== 2 && !showBillDetails && (
                          <button
                            onClick={handleVerifyBill}
                            disabled={loading || !number}
                            className="w-full py-3 bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {loading ? (
                              <Loader2 className="animate-spin" size={18} />
                            ) : (
                              <>
                                <FileText size={18} />
                                Verify Bill
                              </>
                            )}
                          </button>
                        )}

                        {/* Pay Button */}
                        {((selectedProvider.service_id === 1 || selectedProvider.service_id === 2) || showBillDetails) && (
                          <button
                            onClick={handlePayment}
                            disabled={loading || !number || !amount}
                            className="w-full py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/70 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                          >
                            {loading ? (
                              <Loader2 className="animate-spin" size={18} />
                            ) : (
                              <>
                                Pay ₹{amount || '0'}
                                <ArrowRight size={18} />
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Balance Info */}
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Available Balance:</span>
                          <span className="font-medium text-foreground">₹{(wallets[0]?.balance || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="text-primary" size={32} />
                    </div>
                    <p className="text-muted-foreground">Select a provider to continue</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UtilityPayments
