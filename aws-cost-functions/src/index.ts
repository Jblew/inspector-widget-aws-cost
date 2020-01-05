// tslint:disable no-console
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { functionsConfig } from '../../../../config';
import { awsCostConfig } from '../../aws-cost-config';
import { AWSCostEntry } from '../../AWSCostEntry';
import { getCredentials } from './getCredentials';
import { getCostExplorer } from './getCostExplorer';
import { fetchMonthToDateCosts } from './fetchMonthToDate';

const firebaseApp = admin.initializeApp();
const firestore = firebaseApp.firestore();

export const awsCostCheckMonthToDate = functions
  .region(functionsConfig.defaultRegion)
  .pubsub.schedule(awsCostConfig.checkSchedule.monthToDate)
  .onRun(async () => {
    try {
      await handler(fetchMonthToDateCosts);
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

export const awsCostCheckToday = functions
  .region(functionsConfig.defaultRegion)
  .pubsub.schedule(awsCostConfig.checkSchedule.today)
  .onRun(async () => {
    try {
      await handler(fetchMonthToDateCosts);
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

async function handler(fetchFn: (costExplorer: AWS.CostExplorer) => Promise<AWSCostEntry>) {
  try {
    const costExplorer = await getCostExplorer(getCredentials());
    const costEntry: AWSCostEntry = await fetchFn(costExplorer);
    await saveCostEntry(costEntry);
  } catch (error) {
    console.error(error);
    const errorEntry: Partial<AWSCostEntry> = {
      error: error.message,
    };
    await saveCostEntry(errorEntry);
  }
}

async function saveCostEntry(costEntry: Partial<AWSCostEntry>) {
  await firestore
    .collection(awsCostConfig.firestoreCollection)
    .doc(`${Date.now()}`)
    .create(costEntry);
}
