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
  ArrowLeft,
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

const SERVICE_CATEGORIES = [
  { id: 1, name: 'Mobile Recharge', icon: Smartphone, category: 'Telecom' },
  { id: 2, name: 'DTH', icon: Tv, category: 'Telecom' },
  { id: 3, name: 'Mobile Postpaid', icon: Phone, category: 'Telecom' },
  { id: 4, name: 'Landline', icon: Phone, category: 'Telecom' },
  { id: 5, name: 'Electricity', icon: Zap, category: 'Utilities' },
  { id: 39, name: 'Electricity Offline', icon: Zap, category: 'Utilities' },
  { id: 47, name: 'Prepaid Meter', icon: Zap, category: 'Utilities' },
  { id: 6, name: 'Water', icon: Droplet, category: 'Utilities' },
  { id: 7, name: 'Pipe Gas', icon: Flame, category: 'Utilities' },
  { id: 11, name: 'LPG Cylinder', icon: Flame, category: 'Utilities' },
  { id: 42, name: 'LPG Offline', icon: Flame, category: 'Utilities' },
  { id: 10, name: 'Broadband', icon: Wifi, category: 'Internet' },
  { id: 13, name: 'Cable TV', icon: Tv, category: 'Entertainment' },
  { id: 8, name: 'FASTag', icon: CreditCard, category: 'Financial' },
  { id: 9, name: 'Loan Repayment', icon: DollarSign, category: 'Financial' },
  { id: 37, name: 'Credit Card', icon: CreditCard, category: 'Financial' },
  { id: 12, name: 'Insurance', icon: Shield, category: 'Financial' },
  { id: 40, name: 'Insurance Offline', icon: Shield, category: 'Financial' },
  { id: 14, name: 'Subscription', icon: FileText, category: 'Services' },
  { id: 15, name: 'Housing Society', icon: Home, category: 'Services' },
]

