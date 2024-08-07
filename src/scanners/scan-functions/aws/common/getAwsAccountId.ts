import {Credentials} from '@/types'
import {STSClient, GetCallerIdentityCommand} from '@aws-sdk/client-sts'

export const getAwsAccountId = (() => {
	const accountIdMap = new Map<Credentials, string>()

	return async (credentials: Credentials): Promise<string> => {
		if (!accountIdMap.has(credentials)) {
			const stsClient = new STSClient({credentials})
			const command = new GetCallerIdentityCommand({})
			const response = await stsClient.send(command)

			if (!response.Account) {
				throw new Error('Failed to retrieve AWS account ID')
			}

			accountIdMap.set(credentials, response.Account)
		}

		return accountIdMap.get(credentials)!
	}
})()
