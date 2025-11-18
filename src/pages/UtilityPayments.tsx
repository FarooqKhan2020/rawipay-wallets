import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import {
  Search,
  Zap,
  Droplet,
  Wifi,
  CreditCard,
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
  ArrowLeft,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

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
  1: Smartphone, 2: Tv, 3: Phone, 4: Phone, 5: Zap, 6: Droplet, 7: Flame,
  8: CreditCard, 9: DollarSign, 10: Wifi, 11: Flame, 12: Shield, 13: Tv,
  14: FileText, 15: Home, 37: CreditCard, 39: Zap, 40: Shield, 42: Flame, 47: Zap,
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
  const [step, setStep] = useState<'service' | 'provider' | 'form' | 'payment'>('service')
  
  // Form fields
  const [number, setNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [validationParams, setValidationParams] = useState<ValidationParam[]>([])
  const [optionalFields, setOptionalFields] = useState<Record<string, string>>({})
  const [billDetails, setBillDetails] = useState<BillVerification | null>(null)

  const walletAddress = wallets[0]?.address || '0x0000000000000000000000000000000000000000'
  
  // Check if service is simple telecom (only needs number and amount)
  const isSimpleTelecom = selectedProvider && [1, 2, 3, 4].includes(selectedProvider.service_id)

  useEffect(() => {
    fetchProviders()
  }, [])

  useEffect(() => {
    if (selectedService && providers.length > 0) {
      const filtered = providers.filter(p => p.service_id === selectedService)
      setFilteredProviders(filtered)
    }
  }, [selectedService, providers])

  useEffect(() => {
    if (searchQuery) {
      const filtered = filteredProviders.filter(p =>
        p.provider_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredProviders(filtered)
    } else if (selectedService) {
      const filtered = providers.filter(p => p.service_id === selectedService)
      setFilteredProviders(filtered)
    }
  }, [searchQuery])

  // Fetch provider validation only for non-simple services
  useEffect(() => {
    if (selectedProvider && !isSimpleTelecom) {
      fetchProviderValidation()
    }
  }, [selectedProvider])

  const fetchProviders = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('api_token', API_TOKEN)

      const response = await fetch(`${API_BASE}/application/v1/get-provider`, {
        method: 'POST',
        body: formData,
      })
      
      const data = await response.json()
      if (data.status === 'success') {
        setProviders(data.providers)
      }
    } catch (err) {
      setError('Failed to load providers')
    } finally {
      setLoading(false)
    }
  }

  const fetchProviderValidation = async () => {
    if (!selectedProvider) return
    
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('api_token', API_TOKEN)
      formData.append('provider_id', selectedProvider.provider_id.toString())

      const response = await fetch(`${API_BASE}/telecom/v1/provider-validation`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (data.status === 'success' && data.params) {
        setValidationParams(data.params)
      }
    } catch (err) {
      setError('Failed to fetch provider details')
    } finally {
      setLoading(false)
    }
  }

  const handleServiceSelect = (serviceId: number) => {
    setSelectedService(serviceId)
    setStep('provider')
    setError('')
    setSuccess('')
  }

  const handleProviderSelect = (provider: Provider) => {
    setSelectedProvider(provider)
    setStep('form')
    setNumber('')
    setAmount('')
    setOptionalFields({})
    setBillDetails(null)
    setError('')
  }

  const handleBillVerify = async () => {
    if (!selectedProvider) return

    // For simple telecom, go directly to payment
    if (isSimpleTelecom) {
      handlePayment()
      return
    }

    setLoading(true)
    setError('')

    try {
      const formDataObj = new FormData()
      formDataObj.append('api_token', API_TOKEN)
      formDataObj.append('provider_id', selectedProvider.provider_id.toString())
      
      Object.keys(optionalFields).forEach(key => {
        if (optionalFields[key]) {
          formDataObj.append(key, optionalFields[key])
        }
      })

      const response = await fetch(`${API_BASE}/telecom/v1/bill-verify`, {
        method: 'POST',
        body: formDataObj,
      })

      const data = await response.json()

      if (data.status === 'success') {
        setBillDetails(data)
        setNumber(data.number)
        setAmount(data.amount)
        setStep('payment')
      } else {
        setError(data.message || 'Bill verification failed')
      }
    } catch (err) {
      setError('Failed to verify bill. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!selectedProvider || !number || !amount) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const clientId = `${walletAddress.slice(0, 8)}-${Date.now()}`
      let url = `${API_BASE}/telecom/v1/payment?api_token=${API_TOKEN}&number=${number}&amount=${amount}&provider_id=${selectedProvider.provider_id}&client_id=${clientId}`

      // Add optional fields for non-simple services
      if (!isSimpleTelecom && billDetails) {
        if (billDetails.optional1) url += `&optional1=${billDetails.optional1}`
        if (billDetails.optional2) url += `&optional2=${billDetails.optional2}`
        if (billDetails.optional3) url += `&optional3=${billDetails.optional3}`
        if (billDetails.optional4) url += `&optional4=${billDetails.optional4}`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (data.status === 'success') {
        setSuccess(data.message)
        updateSpending(parseFloat(amount))
        
        // Reset form
        setTimeout(() => {
          setStep('service')
          setSelectedService(null)
          setSelectedProvider(null)
          setNumber('')
          setAmount('')
          setOptionalFields({})
          setBillDetails(null)
        }, 3000)
      } else if (data.status === 'pending') {
        setSuccess('Payment is pending. Please check transaction status.')
      } else {
        setError(data.message || 'Payment failed')
      }
    } catch (err) {
      setError('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetToServiceSelection = () => {
    setStep('service')
    setSelectedService(null)
    setSelectedProvider(null)
    setNumber('')
    setAmount('')
    setOptionalFields({})
    setBillDetails(null)
    setError('')
    setSuccess('')
  }

  const goBackToProviders = () => {
    setStep('provider')
    setSelectedProvider(null)
    setNumber('')
    setAmount('')
    setOptionalFields({})
    setBillDetails(null)
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Utility Payments
          </h1>
          <p className="text-muted-foreground">Pay your bills quickly and securely</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-green-500">{success}</p>
          </div>
        )}

        {/* Service Selection */}
        {step === 'service' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {SERVICE_CATEGORIES.map((service) => {
              const Icon = service.icon
              return (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className="group p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {service.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {service.category}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Provider Selection */}
        {step === 'provider' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={resetToServiceSelection}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search providers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-card border-border"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {loading ? (
                <div className="col-span-full flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredProviders.length === 0 ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No providers found
                </div>
              ) : (
                filteredProviders.map((provider) => {
                  const Icon = SERVICE_ICONS[provider.service_id] || CreditCard
                  return (
                    <button
                      key={provider.provider_id}
                      onClick={() => handleProviderSelect(provider)}
                      className="group p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex flex-col items-center gap-3">
                        {provider.provider_icon && provider.provider_icon !== 'https://cdn.mroa.in/' ? (
                          <img
                            src={provider.provider_icon}
                            alt={provider.provider_name}
                            className="h-12 w-12 object-contain"
                          />
                        ) : (
                          <div className="p-2 rounded-full bg-primary/10">
                            <Icon className="h-8 w-8 text-primary" />
                          </div>
                        )}
                        <div className="text-sm font-medium text-center text-foreground group-hover:text-primary transition-colors">
                          {provider.provider_name}
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* Form Step */}
        {step === 'form' && selectedProvider && (
          <div className="max-w-xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b border-border">
                <Button variant="ghost" onClick={goBackToProviders}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground">{selectedProvider.provider_name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedProvider.service_name}</p>
                </div>
              </div>

              {isSimpleTelecom ? (
                // Simple form for Mobile, DTH, Mobile Postpaid, Landline
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      {selectedProvider.service_id === 1 ? 'Mobile Number' : 
                       selectedProvider.service_id === 2 ? 'Customer ID' :
                       selectedProvider.service_id === 3 ? 'Mobile Number' : 'Account Number'}
                    </label>
                    <Input
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="Enter number"
                      className="bg-background border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Amount
                    </label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="bg-background border-border"
                    />
                  </div>

                  <Button
                    className="w-full"
                    disabled={loading || !number || !amount}
                    onClick={handleBillVerify}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Pay Now'
                    )}
                  </Button>
                </div>
              ) : (
                // Complex form for other services
                <div className="space-y-4">
                  {validationParams.map((param) => (
                    <div key={param.name}>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        {param.placeholder}
                      </label>
                      <Input
                        value={optionalFields[param.name] || ''}
                        onChange={(e) => setOptionalFields({ ...optionalFields, [param.name]: e.target.value })}
                        placeholder={param.placeholder}
                        className="bg-background border-border"
                      />
                    </div>
                  ))}

                  <Button
                    className="w-full"
                    disabled={loading || !Object.values(optionalFields).some(v => v)}
                    onClick={handleBillVerify}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify Bill'
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Confirmation */}
        {step === 'payment' && selectedProvider && billDetails && (
          <div className="max-w-xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              <div className="text-center pb-4 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">Bill Details</h2>
                <p className="text-sm text-muted-foreground">{selectedProvider.provider_name}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Customer Name</span>
                  <span className="font-medium text-foreground">{billDetails.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Account Number</span>
                  <span className="font-medium text-foreground">{billDetails.number}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Due Date</span>
                  <span className="font-medium text-foreground">{billDetails.duedate}</span>
                </div>
                <div className="flex justify-between py-3 bg-primary/10 rounded-lg px-4">
                  <span className="font-semibold text-foreground">Amount to Pay</span>
                  <span className="font-bold text-primary text-xl">₹{billDetails.amount}</span>
                </div>
              </div>

              <Button
                className="w-full"
                disabled={loading}
                onClick={handlePayment}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  'Confirm & Pay'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UtilityPayments