const SERVICE_ICONS: Record<number, any> = {
  1: Smartphone,
  2: Tv,
  3: Phone,
  4: Phone,
  5: Zap,
  6: Droplet,
  7: Flame,
  8: CreditCard,
  9: DollarSign,
  10: Wifi,
  11: Flame,
  12: Shield,
  13: Tv,
  14: FileText,
  15: Home,
  37: CreditCard,
  39: Zap,
  40: Shield,
  42: Flame,
  47: Zap,
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
    
    // For non-mobile/DTH services, fetch validation params
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
      console.error('Failed to fetch validation params:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyBill = async () => {
    if (!selectedProvider || !number) {
      setError('Please enter customer number')
      return
    }

    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('api_token', API_TOKEN)
      formData.append('provider_id', selectedProvider.provider_id.toString())
      formData.append('number', number)
      
      validationParams.forEach((param, index) => {
        const value = optionalFields[param.name] || ''
        if (value) {
          formData.append(param.name, value)
        }
      })

      const response = await fetch(`${API_BASE}/telecom/v1/bill-verify`, {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (data.status === 'success') {
        setBillDetails(data)
        setShowBillDetails(true)
        setAmount(data.amount)
      } else {
        setError(data.message || 'Failed to verify bill')
      }
    } catch (err) {
      setError('Failed to verify bill. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const generateClientId = () => {
    return `${walletAddress.slice(0, 8)}_${Date.now()}`
  }

  const handlePayment = async () => {
    if (!selectedProvider || !number || !amount) {
      setError('Please fill all required fields')
      return
    }

    const balance = wallets[0]?.balance || 0
    const amountNum = parseFloat(amount)

    if (balance < amountNum) {
      setError('Insufficient balance')
      return
    }

    setLoading(true)
    setError('')
    try {
      const clientId = generateClientId()
      const params = new URLSearchParams({
        api_token: API_TOKEN,
        number,
        amount,
        provider_id: selectedProvider.provider_id.toString(),
        client_id: clientId,
      })

      // Add optional fields for non-mobile/DTH services
      if (billDetails) {
        if (billDetails.optional1) params.append('optional1', billDetails.optional1)
        if (billDetails.optional2) params.append('optional2', billDetails.optional2)
        if (billDetails.optional3) params.append('optional3', billDetails.optional3)
        if (billDetails.optional4) params.append('optional4', billDetails.optional4)
      }

      const response = await fetch(`${API_BASE}/telecom/v1/payment?${params.toString()}`)
      const data = await response.json()

      if (data.status === 'success') {
        setSuccess(data.message)
        updateSpending(amountNum)
        
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

  const searchFiltered = filteredProviders.filter(p =>
    p.provider_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const availableServices = SERVICE_CATEGORIES.filter(service => 
    providers.some(p => p.service_id === service.id)
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          {selectedService && (
            <button
              onClick={() => {
                setSelectedService(null)
                setSelectedProvider(null)
                setSearchQuery('')
              }}
              className="p-2 rounded-lg bg-card border border-border hover:bg-accent transition-colors"
            >
              <ArrowLeft size={20} className="text-foreground" />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {selectedService 
                ? SERVICE_CATEGORIES.find(s => s.id === selectedService)?.name 
                : 'Utility Payments'}
            </h1>
            <p className="text-muted-foreground">
              {selectedService 
                ? 'Select a provider to continue' 
                : 'Choose a service to get started'}
            </p>
          </div>
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
          {/* Left Panel - Service/Provider Selection */}
          <div className="lg:col-span-2">
            {!selectedService ? (
              /* Service Categories Grid */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {availableServices.map((service) => {
                  const Icon = service.icon
                  return (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className="group p-6 bg-card border border-border rounded-2xl hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-4"
                    >
                      <div className="p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="text-primary" size={32} />
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold text-foreground mb-1">{service.name}</h3>
                        <p className="text-xs text-muted-foreground">{service.category}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              /* Providers Grid */
              <>
                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                      type="text"
                      placeholder="Search providers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {loading && !selectedProvider ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-primary" size={40} />
                  </div>
                ) : searchFiltered.length === 0 ? (
                  <div className="text-center py-12 bg-card rounded-2xl border border-border">
                    <AlertCircle className="mx-auto mb-4 text-muted-foreground" size={48} />
                    <p className="text-foreground font-medium mb-2">No providers found</p>
                    <p className="text-muted-foreground text-sm">Try adjusting your search</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchFiltered.map((provider) => {
                      const Icon = SERVICE_ICONS[provider.service_id] || Building
                      return (
                        <button
                          key={provider.provider_id}
                          onClick={() => handleProviderSelect(provider)}
                          className="p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all text-left group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                              {provider.provider_icon ? (
                                <img
                                  src={provider.provider_icon}
                                  alt={provider.provider_name}
                                  className="w-12 h-12 object-contain rounded-lg"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <Icon className="text-primary" size={24} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                                {provider.provider_name}
                              </h3>
                              <p className="text-sm text-muted-foreground">{provider.service_name}</p>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Panel - Payment Form */}
          <div className="lg:sticky lg:top-6 h-fit">
            {selectedProvider ? (
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    {selectedProvider.provider_icon ? (
                      <img
                        src={selectedProvider.provider_icon}
                        alt={selectedProvider.provider_name}
                        className="w-12 h-12 object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building className="text-primary" size={24} />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-foreground">{selectedProvider.provider_name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedProvider.service_name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProvider(null)}
                    className="p-1 hover:bg-accent rounded-lg transition-colors"
                  >
                    <X size={20} className="text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Customer Number */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Customer Number *
                    </label>
                    <input
                      type="text"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="Enter customer number"
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Dynamic Optional Fields for non-Mobile/DTH */}
                  {validationParams.length > 0 && validationParams.map((param) => (
                    <div key={param.name}>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {param.placeholder}
                      </label>
                      <input
                        type="text"
                        value={optionalFields[param.name] || ''}
                        onChange={(e) => setOptionalFields({
                          ...optionalFields,
                          [param.name]: e.target.value
                        })}
                        placeholder={param.placeholder}
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  ))}

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Amount *
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      disabled={showBillDetails}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    />
                  </div>

                  {/* Bill Details */}
                  {showBillDetails && billDetails && (
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                      <h4 className="font-semibold text-foreground mb-3">Bill Details</h4>
                      <div className="space-y-2 text-sm">
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

                  {/* Wallet Balance */}
                  <div className="p-4 bg-accent/50 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Available Balance</span>
                      <span className="text-lg font-semibold text-foreground">
                        ${wallets[0]?.balance?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {validationParams.length > 0 && !showBillDetails ? (
                    <button
                      onClick={handleVerifyBill}
                      disabled={loading || !number}
                      className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : null}
                      Verify Bill
                    </button>
                  ) : (
                    <button
                      onClick={handlePayment}
                      disabled={loading || !number || !amount}
                      className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : null}
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="text-primary" size={32} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Select a Provider</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedService 
                      ? 'Choose a provider from the list to make a payment'
                      : 'Select a service first to see available providers'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UtilityPayments
