import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { storage } from '../utils/storage'

interface Wallet {
  id: string
  address: string
  balance: number
  connection: 'Connected' | 'Disconnected'
  network: string
}

const API_BASE = 'http://localhost:3001/api'

interface Reward {
  seeds: number
  totalSpent: number
  seedsEarned: number
}

interface Tier {
  name: string
  level: number
  subLevel: number
  progress: number
  nextTier: string
}

interface AppContextType {
  wallets: Wallet[]
  addWallet: (wallet: Wallet) => void
  removeWallet: (id: string) => void
  disconnectWallet: (id: string) => void
  rewards: Reward
  updateSpending: (amount: number) => void
  tier: Tier
  updateTierProgress: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  // Load from localStorage or use defaults
  const [wallets, setWallets] = useState<Wallet[]>(() => {
    const saved = storage.getWallets()
    const defaultWallets = [
      {
        id: '1',
        address: '0xBD77...D599B8',
        balance: 3.67,
        connection: 'Connected',
        network: 'Ethereum',
      },
    ]
    
    // Sync balance with backend on load
    if (saved) {
      saved.forEach((wallet: Wallet) => {
        fetch(`${API_BASE}/user/${wallet.address}/balance`)
          .then((res) => res.json())
          .then((data) => {
            setWallets((prev) =>
              prev.map((w) => (w.id === wallet.id ? { ...w, balance: data.balance } : w))
            )
          })
          .catch(() => {})
      })
      return saved
    }
    
    return defaultWallets
  })

  const [rewards, setRewards] = useState<Reward>(() => {
    const saved = storage.getRewards()
    return saved || {
      seeds: 0,
      totalSpent: 0,
      seedsEarned: 0,
    }
  })

  const calculateTier = (totalSpent: number): Tier => {
    // Bronze tiers: 0-10k (Bronze 1: 0-2k, Bronze 2: 2k-4k, Bronze 3: 4k-10k)
    if (totalSpent < 10000) {
      if (totalSpent < 2000) {
        return {
          name: 'Bronze',
          level: 1,
          subLevel: 1,
          progress: (totalSpent / 2000) * 100,
          nextTier: 'Bronze 2',
        }
      } else if (totalSpent < 4000) {
        return {
          name: 'Bronze',
          level: 2,
          subLevel: 2,
          progress: ((totalSpent - 2000) / 2000) * 100,
          nextTier: 'Bronze 3',
        }
      } else {
        return {
          name: 'Bronze',
          level: 3,
          subLevel: 3,
          progress: ((totalSpent - 4000) / 6000) * 100,
          nextTier: 'Silver 1',
        }
      }
    }
    // Silver tiers: 10k-30k (Silver 1: 10k-15k, Silver 2: 15k-20k, Silver 3: 20k-30k)
    else if (totalSpent < 30000) {
      if (totalSpent < 15000) {
        return {
          name: 'Silver',
          level: 1,
          subLevel: 1,
          progress: ((totalSpent - 10000) / 5000) * 100,
          nextTier: 'Silver 2',
        }
      } else if (totalSpent < 20000) {
        return {
          name: 'Silver',
          level: 2,
          subLevel: 2,
          progress: ((totalSpent - 15000) / 5000) * 100,
          nextTier: 'Silver 3',
        }
      } else {
        return {
          name: 'Silver',
          level: 3,
          subLevel: 3,
          progress: ((totalSpent - 20000) / 10000) * 100,
          nextTier: 'Gold 1',
        }
      }
    }
    // Gold tiers: 30k-100k (Gold 1: 30k-50k, Gold 2: 50k-70k, Gold 3: 70k-100k)
    else if (totalSpent < 100000) {
      if (totalSpent < 50000) {
        return {
          name: 'Gold',
          level: 1,
          subLevel: 1,
          progress: ((totalSpent - 30000) / 20000) * 100,
          nextTier: 'Gold 2',
        }
      } else if (totalSpent < 70000) {
        return {
          name: 'Gold',
          level: 2,
          subLevel: 2,
          progress: ((totalSpent - 50000) / 20000) * 100,
          nextTier: 'Gold 3',
        }
      } else {
        return {
          name: 'Gold',
          level: 3,
          subLevel: 3,
          progress: ((totalSpent - 70000) / 30000) * 100,
          nextTier: 'Diamond',
        }
      }
    }
    // Diamond: 100k+
    else {
      return {
        name: 'Diamond',
        level: 1,
        subLevel: 1,
        progress: 100,
        nextTier: 'Max Level',
      }
    }
  }

  const [tier, setTier] = useState<Tier>(() => {
    const saved = storage.getTier()
    if (saved) return saved
    const savedRewards = storage.getRewards()
    const totalSpent = savedRewards?.totalSpent || 0
    return calculateTier(totalSpent)
  })

  // Save to localStorage whenever state changes
  useEffect(() => {
    storage.saveWallets(wallets)
  }, [wallets])

  useEffect(() => {
    storage.saveRewards(rewards)
  }, [rewards])

  useEffect(() => {
    storage.saveTier(tier)
  }, [tier])

  const addWallet = (wallet: Wallet) => {
    setWallets([...wallets, wallet])
  }

  const removeWallet = (id: string) => {
    setWallets(wallets.filter((w) => w.id !== id))
  }

  const disconnectWallet = (id: string) => {
    setWallets(wallets.map((w) => (w.id === id ? { ...w, connection: 'Disconnected' as const } : w)))
  }

  const updateSpending = async (amount: number) => {
    // Update backend balance (this would be done by the purchase endpoint, but we update local state)
    setRewards((prev) => {
      const newTotalSpent = prev.totalSpent + amount
      const newSeedsEarned = Math.floor(newTotalSpent / 1000)
      const newSeeds = newSeedsEarned - prev.seedsEarned + prev.seeds

      const updatedRewards = {
        seeds: newSeeds,
        totalSpent: newTotalSpent,
        seedsEarned: newSeedsEarned,
      }

      // Update tier based on new total spent
      const newTier = calculateTier(newTotalSpent)
      setTier(newTier)

      return updatedRewards
    })
    
    // Update wallet balance from backend
    const primaryWallet = wallets[0]
    if (primaryWallet) {
      fetch(`${API_BASE}/user/${primaryWallet.address}/balance`)
        .then((res) => res.json())
        .then((data) => {
          setWallets((prev) =>
            prev.map((w) => (w.id === primaryWallet.id ? { ...w, balance: data.balance } : w))
          )
        })
        .catch(() => {})
    }
  }

  const updateTierProgress = () => {
    // This is now handled in updateSpending
  }

  return (
    <AppContext.Provider
      value={{
        wallets,
        addWallet,
        removeWallet,
        disconnectWallet,
        rewards,
        updateSpending,
        tier,
        updateTierProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

