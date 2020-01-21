import { Resource } from 'vue-stateful-resource';
import firebase from 'firebase/app';
import { AWSCostEntryMonthToDate } from '@AWSCostEntry';
import { awsCostConfig } from '@aws-cost-config';
import { listenForSnapshots } from './listenForSnapshots';

export const listenForMonthToDate = (cb: (res: Resource<AWSCostEntryMonthToDate[]>) => void) =>
  listenForSnapshots(getQuery(), processDocuments, cb);

function getQuery() {
  return getCollection()
    .limit(300)
    .orderBy('timestampMs', 'desc');
}

function processDocuments(docs: firebase.firestore.QueryDocumentSnapshot[]) {
  return docs
    .map(doc => doc.data() as AWSCostEntryMonthToDate)
    .filter(entry => entry.type === 'month_to_date')
    .slice(0, 50);
}

function getCollection() {
  return firebase.firestore().collection(awsCostConfig.firestoreCollections.monthToDate);
}
