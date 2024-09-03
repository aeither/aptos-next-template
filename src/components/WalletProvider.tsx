'use client'

import { toast } from '@/hooks/use-toast'
// Internal components
import { NETWORK } from '@/lib/constants'
// Internal constants
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react'
import type { PropsWithChildren } from 'react'

export function WalletProvider({ children }: PropsWithChildren) {
	return (
		<AptosWalletAdapterProvider
			autoConnect={true}
			dappConfig={{ network: NETWORK }}
			onError={(error) => {
				toast({
					variant: 'destructive',
					title: 'Error',
					description: error || 'Unknown wallet error'
				})
			}}
		>
			{children}
		</AptosWalletAdapterProvider>
	)
}
