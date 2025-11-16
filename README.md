# Rewipay - Decentralized Wallet Dashboard

A modern web application for managing decentralized cryptocurrency accounts, inspired by MetaMask's interface design, with utility-based payments, rewards system, and marketplace.

## Features

- **Dashboard**: View your decentralized account balance, token holdings, and portfolio performance
- **Settings**: Manage accounts, networks, theme, and preferences
- **Marketplace**: Buy products with crypto (with wallet balance checking)
- **Travel**: Search and book flights within India
- **Rewards**: Track seeds earned (1 seed per $1000 spent) and tier progression
- **Tier System**: Bronze, Silver, Gold, Diamond levels with sub-levels
- **Light/Dark Mode**: Theme switching with system preference detection

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **JSON file-based** database (no native dependencies)
- RESTful API endpoints

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install frontend dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
cd server
npm install
cd ..
```

3. Start both frontend and backend:
```bash
npm run dev:all
```

Or start them separately:
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:server
```

4. Open your browser and navigate to:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3001`

## Project Structure

```
rewipay/
├── src/
│   ├── components/
│   │   ├── Layout.tsx      # Main layout wrapper
│   │   ├── Sidebar.tsx     # Navigation sidebar
│   │   └── Header.tsx      # Top header with search and theme toggle
│   ├── context/
│   │   ├── AppContext.tsx  # App state (wallets, rewards, tiers)
│   │   └── ThemeContext.tsx # Theme management
│   ├── pages/
│   │   ├── Dashboard.tsx   # Main dashboard page
│   │   ├── Settings.tsx   # Settings with General, Networks, Accounts
│   │   ├── Marketplace.tsx # Product marketplace
│   │   ├── Travel.tsx      # Flight booking
│   │   ├── Rewards.tsx     # Rewards and tier system
│   │   └── ...
│   ├── utils/
│   │   └── storage.ts      # LocalStorage utilities
│   └── App.tsx             # Main app component
├── server/
│   ├── index.js            # Express server
│   ├── database.js         # JSON database operations
│   ├── package.json        # Server dependencies
│   └── database.json       # JSON database (created automatically)
└── package.json
```

## Backend API

### Endpoints

- `GET /api/user/:walletAddress/balance` - Get user balance
- `POST /api/user/:walletAddress/balance` - Update user balance
- `GET /api/airports/india` - Get Indian airports list
- `POST /api/flights/search` - Search flights
- `POST /api/flights/book` - Book a flight
- `POST /api/marketplace/purchase` - Purchase a product
- `GET /api/user/:walletAddress/transactions` - Get transaction history

## Database Schema

- **users**: Wallet addresses and balances
- **transactions**: All transaction history
- **marketplace_purchases**: Marketplace purchase records
- **flight_bookings**: Flight booking records

## Features Overview

### Marketplace
- Browse products with crypto prices
- Wallet balance checking before purchase
- Automatic balance deduction
- Transaction recording

### Travel
- Search flights within India
- View airport list
- One-way and round-trip options
- Flight booking with wallet payment
- Real-time flight search results

### Rewards System
- 1 seed earned per $1,000 spent
- Tier progression: Bronze → Silver → Gold → Diamond
- Sub-levels within each tier (1, 2, 3)
- Progress tracking and benefits display

### Settings
- General: Currency, Theme, Account Identicon
- Networks: Enable/disable blockchain networks
- Accounts: Manage multiple wallets

## Development

The app uses:
- **TypeScript** for type safety
- **ESLint** for code quality
- **Tailwind CSS** for utility-first styling
- **React Router** for client-side routing
- **LocalStorage** for client-side persistence
- **JSON file-based database** for server-side data storage

## License

MIT
