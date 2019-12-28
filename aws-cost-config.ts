import { FIRESTORE_COLLECTIONS } from '../../config';

export const awsCostConfig = {
  checkSchedule: 'every 4 minutes',
  firestoreCollection: `${FIRESTORE_COLLECTIONS.collected_data}/awsCost/data`,
};
