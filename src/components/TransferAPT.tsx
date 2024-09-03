'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// Internal components
import { transferAPT } from '@/entry-functions/transferAPT'
import { aptosClient, callFaucet } from '@/utils/aptosClient'
import { parseAptos } from '@/utils/units'
import { getAccountAPTBalance } from '@/view-functions/getAccountBalance'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { ToastAction } from '@radix-ui/react-toast'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

export function TransferAPT() {
	const { account, signAndSubmitTransaction } = useWallet()
	const queryClient = useQueryClient()

	const [recipient, setRecipient] = useState<string>()
	const [transferAmount, setTransferAmount] = useState<number>()

	const { data } = useQuery({
		queryKey: ['apt-balance', account?.address],
		refetchInterval: 10_000,
		enabled: !!account,
		queryFn: async () => {
			try {
				if (account === null) {
					console.error('Account not available')
				}

				const balance = await getAccountAPTBalance({
					accountAddress: account!.address
				})

				return {
					balance
				}
			} catch (error: any) {
				toast.error('Error', {
					description: error
				})
				return {
					balance: 0
				}
			}
		}
	})

	const doTransfer = async () => {
		if (!account || !recipient || !transferAmount) {
			return
		}

		try {
			const committedTransaction = await signAndSubmitTransaction(
				transferAPT({
					to: recipient,
					// APT is 8 decimal places
					amount: 10 ** 8 * transferAmount
				})
			)
			const executedTransaction = await aptosClient().waitForTransaction({
				transactionHash: committedTransaction.hash
			})
			queryClient.invalidateQueries()
			toast('Success', {
				description: `Transaction succeeded, hash: ${executedTransaction.hash}`
			})
		} catch (error) {
			console.error(error)
		}
	}

	const topUp = async () => {
		const hashes = await callFaucet(parseAptos('1'), account!.address)
		const executedTransaction = await aptosClient().waitForTransaction({
			transactionHash: hashes as unknown as string
		})
		queryClient.invalidateQueries()
		toast('Transaction sent', {
			action: (
				<ToastAction
					altText="View Hash"
					onClick={() => {
						window.open(
							`https://explorer.aptoslabs.com/txn/${executedTransaction.hash}?network=${process.env.NEXT_PUBLIC_APP_NETWORK}`,
							'_blank'
						)
					}}
				>
					View Hash
				</ToastAction>
			)
		})
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-row items-center gap-2">
				<h4 className="text-lg font-medium">
					APT balance: {data?.balance ? data.balance / 10 ** 8 : 0}
				</h4>
				{process.env.NEXT_PUBLIC_APP_NETWORK !== 'mainnet' && (
					<Button onClick={topUp}>Top Up</Button>
				)}
			</div>
			Recipient{' '}
			<Input
				disabled={!account}
				placeholder="0x1"
				onChange={(e) => setRecipient(e.target.value)}
			/>
			Amount{' '}
			<Input
				disabled={!account}
				placeholder="100"
				onChange={(e) => setTransferAmount(Number.parseFloat(e.target.value))}
			/>
			<Button
				disabled={
					!account ||
					!recipient ||
					!transferAmount ||
					transferAmount > (data?.balance ?? 0) ||
					transferAmount <= 0
				}
				onClick={doTransfer}
			>
				Transfer
			</Button>
		</div>
	)
}
