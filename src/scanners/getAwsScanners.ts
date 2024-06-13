import {Credentials, Scanner, ScannerLifecycleHook} from '@/types'
import {GetRateLimiterFunction} from './types'
import {createRegionalScanner, createGlobalScanner} from '.'

import {getAutoScalingResources} from './scan-functions/aws/autoscaling'
import {getCloudFrontDistributions} from './scan-functions/aws/cloudfront-distributions'
import {getCloudTrailResources} from './scan-functions/aws/cloudtrail'
import {getDynamoDBResources} from './scan-functions/aws/dynamodb'
import {getECSResources} from './scan-functions/aws/ecs'
import {getEFSFileSystems} from './scan-functions/aws/efs-file-systems'
import {getEKSResources} from './scan-functions/aws/eks'
import {getELBV2Resources} from './scan-functions/aws/elbv2'
import {getLambdaResources} from './scan-functions/aws/lambda'
import {getS3Buckets} from './scan-functions/aws/s3-buckets'
import {getSNSTopics} from './scan-functions/aws/sns'
import {getEC2Instances} from './scan-functions/aws/ec2-instances'
import {getEC2Vpcs} from './scan-functions/aws/ec2-vpcs'
import {getEC2VpcEndpoints} from './scan-functions/aws/ec2-vpc-endpoints'
import {getEC2Subnets} from './scan-functions/aws/ec2-subnets'
import {getEC2RouteTables} from './scan-functions/aws/ec2-route-tables'
import {getEC2InternetGateways} from './scan-functions/aws/ec2-internet-gateways'
import {getEC2NatGateways} from './scan-functions/aws/ec2-nat-gateways'
import {getEC2TransitGateways} from './scan-functions/aws/ec2-transit-gateways'
import {getEC2Volumes} from './scan-functions/aws/ec2-volumes'
import {getRDSInstances} from './scan-functions/aws/rds-instances'
import {getRDSClusters} from './scan-functions/aws/rds-clusters'
import {getRDSProxies} from './scan-functions/aws/rds-proxies'
import {getHostedZones} from './scan-functions/aws/route53-hosted-zones'

interface GetAwsScannersArguments {
	credentials: Credentials
	getRateLimiter: GetRateLimiterFunction
	hooks: ScannerLifecycleHook[]
	regions: string[]
	shouldIncludeGlobalServices: boolean
}

export const getAwsScanners = ({
	credentials,
	hooks,
	getRateLimiter,
	regions,
	shouldIncludeGlobalServices,
}: GetAwsScannersArguments): Scanner[] => {
	const options = {
		credentials,
		getRateLimiter,
		hooks,
	}

	// Regional scanners
	const scanners: Scanner[] = [
		createRegionalScanner('autoscaling', getAutoScalingResources, regions, options),
		createRegionalScanner('dynamodb', getDynamoDBResources, regions, options),
		createRegionalScanner('ec2/instances', getEC2Instances, regions, options),
		createRegionalScanner('ec2/vpcs', getEC2Vpcs, regions, options),
		createRegionalScanner('ec2/vpc-endpoints', getEC2VpcEndpoints, regions, options),
		createRegionalScanner('ec2/subnets', getEC2Subnets, regions, options),
		createRegionalScanner('ec2/route-tables', getEC2RouteTables, regions, options),
		createRegionalScanner('ec2/internet-gateways', getEC2InternetGateways, regions, options),
		createRegionalScanner('ec2/nat-gateways', getEC2NatGateways, regions, options),
		createRegionalScanner('ec2/transit-gateways', getEC2TransitGateways, regions, options),
		createRegionalScanner('ec2/volumes', getEC2Volumes, regions, options),
		createRegionalScanner('ecs', getECSResources, regions, options),
		createRegionalScanner('efs', getEFSFileSystems, regions, options),
		createRegionalScanner('elbv2', getELBV2Resources, regions, options),
		createRegionalScanner('eks', getEKSResources, regions, options),
		createRegionalScanner('lambda', getLambdaResources, regions, options),
		createRegionalScanner('rds/instances', getRDSInstances, regions, options),
		createRegionalScanner('rds/clusters', getRDSClusters, regions, options),
		createRegionalScanner('rds/proxies', getRDSProxies, regions, options),
		createRegionalScanner('route53/hostedzone', getHostedZones, regions, options),
		createRegionalScanner('sns', getSNSTopics, regions, options),
	]

	// Global scanners
	if (shouldIncludeGlobalServices) {
		scanners.push(
			createGlobalScanner('cloudfront/distributions', getCloudFrontDistributions, options),
			createGlobalScanner('cloudtrail/trails', getCloudTrailResources, options),
			createGlobalScanner('s3/buckets', getS3Buckets, options),
		)
	}

	return scanners
}
