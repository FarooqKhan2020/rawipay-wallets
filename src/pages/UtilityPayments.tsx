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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 md:mb-12 text-center">
            <div className="inline-block mb-4 p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm animate-scale-in">
              <DollarSign className="h-8 w-8 md:h-10 md:w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground">
              Utility Payments
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Pay your bills quickly and securely with cryptocurrency. Simple, fast, and convenient.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-3 backdrop-blur-sm animate-fade-in shadow-lg">
              <div className="p-2 rounded-full bg-destructive/20">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <p className="text-destructive font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3 backdrop-blur-sm animate-fade-in shadow-lg">
              <div className="p-2 rounded-full bg-green-500/20">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-green-500 font-medium">{success}</p>
            </div>
          )}

          {/* Service Selection */}
          {step === 'service' && (
            <div>
              <div className="mb-6 text-center">
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">Select Service</h2>
                <p className="text-sm text-muted-foreground">Choose the type of bill you want to pay</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5 animate-fade-in">
                {SERVICE_CATEGORIES.map((service, index) => {
                  const Icon = service.icon
                  return (
                    <button
                      key={service.id}
                      onClick={() => handleServiceSelect(service.id)}
                      style={{ animationDelay: `${index * 50}ms` }}
                      className="group relative p-5 md:p-6 bg-card/80 backdrop-blur-md border-2 border-border/50 rounded-2xl hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden animate-fade-in"
                    >
                      {/* Animated gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Shine effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:animate-[slide-in-right_0.8s_ease-out]" />
                      </div>

                      <div className="relative flex flex-col items-center gap-3 md:gap-4">
                        <div className="relative">
                          {/* Icon container with glow */}
                          <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative p-3 md:p-4 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 group-hover:from-primary/25 group-hover:to-primary/15 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                            <Icon className="h-7 w-7 md:h-8 md:w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-sm md:text-base text-foreground group-hover:text-primary transition-colors duration-300">
                            {service.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 px-2 py-1 rounded-full bg-muted/30 inline-block group-hover:bg-primary/10 transition-colors duration-300">
                            {service.category}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Provider Selection */}
          {step === 'provider' && (
            <div className="space-y-6 md:space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
                <Button
                  variant="ghost"
                  onClick={resetToServiceSelection}
                  className="flex items-center justify-center gap-2 hover:bg-primary/10 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <div className="flex-1">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10 group-focus-within:text-primary transition-colors duration-300" />
                    <Input
                      placeholder="Search providers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="relative pl-12 h-14 bg-card/80 backdrop-blur-md border-2 border-border/50 focus:border-primary/50 rounded-xl text-base shadow-lg transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
                {loading ? (
                  <div className="col-span-full flex flex-col justify-center items-center py-20">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse" />
                      <Loader2 className="relative h-12 w-12 md:h-14 md:w-14 animate-spin text-primary mb-4" />
                    </div>
                    <p className="text-muted-foreground font-medium">Loading providers...</p>
                  </div>
                ) : filteredProviders.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-muted/30 rounded-full blur-2xl" />
                      <div className="relative p-6 rounded-full bg-muted/50 backdrop-blur-sm">
                        <AlertCircle className="h-12 w-12 text-muted-foreground" />
                      </div>
                    </div>
                    <p className="text-xl font-semibold text-foreground mb-2">No providers found</p>
                    <p className="text-base text-muted-foreground">Try adjusting your search or select a different service</p>
                  </div>
                ) : (
                  filteredProviders.map((provider, index) => {
                    const Icon = SERVICE_ICONS[provider.service_id] || CreditCard
                    return (
                      <button
                        key={provider.provider_id}
                        onClick={() => handleProviderSelect(provider)}
                        style={{ animationDelay: `${index * 30}ms` }}
                        className="group relative p-4 md:p-5 bg-card/80 backdrop-blur-md border-2 border-border/50 rounded-2xl hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden animate-fade-in"
                      >
                        {/* Animated gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Shine effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:animate-[slide-in-right_0.8s_ease-out]" />
                        </div>

                        <div className="relative flex flex-col items-center gap-3 md:gap-4">
                          {provider.provider_icon && provider.provider_icon !== 'https://cdn.mroa.in/' ? (
                            <div className="relative h-14 w-14 md:h-16 md:w-16 rounded-xl bg-background/70 backdrop-blur-sm p-2 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <img
                                src={provider.provider_icon}
                                alt={provider.provider_name}
                                className="relative h-full w-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="relative">
                              <div className="absolute inset-0 bg-primary/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="relative p-3 md:p-4 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 group-hover:from-primary/25 group-hover:to-primary/15 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <Icon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                              </div>
                            </div>
                          )}
                          <div className="text-sm md:text-base font-semibold text-center text-foreground group-hover:text-primary transition-colors line-clamp-2 duration-300">
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
            <div className="max-w-2xl mx-auto animate-fade-in">
              <div className="relative bg-card/80 backdrop-blur-xl border-2 border-border/50 rounded-3xl p-6 md:p-10 space-y-8 shadow-2xl overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-10" />
                
                <div className="flex items-center gap-4 pb-6 border-b-2 border-border/50">
                  <Button 
                    variant="ghost" 
                    onClick={goBackToProviders} 
                    className="hover:bg-primary/10 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">{selectedProvider.provider_name}</h2>
                    <p className="text-sm md:text-base text-muted-foreground mt-1 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse" />
                      {selectedProvider.service_name}
                    </p>
                  </div>
                </div>

                {isSimpleTelecom ? (
                  // Simple form for Mobile, DTH, Mobile Postpaid, Landline
                  <div className="space-y-6 md:space-y-8">
                    <div className="group">
                      <label className="block text-base md:text-lg font-bold mb-3 text-foreground flex items-center gap-2">
                        <Phone className="h-5 w-5 text-primary" />
                        {selectedProvider.service_id === 1 ? 'Mobile Number' : 
                         selectedProvider.service_id === 2 ? 'Customer ID' :
                         selectedProvider.service_id === 3 ? 'Mobile Number' : 'Account Number'}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                        <Input
                          value={number}
                          onChange={(e) => setNumber(e.target.value)}
                          placeholder="Enter number"
                          className="relative h-14 bg-background/70 backdrop-blur-sm border-2 border-border/50 focus:border-primary/60 rounded-xl text-base shadow-lg transition-all duration-300"
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-base md:text-lg font-bold mb-3 text-foreground flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        Amount (₹)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                        <Input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="relative h-14 bg-background/70 backdrop-blur-sm border-2 border-border/50 focus:border-primary/60 rounded-xl text-base shadow-lg transition-all duration-300"
                        />
                      </div>
                    </div>

                    <Button
                      className="w-full h-14 md:h-16 text-base md:text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                      disabled={loading || !number || !amount}
                      onClick={handleBillVerify}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-5 w-5" />
                          Pay Now
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  // Complex form for other services
                  <div className="space-y-6 md:space-y-8">
                    {validationParams.map((param, index) => (
                      <div key={param.name} className="group" style={{ animationDelay: `${index * 100}ms` }}>
                        <label className="block text-base md:text-lg font-bold mb-3 text-foreground flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          {param.placeholder}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                          <Input
                            value={optionalFields[param.name] || ''}
                            onChange={(e) => setOptionalFields({ ...optionalFields, [param.name]: e.target.value })}
                            placeholder={param.placeholder}
                            className="relative h-14 bg-background/70 backdrop-blur-sm border-2 border-border/50 focus:border-primary/60 rounded-xl text-base shadow-lg transition-all duration-300"
                          />
                        </div>
                      </div>
                    ))}

                    <Button
                      className="w-full h-14 md:h-16 text-base md:text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                      disabled={loading || !Object.values(optionalFields).some(v => v)}
                      onClick={handleBillVerify}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-5 w-5" />
                          Verify Bill
                        </>
                      )}
                    </Button>
                  </div>
                )}
            </div>
          </div>
        )}

          {/* Payment Confirmation */}
          {step === 'payment' && selectedProvider && billDetails && (
            <div className="max-w-2xl mx-auto animate-fade-in">
              <div className="relative bg-card/80 backdrop-blur-xl border-2 border-border/50 rounded-3xl p-6 md:p-10 space-y-8 md:space-y-10 shadow-2xl overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />
                
                <div className="text-center pb-6 border-b-2 border-border/50">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-green-500/30 rounded-full blur-2xl animate-pulse" />
                    <div className="relative p-5 rounded-2xl bg-gradient-to-br from-green-500/20 to-primary/10 backdrop-blur-sm animate-scale-in">
                      <CheckCircle className="h-14 w-14 md:h-16 md:w-16 text-green-500" />
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 animate-fade-in">Bill Details Verified</h2>
                  <p className="text-base md:text-lg text-muted-foreground flex items-center justify-center gap-2">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    {selectedProvider.provider_name}
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="flex justify-between items-center py-4 md:py-5 border-b-2 border-border/30 group hover:border-primary/30 transition-colors duration-300">
                    <span className="text-base md:text-lg text-muted-foreground font-medium">Customer Name</span>
                    <span className="font-bold text-base md:text-lg text-foreground group-hover:text-primary transition-colors duration-300">{billDetails.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 md:py-5 border-b-2 border-border/30 group hover:border-primary/30 transition-colors duration-300">
                    <span className="text-base md:text-lg text-muted-foreground font-medium">Account Number</span>
                    <span className="font-bold text-base md:text-lg text-foreground group-hover:text-primary transition-colors duration-300">{billDetails.number}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 md:py-5 border-b-2 border-border/30 group hover:border-primary/30 transition-colors duration-300">
                    <span className="text-base md:text-lg text-muted-foreground font-medium">Due Date</span>
                    <span className="font-bold text-base md:text-lg text-foreground group-hover:text-primary transition-colors duration-300">{billDetails.duedate}</span>
                  </div>
                  <div className="relative mt-6 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 animate-pulse" />
                    <div className="relative flex justify-between items-center py-5 md:py-6 bg-gradient-to-br from-primary/15 to-primary/5 backdrop-blur-sm rounded-2xl px-5 md:px-8 shadow-lg">
                      <span className="font-bold text-lg md:text-xl text-foreground flex items-center gap-2">
                        <DollarSign className="h-6 w-6 text-primary" />
                        Amount to Pay
                      </span>
                      <span className="font-bold text-primary text-3xl md:text-4xl animate-pulse">₹{billDetails.amount}</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full h-14 md:h-16 text-base md:text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  disabled={loading}
                  onClick={handlePayment}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-6 w-6" />
                      Confirm & Pay
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UtilityPayments
