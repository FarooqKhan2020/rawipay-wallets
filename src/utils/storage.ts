// LocalStorage database for Rewi Club app

const STORAGE_KEYS = {
  WALLETS: 'rewipay_wallets',
  REWARDS: 'rewipay_rewards',
  TIER: 'rewipay_tier',
}

export const storage = {
  // Wallets
  getWallets: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WALLETS)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  },

  saveWallets: (wallets: any[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(wallets))
      return true
    } catch {
      return false
    }
  },

  // Rewards
  getRewards: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REWARDS)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  },

  saveRewards: (rewards: any) => {
    try {
      localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards))
      return true
    } catch {
      return false
    }
  },

  // Tier
  getTier: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TIER)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  },

  saveTier: (tier: any) => {
    try {
      localStorage.setItem(STORAGE_KEYS.TIER, JSON.stringify(tier))
      return true
    } catch {
      return false
    }
  },

  // Clear all data
  clearAll: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.WALLETS)
      localStorage.removeItem(STORAGE_KEYS.REWARDS)
      localStorage.removeItem(STORAGE_KEYS.TIER)
      return true
    } catch {
      return false
    }
  },
}

