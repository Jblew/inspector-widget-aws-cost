// tslint:disable no-console
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { FIREBASE_CONFIG, functionsConfig } from '../../../../config';
import { awsCostConfig } from '../../aws-cost-config';

const firebaseApp = admin.initializeApp(FIREBASE_CONFIG);
const firestore = firebaseApp.firestore();

// based on: https://firebase.google.com/docs/firestore/solutions/schedule-export
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
  firestore.collection(awsCostConfig.firestoreCollection).add({
    timestamp: Date.now(),
    error: 'Not implemented yet',
  });
}
