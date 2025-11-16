import express from 'express'
import cors from 'cors'
import { db } from './database.js'

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// Routes

// Get user balance
app.get('/api/user/:walletAddress/balance', (req, res) => {
  try {
    const user = db.getOrCreateUser(req.params.walletAddress)
    res.json({ balance: user.balance })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update user balance
app.post('/api/user/:walletAddress/balance', (req, res) => {
  try {
    const { amount } = req.body
    const user = db.getOrCreateUser(req.params.walletAddress)
    db.updateUserBalance(req.params.walletAddress, amount)
    res.json({ success: true, balance: amount })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get Indian airports
app.get('/api/airports/india', (req, res) => {
  const airports = [
    { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi' },
    { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai' },
    { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore' },
    { code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata' },
    { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai' },
    { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad' },
    { code: 'PNQ', name: 'Pune Airport', city: 'Pune' },
    { code: 'GOI', name: 'Dabolim Airport', city: 'Goa' },
    { code: 'COK', name: 'Cochin International Airport', city: 'Kochi' },
    { code: 'JAI', name: 'Jaipur International Airport', city: 'Jaipur' },
    { code: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad' },
    { code: 'IXC', name: 'Chandigarh Airport', city: 'Chandigarh' },
  ]
  res.json(airports)
})

// Search flights
app.post('/api/flights/search', (req, res) => {
  const { from, to, date, passengers = 1 } = req.body
  
  // Generate dummy flight data
  const flights = []
  const airlines = ['IndiGo', 'Air India', 'SpiceJet', 'Vistara', 'GoAir', 'AirAsia India']
  const times = ['06:00', '09:30', '12:15', '15:45', '18:20', '21:00']
  const seatClasses = ['Economy', 'Business', 'Premium Economy']
  const baggageOptions = ['15 kg', '20 kg', '25 kg', '30 kg']
  const mealOptions = ['Meal included', 'No meal', 'Vegetarian meal', 'Non-vegetarian meal']
  const cancellationOptions = ['Free cancellation', 'Cancellation charges apply', 'Non-refundable']
  
  for (let i = 0; i < 8; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)]
    const departureTime = times[Math.floor(Math.random() * times.length)]
    const duration = Math.floor(Math.random() * 3) + 1 // 1-3 hours
    const arrivalTime = addHours(departureTime, duration)
    const price = Math.floor(Math.random() * 15000) + 3000 // 3000-18000
    const stops = Math.random() > 0.7 ? Math.floor(Math.random() * 2) : 0
    
    flights.push({
      id: `FL${Date.now()}${i}`,
      airline,
      flightNumber: `${airline.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 9000) + 1000}`,
      from,
      to,
      departureTime,
      arrivalTime,
      duration: `${duration}h ${Math.floor(Math.random() * 60)}m`,
      price: price * passengers,
      seatsAvailable: Math.floor(Math.random() * 20) + 5,
      aircraft: ['Boeing 737', 'Airbus A320', 'Airbus A321'][Math.floor(Math.random() * 3)],
      seatClass: seatClasses[Math.floor(Math.random() * seatClasses.length)],
      baggage: baggageOptions[Math.floor(Math.random() * baggageOptions.length)],
      meal: mealOptions[Math.floor(Math.random() * mealOptions.length)],
      cancellation: cancellationOptions[Math.floor(Math.random() * cancellationOptions.length)],
      description: `Enjoy a comfortable journey with ${airline}. This ${stops === 0 ? 'non-stop' : stops + ' stop'} flight offers excellent service and modern amenities.`,
      stops,
      layover: stops > 0 ? `Layover at ${['Delhi', 'Mumbai', 'Bangalore'][Math.floor(Math.random() * 3)]} airport for ${Math.floor(Math.random() * 3) + 1} hours` : null,
      terminal: `T${Math.floor(Math.random() * 3) + 1}`,
      gate: `Gate ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}${Math.floor(Math.random() * 20) + 1}`,
      checkIn: `Check-in opens ${Math.floor(Math.random() * 2) + 2} hours before departure`,
      boarding: `Boarding starts ${Math.floor(Math.random() * 30) + 30} minutes before departure`,
    })
  }
  
  // Sort by price
  flights.sort((a, b) => a.price - b.price)
  
  res.json({ flights })
})

// Book flight
app.post('/api/flights/book', (req, res) => {
  try {
    const { walletAddress, flightId, from, to, departureDate, returnDate, passengers, totalPrice } = req.body
    
    const user = db.getOrCreateUser(walletAddress)
    
    // Check balance
    if (user.balance < totalPrice) {
      return res.status(400).json({ error: 'Insufficient balance' })
    }
    
    // Deduct balance
    const newBalance = user.balance - totalPrice
    db.updateUserBalance(walletAddress, newBalance)
    
    // Create transaction
    db.addTransaction(user.id, 'flight_booking', -totalPrice, `Flight booking: ${from} to ${to}`)
    
    // Create booking
    const booking = db.addBooking(
      user.id,
      flightId,
      from,
      to,
      departureDate,
      returnDate || null,
      passengers,
      totalPrice,
      'confirmed'
    )
    
    res.json({
      success: true,
      bookingId: booking.id,
      newBalance,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Purchase marketplace product (legacy - kept for compatibility)
app.post('/api/marketplace/purchase', (req, res) => {
  try {
    const { walletAddress, productId, productName, price } = req.body

    const user = db.getOrCreateUser(walletAddress)

    // Check balance
    if (user.balance < price) {
      return res.status(400).json({ error: 'Insufficient balance' })
    }

    // Deduct balance
    const newBalance = user.balance - price
    db.updateUserBalance(walletAddress, newBalance)

    // Create transaction
    db.addTransaction(user.id, 'marketplace_purchase', -price, `Purchase: ${productName}`)

    // Record purchase
    const purchase = db.addPurchase(user.id, productId, productName, price)

    res.json({
      success: true,
      purchaseId: purchase.id,
      newBalance,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Place order (new - with cart and shipping)
app.post('/api/marketplace/place-order', (req, res) => {
  try {
    const { walletAddress, items, shippingDetails, totalAmount } = req.body

    const user = db.getOrCreateUser(walletAddress)

    // Check balance
    if (user.balance < totalAmount) {
      return res.status(400).json({ error: 'Insufficient balance' })
    }

    // Deduct balance
    const newBalance = user.balance - totalAmount
    db.updateUserBalance(walletAddress, newBalance)

    // Create transaction
    db.addTransaction(user.id, 'marketplace_order', -totalAmount, `Order: ${items.length} item(s)`)

    // Record order
    const order = db.addOrder(user.id, items, shippingDetails, totalAmount)

    res.json({
      success: true,
      orderId: order.id,
      newBalance,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get user orders
app.get('/api/marketplace/orders/:walletAddress', (req, res) => {
  try {
    const user = db.getOrCreateUser(req.params.walletAddress)
    const orders = db.getOrders(user.id)
    res.json({ orders })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Search Hotels
app.post('/api/hotels/search', (req, res) => {
  try {
    const { city, checkIn, checkOut, rooms, guests } = req.body

    if (!city || !checkIn || !checkOut) {
      return res.status(400).json({ error: 'City, check-in, and check-out dates are required' })
    }

    // Dummy hotel data
    const hotelNames = [
      'Grand Hotel', 'Luxury Resort', 'Business Hotel', 'Beach Resort', 'City Center Hotel',
      'Heritage Palace', 'Modern Suites', 'Garden View Hotel', 'Mountain Resort', 'Riverside Inn',
      'Plaza Hotel', 'Sunset Resort', 'Royal Palace', 'Executive Hotel', 'Paradise Resort'
    ]

    const locations = [
      'City Center', 'Airport Road', 'Beach Front', 'Downtown', 'Business District',
      'Shopping Area', 'Near Railway Station', 'Lakeside', 'Hill Station', 'Riverside'
    ]

    const amenities = [
      ['Free WiFi', 'Parking', 'Restaurant', 'Room Service'],
      ['Free WiFi', 'Swimming Pool', 'Gym', 'Spa'],
      ['Free WiFi', 'Parking', 'Restaurant', 'Business Center'],
      ['Free WiFi', 'Beach Access', 'Restaurant', 'Bar'],
      ['Free WiFi', 'Parking', 'Restaurant', 'Room Service', 'Gym'],
    ]

    const roomTypes = [
      { type: 'Standard Room', description: 'Comfortable room with basic amenities, perfect for solo travelers or couples.' },
      { type: 'Deluxe Room', description: 'Spacious room with premium furnishings and city views.' },
      { type: 'Suite', description: 'Luxurious suite with separate living area and premium amenities.' },
      { type: 'Executive Room', description: 'Business-friendly room with work desk and high-speed internet.' },
    ]

    const facilities = [
      'Swimming Pool', 'Fitness Center', 'Spa', 'Business Center', 'Conference Room', 'Laundry Service',
      '24/7 Front Desk', 'Concierge Service', 'Airport Shuttle', 'Valet Parking'
    ]

    const nearbyPlaces = [
      'Shopping Mall - 0.5 km', 'Restaurant - 0.3 km', 'Metro Station - 1 km', 'Tourist Attraction - 2 km',
      'Hospital - 1.5 km', 'Airport - 10 km', 'Beach - 3 km', 'Park - 0.8 km'
    ]

    const hotels = []
    for (let i = 0; i < 10; i++) {
      const originalPrice = Math.floor(Math.random() * 200) + 100 // 100-300
      const discount = Math.floor(Math.random() * 40) + 10 // 10-50%
      const price = Math.floor(originalPrice * (1 - discount / 100))
      const selectedAmenities = amenities[Math.floor(Math.random() * amenities.length)]
      const selectedFacilities = facilities.slice(0, Math.floor(Math.random() * 5) + 5)
      const selectedNearby = nearbyPlaces.slice(0, Math.floor(Math.random() * 4) + 3)
      const hotelRooms = roomTypes.slice(0, Math.floor(Math.random() * 3) + 2).map(rt => ({
        type: rt.type,
        description: rt.description,
        price: Math.floor(price * (0.8 + Math.random() * 0.4)), // 80-120% of base price
      }))

      hotels.push({
        id: `hotel_${Date.now()}_${i}`,
        name: hotelNames[Math.floor(Math.random() * hotelNames.length)],
        city,
        location: locations[Math.floor(Math.random() * locations.length)],
        rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
        price,
        originalPrice,
        discount,
        image: ['🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰'][Math.floor(Math.random() * 8)],
        amenities: selectedAmenities,
        description: `Experience luxury and comfort at this ${city} hotel. Located in the heart of ${locations[Math.floor(Math.random() * locations.length)]}, our hotel offers modern amenities, exceptional service, and a perfect blend of comfort and convenience. Whether you're traveling for business or leisure, our hotel provides an ideal base for exploring ${city}.`,
        distance: `${Math.floor(Math.random() * 10) + 1} km`,
        roomTypes: hotelRooms,
        policies: {
          checkIn: '2:00 PM',
          checkOut: '11:00 AM',
          cancellation: Math.random() > 0.5 ? 'Free cancellation until 24 hours before check-in' : 'Cancellation charges apply',
          pets: Math.random() > 0.5 ? 'Pets allowed' : 'No pets allowed',
        },
        facilities: selectedFacilities,
        nearby: selectedNearby,
        reviews: [
          {
            rating: Math.floor(Math.random() * 2) + 4,
            comment: 'Excellent stay! Great location and friendly staff.',
            author: 'John D.',
          },
          {
            rating: Math.floor(Math.random() * 2) + 4,
            comment: 'Comfortable rooms and good amenities. Would recommend.',
            author: 'Sarah M.',
          },
        ],
      })
    }

    // Sort by price
    hotels.sort((a, b) => a.price - b.price)

    res.json({ hotels })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Book Hotel
app.post('/api/hotels/book', (req, res) => {
  try {
    const { walletAddress, hotelId, hotelName, city, checkIn, checkOut, rooms, guests, roomType, totalPrice } = req.body

    const user = db.getOrCreateUser(walletAddress)

    // Check balance
    if (user.balance < totalPrice) {
      return res.status(400).json({ error: 'Insufficient balance' })
    }

    // Deduct balance
    const newBalance = user.balance - totalPrice
    db.updateUserBalance(walletAddress, newBalance)

    // Create transaction
    const bookingDescription = roomType 
      ? `Hotel booking: ${hotelName}, ${city} - ${roomType}`
      : `Hotel booking: ${hotelName}, ${city}`
    db.addTransaction(user.id, 'hotel_booking', -totalPrice, bookingDescription)

    // Create booking
    const booking = db.addHotelBooking(user.id, hotelId, hotelName, city, checkIn, checkOut, rooms, guests, totalPrice, roomType)

    res.json({
      success: true,
      bookingId: booking.id,
      newBalance,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get user transactions
app.get('/api/user/:walletAddress/transactions', (req, res) => {
  try {
    const user = db.getOrCreateUser(req.params.walletAddress)
    const transactions = db.getTransactions(user.id)
    res.json(transactions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Utility Payments - Fetch Bill
app.post('/api/utility/fetch-bill', (req, res) => {
  try {
    const { walletAddress, billerId, customerId } = req.body

    if (!billerId || !customerId) {
      return res.status(400).json({ error: 'Biller ID and Customer ID are required' })
    }

    // Generate dummy bill amount based on biller and customer ID
    const baseAmounts = {
      '1': 10, // Mobile Recharge
      '2': 150, // Electricity
      '3': 50, // Water
      '4': 800, // Gas
      '5': 60, // Broadband
      '6': 30, // Cable TV
      '7': 25, // DTH
      '8': 500, // Credit Card
      '9': 2000, // Education
      '10': 300, // Insurance
      '11': 20, // Landline
      '12': 100, // Fastag
      '13': 200, // Municipal
      '14': 15, // Subscription
      '15': 500, // Hospital
      '16': 100, // Club
    }

    const baseAmount = baseAmounts[billerId] || 100
    // Add some variation based on customer ID hash
    const variation = (customerId.charCodeAt(0) % 50) - 25
    const amount = Math.max(10, baseAmount + variation)

    res.json({
      success: true,
      amount: amount.toFixed(2),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Utility Payments - Pay Bill
app.post('/api/utility/pay-bill', (req, res) => {
  try {
    const { walletAddress, billerId, billerName, customerId, amount } = req.body

    const user = db.getOrCreateUser(walletAddress)

    // Check balance
    if (user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' })
    }

    // Deduct balance
    const newBalance = user.balance - amount
    db.updateUserBalance(walletAddress, newBalance)

    // Create transaction
    db.addTransaction(user.id, 'utility_payment', -amount, `Bill payment: ${billerName}`)

    // Record bill payment
    const bill = db.addBillPayment(user.id, billerId, billerName, customerId, amount)

    res.json({
      success: true,
      paymentId: bill.id,
      newBalance,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get user bills
app.get('/api/utility/bills/:walletAddress', (req, res) => {
  try {
    const user = db.getOrCreateUser(req.params.walletAddress)
    const bills = db.getBills(user.id)
    res.json({ bills })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Helper function
function addHours(time, hours) {
  const [h, m] = time.split(':').map(Number)
  const newH = (h + hours) % 24
  return `${String(newH).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

