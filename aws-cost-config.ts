const baseCollection = 'collected_data';

export const awsCostConfig = {
  checkSchedule: {
    monthToDate: 'every 24 hours',
    today: 'every 4 hours',
  },
  firestoreCollection: `${baseCollection}/awsCost/data`,
  requiredUnitForCost: 'USD',
  configServiceKey: 'aws_cost',
  configKeys: {
    accessKeyId: 'access_key_id',
    secretAccessKey: 'secret_access_key',
  },
};
