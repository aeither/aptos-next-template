export const ABI = {
	address: '0x43ddf56eccebaa100b819511e3d6de0712792d81fefc6c7dc6101ed93573c610',
	name: 'message_board',
	friends: [],
	exposed_functions: [
		{
			name: 'exist_message',
			visibility: 'public',
			is_entry: false,
			is_view: true,
			generic_type_params: [],
			params: [],
			return: ['bool']
		},
		{
			name: 'get_message_content',
			visibility: 'public',
			is_entry: false,
			is_view: true,
			generic_type_params: [],
			params: [],
			return: ['0x1::string::String']
		},
		{
			name: 'post_message',
			visibility: 'public',
			is_entry: true,
			is_view: false,
			generic_type_params: [],
			params: ['&signer', '0x1::string::String'],
			return: []
		}
	],
	structs: [
		{
			name: 'BoardObjectController',
			is_native: false,
			abilities: ['key'],
			generic_type_params: [],
			fields: [{ name: 'extend_ref', type: '0x1::object::ExtendRef' }]
		},
		{
			name: 'Message',
			is_native: false,
			abilities: ['key'],
			generic_type_params: [],
			fields: [{ name: 'string_content', type: '0x1::string::String' }]
		}
	]
} as const
