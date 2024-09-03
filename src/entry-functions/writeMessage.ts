import type { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type WriteMessageArguments = {
	content: string; // the content of the message
};

export const writeMessage = (
	args: WriteMessageArguments,
): InputTransactionData => {
	const { content } = args;
	return {
		data: {
			function: `${process.env.NEXT_PUBLIC_MODULE_ADDRESS}::message_board::post_message`,
			functionArguments: [content],
		},
	};
};
