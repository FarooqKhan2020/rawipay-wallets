# Rewipay Backend Server

Backend API server for Rewipay application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### User Balance
- `GET /api/user/:walletAddress/balance` - Get user balance
- `POST /api/user/:walletAddress/balance` - Update user balance

### Airports
- `GET /api/airports/india` - Get list of Indian airports

### Flights
- `POST /api/flights/search` - Search for flights
  - Body: `{ from, to, date, passengers }`
- `POST /api/flights/book` - Book a flight
  - Body: `{ walletAddress, flightId, from, to, departureDate, returnDate, passengers, totalPrice }`

### Marketplace
- `POST /api/marketplace/purchase` - Purchase a product
  - Body: `{ walletAddress, productId, productName, price }`

### Transactions
- `GET /api/user/:walletAddress/transactions` - Get user transaction history

## Database

Uses JSON file-based database (`database.json`) with the following collections:
- `users` - User wallet information
- `transactions` - Transaction history
- `marketplace_purchases` - Marketplace purchase records
- `flight_bookings` - Flight booking records

The database file is automatically created on first run.

