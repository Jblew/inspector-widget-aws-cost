import { Resource } from 'vue-stateful-resource';
import firebase from 'firebase/app';
import { AWSCostEntryToday } from '@AWSCostEntry';
import { awsCostConfig } from '@aws-cost-config';
import { listenForSnapshots } from './listenForSnapshots';

export const listenForDaily = (cb: (res: Resource<AWSCostEntryToday[]>) => void) =>
  listenForSnapshots(getQuery(), processDocuments, cb);

function getQuery() {
  return getCollection()
    .limit(50)
    .orderBy('timestampMs', 'desc');
}

function processDocuments(docs: firebase.firestore.QueryDocumentSnapshot[]) {
  return docs.map(doc => doc.data() as AWSCostEntryToday);
}

function getCollection() {
  return firebase.firestore().collection(awsCostConfig.firestoreCollections.daily);
}
