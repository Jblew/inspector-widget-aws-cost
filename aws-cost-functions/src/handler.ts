// tslint:disable no-console

import { awsCostConfig } from '../../aws-cost-config';
import { AWSCostEntry } from '../../AWSCostEntry';
import { getCredentials } from './getCredentials';
import { getCostExplorer } from './getCostExplorer';

export async function handler(firestore: FirebaseFirestore.Firestore, fetchFn: (costExplorer: AWS.CostExplorer) => Promise<AWSCostEntry>) {
  try {
    const costExplorer = await getCostExplorer(getCredentials());
    const costEntry: AWSCostEntry = await fetchFn(costExplorer);
    await saveCostEntry(firestore, costEntry);
  } catch (error) {
    console.error(error);
    const errorEntry: Partial<AWSCostEntry> = {
      error: error.message,
    };
    await saveCostEntry(firestore, errorEntry);
  }
}

async function saveCostEntry(firestore: FirebaseFirestore.Firestore, costEntry: Partial<AWSCostEntry>) {
  await firestore
    .collection(awsCostConfig.firestoreCollection)
    .doc(`${Date.now()}`)
    .create(costEntry);
}
