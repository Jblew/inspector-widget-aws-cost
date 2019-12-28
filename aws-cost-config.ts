import { FIRESTORE_COLLECTIONS } from '../../config';

export const awsCostConfig = {
  checkSchedule: 'every 4 minutes',
  firestoreCollection: `${FIRESTORE_COLLECTIONS.collected_data}/awsCost/data`,
  requiredUnitForCost: 'USD',
  configServiceKey: 'aws_cost',
  configKeys: {
    accessKeyId: 'access_key_id',
    secretAccessKey: 'secret_access_key',
  },
};
