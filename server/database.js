import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const DB_PATH = join(__dirname, 'database.json')

// Initialize database
function initDB() {
  if (!existsSync(DB_PATH)) {
    const initialData = {
      users: [],
      transactions: [],
      marketplace_purchases: [],
      marketplace_orders: [],
      flight_bookings: [],
      hotel_bookings: [],
      utility_bills: [],
    }
    writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2))
  }
}

// Read database
function readDB() {
  initDB()
  const data = readFileSync(DB_PATH, 'utf-8')
  return JSON.parse(data)
}

// Write database
function writeDB(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

// Database operations
export const db = {
  // Users
  getUser: (walletAddress) => {
    const data = readDB()
    return data.users.find((u) => u.wallet_address === walletAddress)
  },

  createUser: (walletAddress, balance = 10000) => {
    const data = readDB()
    const user = {
      id: data.users.length + 1,
      wallet_address: walletAddress,
      balance,
      created_at: new Date().toISOString(),
    }
    data.users.push(user)
    writeDB(data)
    return user
  },

  getOrCreateUser: (walletAddress) => {
    let user = db.getUser(walletAddress)
    if (!user) {
      user = db.createUser(walletAddress)
    }
    return user
  },

  updateUserBalance: (walletAddress, balance) => {
    const data = readDB()
    const user = data.users.find((u) => u.wallet_address === walletAddress)
    if (user) {
      user.balance = balance
      writeDB(data)
      return user
    }
    return null
  },

  // Transactions
  addTransaction: (userId, type, amount, description) => {
    const data = readDB()
    const transaction = {
      id: data.transactions.length + 1,
      user_id: userId,
      type,
      amount,
      description,
      created_at: new Date().toISOString(),
    }
    data.transactions.push(transaction)
    writeDB(data)
    return transaction
  },

  getTransactions: (userId, limit = 50) => {
    const data = readDB()
    return data.transactions
      .filter((t) => t.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit)
  },

  // Marketplace
  addPurchase: (userId, productId, productName, price) => {
    const data = readDB()
    const purchase = {
      id: data.marketplace_purchases.length + 1,
      user_id: userId,
      product_id: productId,
      product_name: productName,
      price,
      created_at: new Date().toISOString(),
    }
    data.marketplace_purchases.push(purchase)
    writeDB(data)
    return purchase
  },

  // Flights
  addBooking: (userId, flightId, from, to, departureDate, returnDate, passengers, totalPrice, status) => {
    const data = readDB()
    const booking = {
      id: data.flight_bookings.length + 1,
      user_id: userId,
      flight_id: flightId,
      from_airport: from,
      to_airport: to,
      departure_date: departureDate,
      return_date: returnDate,
      passengers,
      total_price: totalPrice,
      status,
      created_at: new Date().toISOString(),
    }
    data.flight_bookings.push(booking)
    writeDB(data)
    return booking
  },

  // Utility Bills
  addBillPayment: (userId, billerId, billerName, customerId, amount) => {
    const data = readDB()
    if (!data.utility_bills) {
      data.utility_bills = []
    }
    const bill = {
      id: data.utility_bills.length + 1,
      user_id: userId,
      biller_id: billerId,
      biller_name: billerName,
      customer_id: customerId,
      amount: parseFloat(amount),
      status: 'paid',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    }
    data.utility_bills.push(bill)
    writeDB(data)
    return bill
  },

  getBills: (userId) => {
    const data = readDB()
    if (!data.utility_bills) {
      return []
    }
    return data.utility_bills
      .filter((bill) => bill.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 50)
  },

  // Marketplace Orders
  addOrder: (userId, items, shippingDetails, totalAmount) => {
    const data = readDB()
    if (!data.marketplace_orders) {
      data.marketplace_orders = []
    }
    const order = {
      id: data.marketplace_orders.length + 1,
      user_id: userId,
      items,
      shipping_details: shippingDetails,
      total_amount: parseFloat(totalAmount),
      status: 'pending',
      created_at: new Date().toISOString(),
    }
    data.marketplace_orders.push(order)
    writeDB(data)
    return order
  },

  getOrders: (userId) => {
    const data = readDB()
    if (!data.marketplace_orders) {
      return []
    }
    return data.marketplace_orders
      .filter((order) => order.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 50)
  },

  // Hotel Bookings
  addHotelBooking: (userId, hotelId, hotelName, city, checkIn, checkOut, rooms, guests, totalPrice, roomType = null) => {
    const data = readDB()
    if (!data.hotel_bookings) {
      data.hotel_bookings = []
    }
    const booking = {
      id: data.hotel_bookings.length + 1,
      user_id: userId,
      hotel_id: hotelId,
      hotel_name: hotelName,
      city,
      check_in: checkIn,
      check_out: checkOut,
      rooms,
      guests,
      room_type: roomType,
      total_price: parseFloat(totalPrice),
      status: 'confirmed',
      created_at: new Date().toISOString(),
    }
    data.hotel_bookings.push(booking)
    writeDB(data)
    return booking
  },

  getHotelBookings: (userId) => {
    const data = readDB()
    if (!data.hotel_bookings) {
      return []
    }
    return data.hotel_bookings
      .filter((booking) => booking.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 50)
  },
}

// Initialize on import
initDB()

