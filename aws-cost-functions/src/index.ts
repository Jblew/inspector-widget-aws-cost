// tslint:disable no-console
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { functionsConfig } from '../../../../config';
import { awsCostConfig } from '../../aws-cost-config';
import { AWSCostEntry } from '../../AWSCostEntry';
import { fetchCosts } from './fetchCosts';

const firebaseApp = admin.initializeApp();
const firestore = firebaseApp.firestore();

export const awsCostCheck = functions
  .region(functionsConfig.defaultRegion)
  .pubsub.schedule(awsCostConfig.checkSchedule)
  .onRun(async () => {
    try {
      await handler();
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

async function handler() {
  try {
    const credentials = getCredentials();
    const costEntry: AWSCostEntry = await fetchCosts(credentials);
    await saveCostEntry(costEntry);
  } catch (error) {
    console.error(error);
    const errorEntry: Partial<AWSCostEntry> = {
      error: error.message,
    };
    await saveCostEntry(errorEntry);
  }
}

function getCredentials() {
  const accessKeyId = functions.config()[awsCostConfig.configServiceKey][
    awsCostConfig.configKeys.accessKeyId
  ];
  const secretAccessKey = functions.config()[awsCostConfig.configServiceKey][
    awsCostConfig.configKeys.secretAccessKey
  ];
  return { accessKeyId, secretAccessKey };
}

async function saveCostEntry(costEntry: Partial<AWSCostEntry>) {
  await firestore
    .collection(awsCostConfig.firestoreCollection)
    .doc(`${Date.now()}`)
    .create(costEntry);
}
