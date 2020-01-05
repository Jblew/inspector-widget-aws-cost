import * as AWS from 'aws-sdk';

const region = 'us-east-1';

export async function getCostExplorer(credentials: {
  accessKeyId: string;
  secretAccessKey: string;
}) {
  const awsConfig = new AWS.Config();
  awsConfig.update({ credentials, region });

  return new AWS.CostExplorer(awsConfig);
}
