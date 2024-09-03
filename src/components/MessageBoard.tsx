"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Internal components
import { toast } from "@/components/ui/use-toast";
import { writeMessage } from "@/entry-functions/writeMessage";
import { aptosClient } from "@/utils/aptosClient";
import { getMessageContent } from "@/view-functions/getMessageContent";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function MessageBoard() {
	const { account, signAndSubmitTransaction } = useWallet();
	const queryClient = useQueryClient();

	const [messageContent, setMessageContent] = useState<string>();
	const [newMessageContent, setNewMessageContent] = useState<string>();

	const { data } = useQuery({
		queryKey: ["message-content", account?.address],
		refetchInterval: 10_000,
		queryFn: async () => {
			try {
				const content = await getMessageContent();

				return {
					content,
				};
			} catch (error: any) {
				toast({
					variant: "destructive",
					title: "Error",
					description: error,
				});
				return {
					content: "",
				};
			}
		},
	});

	const onClickButton = async () => {
		if (!account || !newMessageContent) {
			return;
		}

		try {
			const committedTransaction = await signAndSubmitTransaction(
				writeMessage({
					content: newMessageContent,
				}),
			);
			const executedTransaction = await aptosClient().waitForTransaction({
				transactionHash: committedTransaction.hash,
			});
			queryClient.invalidateQueries();
			toast({
				title: "Success",
				description: `Transaction succeeded, hash: ${executedTransaction.hash}`,
			});
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (data) {
			setMessageContent(data.content);
		}
	}, [data]);

	return (
		<div className="flex flex-col gap-6">
			<h4 className="text-lg font-medium">Message content: {messageContent}</h4>
			New message{" "}
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
	);
}
