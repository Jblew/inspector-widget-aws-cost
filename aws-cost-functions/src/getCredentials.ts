import * as functions from 'firebase-functions';
import { awsCostConfig } from '../../aws-cost-config';

export function getCredentials() {
  const accessKeyId = functions.config()[awsCostConfig.configServiceKey][
    awsCostConfig.configKeys.accessKeyId
  ];
  const secretAccessKey = functions.config()[awsCostConfig.configServiceKey][
    awsCostConfig.configKeys.secretAccessKey
  ];
  return { accessKeyId, secretAccessKey };
}
