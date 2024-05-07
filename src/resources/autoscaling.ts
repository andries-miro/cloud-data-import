import { AutoScalingClient, DescribeAutoScalingGroupsCommand, AutoScalingGroup } from "@aws-sdk/client-auto-scaling";
import { Resources } from "../types";

async function getAutoScalingGroups(region: string): Promise<AutoScalingGroup[]> {
  const client = new AutoScalingClient({ region });
  const autoScalingGroups: AutoScalingGroup[] = [];

  let nextToken: string | undefined;
  do {
    const describeAutoScalingGroupsCommand = new DescribeAutoScalingGroupsCommand({
      MaxRecords: 100,
      NextToken: nextToken,
    });

    const describeAutoScalingGroupsResponse = await client.send(describeAutoScalingGroupsCommand);

    if (describeAutoScalingGroupsResponse.AutoScalingGroups) {
      autoScalingGroups.push(...describeAutoScalingGroupsResponse.AutoScalingGroups);
    }

    nextToken = describeAutoScalingGroupsResponse.NextToken;
  } while (nextToken);

  return autoScalingGroups;
}

export async function getAutoScalingResources(region: string): Promise<Resources<AutoScalingGroup>> {
  const autoScalingGroups = await getAutoScalingGroups(region);

  return autoScalingGroups.reduce((acc, autoScalingGroup) => {
    if (!autoScalingGroup.AutoScalingGroupARN) {
      throw new Error('AutoScalingGroupARN is missing in the response');
    }

    acc[autoScalingGroup.AutoScalingGroupARN] = autoScalingGroup;
    return acc;
  }, {} as Resources<AutoScalingGroup>);
}
