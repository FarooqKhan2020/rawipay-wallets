import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import ConfirmModal from '../components/ConfirmModal'
import {
  Search,
  ShoppingCart,
  Star,
  ChevronRight,
  X,
  Plus,
  Minus,
  MapPin,
  CreditCard,
  Package,
  CheckCircle,
  Truck,
  History,
} from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  fullDescription: string
  originalPrice: number
  price: number
  discount: number
  image: string
  category: string
  rating: number
  reviews: number
  inStock: boolean
  brand?: string
  features?: string[]
}

interface CartItem {
  product: Product
  quantity: number
}

interface ShippingDetails {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
}

function Marketplace() {
  const { wallets, updateSpending } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showCart, setShowCart] = useState(false)
  const [showShipping, setShowShipping] = useState(false)
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  })
  const [showOrderHistory, setShowOrderHistory] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const API_BASE = 'http://localhost:3001/api'
  const walletAddress = wallets[0]?.address || '0xBD77...D599B8'

  const products: Product[] = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      description: 'High-quality noise-cancelling headphones',
      fullDescription: 'Experience premium sound quality with our wireless noise-cancelling headphones. Features 30-hour battery life, quick charge, and superior comfort for extended listening sessions.',
      originalPrice: 1999,
      price: 999,
      discount: 50,
      image: '🎧',
      category: 'Electronics',
      rating: 4.8,
      reviews: 1245,
      inStock: true,
      brand: 'AudioTech',
      features: ['Active Noise Cancellation', '30h Battery Life', 'Quick Charge', 'Bluetooth 5.0'],
    },
    {
      id: '2',
      name: 'Smart Watch Pro',
      description: 'Advanced fitness tracking and health monitoring',
      fullDescription: 'Track your fitness goals with precision. Monitor heart rate, sleep patterns, and daily activity. Water-resistant design with 7-day battery life.',
      originalPrice: 2999,
      price: 1499,
      discount: 50,
      image: '⌚',
      category: 'Electronics',
      rating: 4.9,
      reviews: 892,
      inStock: true,
      brand: 'FitTech',
      features: ['Heart Rate Monitor', 'Sleep Tracking', 'Water Resistant', '7-Day Battery'],
    },
    {
      id: '3',
      name: 'Gaming Laptop',
      description: 'High-performance gaming laptop with RTX 4080',
      fullDescription: 'Dominate the gaming world with this powerful laptop. Features RTX 4080 GPU, 32GB RAM, 1TB SSD, and a 144Hz display for the ultimate gaming experience.',
      originalPrice: 9999,
      price: 7999,
      discount: 20,
      image: '💻',
      category: 'Electronics',
      rating: 4.7,
      reviews: 456,
      inStock: true,
      brand: 'GameMaster',
      features: ['RTX 4080 GPU', '32GB RAM', '1TB SSD', '144Hz Display'],
    },
    {
      id: '4',
      name: 'Designer Sunglasses',
      description: 'Luxury polarized sunglasses with UV protection',
      fullDescription: 'Protect your eyes in style with these premium polarized sunglasses. 100% UV protection with scratch-resistant lenses and lightweight frame.',
      originalPrice: 399,
      price: 199,
      discount: 50,
      image: '🕶️',
      category: 'Fashion',
      rating: 4.6,
      reviews: 678,
      inStock: true,
      brand: 'StyleVision',
      features: ['Polarized Lenses', 'UV Protection', 'Scratch Resistant', 'Lightweight'],
    },
    {
      id: '5',
      name: 'Wireless Earbuds',
      description: 'True wireless earbuds with active noise cancellation',
      fullDescription: 'Immerse yourself in music with these premium wireless earbuds. Active noise cancellation, 24-hour battery life, and crystal-clear sound quality.',
      originalPrice: 299,
      price: 149,
      discount: 50,
      image: '🎵',
      category: 'Electronics',
      rating: 4.5,
      reviews: 1234,
      inStock: true,
      brand: 'SoundWave',
      features: ['Active Noise Cancellation', '24h Battery', 'IPX7 Waterproof', 'Touch Controls'],
    },
    {
      id: '6',
      name: 'Mechanical Keyboard',
      description: 'RGB mechanical keyboard with Cherry MX switches',
      fullDescription: 'Type with precision and style. RGB backlighting, Cherry MX switches, and durable construction make this the perfect keyboard for gamers and professionals.',
      originalPrice: 359,
      price: 179,
      discount: 50,
      image: '⌨️',
      category: 'Electronics',
      rating: 4.8,
      reviews: 567,
      inStock: true,
      brand: 'KeyMaster',
      features: ['Cherry MX Switches', 'RGB Backlighting', 'Durable Build', 'Programmable Keys'],
    },
    {
      id: '7',
      name: 'Smartphone Pro Max',
      description: 'Latest flagship smartphone with 5G support',
      fullDescription: 'Experience the future of mobile technology. 5G connectivity, 108MP camera, 120Hz display, and all-day battery life in a premium design.',
      originalPrice: 4999,
      price: 3999,
      discount: 20,
      image: '📱',
      category: 'Electronics',
      rating: 4.9,
      reviews: 2345,
      inStock: true,
      brand: 'TechPhone',
      features: ['5G Connectivity', '108MP Camera', '120Hz Display', 'All-Day Battery'],
    },
    {
      id: '8',
      name: 'Running Shoes',
      description: 'Comfortable running shoes with advanced cushioning',
      fullDescription: 'Run longer and faster with these premium running shoes. Advanced cushioning technology, breathable mesh upper, and durable outsole for all terrains.',
      originalPrice: 599,
      price: 299,
      discount: 50,
      image: '👟',
      category: 'Fashion',
      rating: 4.7,
      reviews: 890,
      inStock: true,
      brand: 'RunFast',
      features: ['Advanced Cushioning', 'Breathable Mesh', 'Durable Outsole', 'Lightweight'],
    },
  ]

  const categories = ['All', 'Electronics', 'Fashion']

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE}/marketplace/orders/${walletAddress}`)
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { product, quantity: 1 }]
    })
    setSelectedProduct(null)
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) => {
      const item = prevCart.find((item) => item.product.id === productId)
      if (!item) return prevCart

      const newQuantity = item.quantity + delta
      if (newQuantity <= 0) {
        return prevCart.filter((item) => item.product.id !== productId)
      }

      return prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    })
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shippingCost = cart.length > 0 ? 50 : 0
  const totalAmount = cartTotal + shippingCost

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return

    setIsPlacingOrder(true)
    try {
      // Check balance
      const balanceResponse = await fetch(`${API_BASE}/user/${walletAddress}/balance`)
      const balanceData = await balanceResponse.json()

      if (balanceData.balance < totalAmount) {
        alert(`Insufficient balance. You have $${balanceData.balance.toFixed(2)}, but need $${totalAmount.toFixed(2)}`)
        setIsPlacingOrder(false)
        return
      }

      // Place order
      const orderResponse = await fetch(`${API_BASE}/marketplace/place-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          items: cart.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          })),
          shippingDetails,
          totalAmount,
        }),
      })

      const orderData = await orderResponse.json()

      if (orderData.error) {
        alert(orderData.error)
      } else {
        updateSpending(totalAmount)
        setCart([])
        setShowShipping(false)
        setShowCart(false)
        setShowConfirmModal(false)
        fetchOrders()
        alert(`Order placed successfully! Order ID: ${orderData.orderId}`)
      }
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Error placing order. Please try again.')
    } finally {
      setIsPlacingOrder(false)
    }
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowOrderHistory(true)}
            className="relative flex items-center gap-2 px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <History size={18} />
            <span className="text-sm font-medium">Orders</span>
            {orders.length > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs font-bold">
                {orders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowCart(true)}
            className="relative flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-xl transition-all font-medium"
          >
            <ShoppingCart size={18} />
            <span>Cart</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-primary rounded-full flex items-center justify-center text-xs font-bold">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search Bar - Blended Design */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 via-white/3 to-white/5 backdrop-blur-xl border border-white/10 p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50"></div>
        <div className="relative flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-white/10 border border-white/20 text-white'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid - Blended Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 via-white/3 to-white/5 backdrop-blur-xl border border-white/10 cursor-pointer hover:border-white/20 transition-all group"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-white/5 to-white/3 flex items-center justify-center text-6xl">
                {product.image}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-white mb-2 line-clamp-2 text-base">{product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">({product.reviews})</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-white">${product.price}</span>
                  <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                  <span className="text-sm text-green-400 font-semibold">{product.discount}% off</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    addToCart(product)
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-xl transition-all font-medium flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedProduct(null)}
            >
              <div
                className="bg-dark-card border border-dark-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative p-6">
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-6 right-6 text-gray-400 hover:text-white z-10"
                  >
                    <X size={24} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="aspect-square bg-dark-surface rounded-lg flex items-center justify-center text-8xl">
                      {selectedProduct.image}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">{selectedProduct.name}</h2>
                      {selectedProduct.brand && (
                        <p className="text-gray-400 mb-4">Brand: {selectedProduct.brand}</p>
                      )}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={18}
                              className={i < Math.floor(selectedProduct.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                            />
                          ))}
                        </div>
                        <span className="text-gray-400">({selectedProduct.reviews} reviews)</span>
                      </div>
                      <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-4xl font-bold text-white">${selectedProduct.price}</span>
                          <span className="text-xl text-gray-400 line-through">${selectedProduct.originalPrice}</span>
                          <span className="text-lg text-green-400 font-semibold">{selectedProduct.discount}% off</span>
                        </div>
                        <p className="text-sm text-gray-400">You save ${selectedProduct.originalPrice - selectedProduct.price}</p>
                      </div>
                      <div className="mb-6">
                        <h3 className="font-semibold text-white mb-2">About this item</h3>
                        <p className="text-gray-300 mb-4">{selectedProduct.fullDescription}</p>
                        {selectedProduct.features && (
                          <ul className="space-y-2">
                            {selectedProduct.features.map((feature, i) => (
                              <li key={i} className="flex items-center gap-2 text-gray-300">
                                <CheckCircle size={16} className="text-green-400" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          addToCart(selectedProduct)
                        }}
                        className="w-full py-3 bg-primary hover:bg-primary-hover rounded-lg transition-colors font-semibold text-lg flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={20} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Shopping Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setShowCart(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-white/5 via-white/3 to-white/5 backdrop-blur-xl border-l border-white/10 z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Shopping Cart</h2>
                  <button onClick={() => setShowCart(false)}>
                    <X size={24} className="text-gray-400 hover:text-white" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart size={48} className="text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                          <div className="w-20 h-20 bg-gradient-to-br from-white/5 to-white/3 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 border border-white/10">
                            {item.product.image}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-1">{item.product.name}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-white font-semibold">${item.product.price}</span>
                              <span className="text-sm text-gray-400 line-through">${item.product.originalPrice}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updateQuantity(item.product.id, -1)}
                                className="w-8 h-8 rounded border border-dark-border flex items-center justify-center hover:bg-dark-card"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, 1)}
                                className="w-8 h-8 rounded border border-dark-border flex items-center justify-center hover:bg-dark-card"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/10 pt-4 space-y-2 mb-4">
                      <div className="flex justify-between text-gray-400">
                        <span>Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Shipping</span>
                        <span>${shippingCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-white/10">
                        <span>Total</span>
                        <span>${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    {!showShipping ? (
                      <button
                        onClick={() => setShowShipping(true)}
                        className="w-full py-3 bg-primary hover:bg-primary-hover rounded-lg transition-colors font-semibold"
                      >
                        Proceed to Checkout
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold mb-4">Shipping Details</h3>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={shippingDetails.name}
                            onChange={(e) => setShippingDetails({ ...shippingDetails, name: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                          />
                          <input
                            type="text"
                            placeholder="Address"
                            value={shippingDetails.address}
                            onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="City"
                              value={shippingDetails.city}
                              onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                            />
                            <input
                              type="text"
                              placeholder="State"
                              value={shippingDetails.state}
                              onChange={(e) => setShippingDetails({ ...shippingDetails, state: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Zip Code"
                              value={shippingDetails.zipCode}
                              onChange={(e) => setShippingDetails({ ...shippingDetails, zipCode: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                            />
                            <input
                              type="text"
                              placeholder="Phone"
                              value={shippingDetails.phone}
                              onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => setShowConfirmModal(true)}
                          disabled={!shippingDetails.name || !shippingDetails.address || !shippingDetails.city || !shippingDetails.state || !shippingDetails.zipCode || !shippingDetails.phone}
                          className="w-full py-3 bg-primary hover:bg-primary-hover rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Place Order
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Order History Modal */}
      <AnimatePresence>
        {showOrderHistory && (
          <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setShowOrderHistory(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setShowOrderHistory(false)}
            >
              <div
                className="bg-dark-card border border-dark-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Order History</h2>
                    <button onClick={() => setShowOrderHistory(false)}>
                      <X size={24} className="text-gray-400 hover:text-white" />
                    </button>
                  </div>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package size={48} className="text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-dark-surface border border-dark-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-semibold text-white">Order #{order.id}</p>
                              <p className="text-sm text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                              order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="space-y-2 mb-3">
                            {order.items.map((item: any, i: number) => (
                              <div key={i} className="flex items-center justify-between text-sm">
                                <span className="text-gray-300">{item.productName} x{item.quantity}</span>
                                <span className="text-white">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-dark-border">
                            <span className="text-gray-400">Total</span>
                            <span className="text-xl font-bold text-white">${order.total_amount.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirm Order Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handlePlaceOrder}
        title="Confirm Order"
        message={`Place order for $${totalAmount.toFixed(2)}? This will deduct the amount from your wallet.`}
        confirmText="Confirm Order"
        cancelText="Cancel"
        type="info"
        isLoading={isPlacingOrder}
      />
    </div>
  )
}

export default Marketplace
