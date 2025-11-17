import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, polygon, arbitrum, optimism, base, sepolia } from '@reown/appkit/networks'

const projectId = 'ea1f872766006dc0fd3f8e25be55ed76'

const metadata = {
  name: 'Rewi Pay',
  description: 'Crypto wallet and payment platform',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://rewipay.com',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

export const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, polygon, arbitrum, optimism, base, sepolia],
  projectId,
})

createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, polygon, arbitrum, optimism, base, sepolia],
  projectId,
  metadata,
  features: { analytics: true },
})

export const config = wagmiAdapter.wagmiConfig
