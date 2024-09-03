'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useWriteMessage } from '@/hooks/writeMessage'
import { useViewMessageContent } from '@/view-functions/getMessageContent'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useState } from 'react'

export function MessageBoard() {
	const { account } = useWallet()
	const [newMessageContent, setNewMessageContent] = useState<string>()
	const { data } = useViewMessageContent()
	const writeMessage = useWriteMessage()

	const onClickButton = async () => {
		if (!account || !newMessageContent) {
			return
		}
		writeMessage.mutate({ message: newMessageContent })
	}

	return (
		<div className="flex flex-col gap-6">
			<h4 className="text-lg font-medium">Message content: {data?.content}</h4>
			New message{' '}
			<Input
				disabled={!account}
				placeholder="yoho"
				onChange={(e) => setNewMessageContent(e.target.value)}
			/>
			<Button
				disabled={
					!account ||
					!newMessageContent ||
					newMessageContent.length === 0 ||
					newMessageContent.length > 100
				}
				onClick={onClickButton}
			>
				Write
			</Button>
		</div>
	)
}
