import {SQSClient, ListQueuesCommand, GetQueueAttributesCommand} from '@aws-sdk/client-sqs'
import {Credentials, Resources, SQSQueue} from '@/types'
import {RateLimiter} from '@/scanners/common/RateLimiter'

export async function getSQSQueues(
	credentials: Credentials,
	rateLimiter: RateLimiter,
	region: string,
): Promise<Resources<SQSQueue>> {
	const client = new SQSClient({credentials, region})

	const listQueuesCommand = new ListQueuesCommand({})
	const listQueuesResponse = await rateLimiter.throttle(() => client.send(listQueuesCommand))

	const resources: {[arn: string]: SQSQueue} = {}
	for (const queueUrl of listQueuesResponse.QueueUrls || []) {
		const getQueueAttributesCommand = new GetQueueAttributesCommand({QueueUrl: queueUrl, AttributeNames: ['All']})
		const queueAttributes = await rateLimiter.throttle(() => client.send(getQueueAttributesCommand))

		const attributes = queueAttributes.Attributes as SQSQueue

		if (attributes) {
			const queueArn = attributes.QueueArn
			if (queueArn) {
				resources[queueArn] = attributes
			}
		}
	}

	return resources
}
