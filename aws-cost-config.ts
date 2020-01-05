import { FIRESTORE_COLLECTIONS } from '../../config';

export const awsCostConfig = {
  checkSchedule: {
    monthToDate: 'every 24 hours',
    today: 'every 4 hours',
  },
  firestoreCollection: `${FIRESTORE_COLLECTIONS.collected_data}/awsCost/data`,
  requiredUnitForCost: 'USD',
  configServiceKey: 'aws_cost',
  configKeys: {
    accessKeyId: 'access_key_id',
    secretAccessKey: 'secret_access_key',
  },
};
