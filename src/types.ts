import { AutoScalingGroup } from "@aws-sdk/client-auto-scaling"
import { Trail } from "@aws-sdk/client-cloudtrail"
import { TableDescription } from "@aws-sdk/client-dynamodb"
import * as EC2 from "@aws-sdk/client-ec2"
import { FunctionConfiguration } from "@aws-sdk/client-lambda"
import { DBCluster, DBInstance } from "@aws-sdk/client-rds"
import * as S3 from "@aws-sdk/client-s3"

export interface ExtendedBucket extends S3.Bucket {
    CreationDate?: Date;
    LocationConstraint?: string;
    ARN: string;
    Policy?: string;
    Versioning?: string;
    Encryption?: S3.ServerSideEncryptionConfiguration;
    Tagging?: S3.Tag[];
}

export interface ExtendedInstance extends EC2.Instance {
    ARN: string;
    Volumes?: EC2.Volume[];
    Vpc?: EC2.Vpc;
    Subnet?: EC2.Subnet;
    SecurityGroups?: EC2.SecurityGroup[];
}

export type ResourceDescription =
    | AutoScalingGroup
    | ExtendedBucket
    | DBInstance
    | DBCluster
    | FunctionConfiguration
    | ExtendedInstance
    | Trail
    | TableDescription

export type Resources<T extends ResourceDescription = ResourceDescription> = {
    [arn: string]: T
}

export type ResourceDiscoveryError = {
    sourceArn: string,
    status: number,
    message: string
}

export interface OutputSchema {
    docVersion: '0.0.1',
    resources: Resources,
    metadata: {
        errors: ResourceDiscoveryError[],
        startedAt: string,
        finishedAt: string
    }
}