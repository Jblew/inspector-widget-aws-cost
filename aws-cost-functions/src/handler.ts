// tslint:disable no-console

import { AWSCostEntry } from '../../AWSCostEntry';
import { getCredentials } from './getCredentials';
import { getCostExplorer } from './getCostExplorer';

export async function handler(
  firestore: FirebaseFirestore.Firestore,
  collection: string,
  fetchFn: (costExplorer: AWS.CostExplorer) => Promise<AWSCostEntry>,
) {
  try {
    const costExplorer = await getCostExplorer(getCredentials());
    const costEntry: AWSCostEntry = await fetchFn(costExplorer);
    await saveCostEntry(firestore, collection, costEntry);
  } catch (error) {
    console.error(error);
    const errorEntry: Partial<AWSCostEntry> = {
      error: error.message,
    };
    await saveCostEntry(firestore, collection, errorEntry);
  }
}

async function saveCostEntry(
  firestore: FirebaseFirestore.Firestore,
  collection: string,
  costEntry: Partial<AWSCostEntry>,
) {
  await firestore
    .collection(collection)
    .doc(`${Date.now()}`)
    .create(costEntry);
}
