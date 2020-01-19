<template>
  <div id="aws-cost-month-to-date">
    <h1>Aws cost</h1>
    <stateful-resource :resource="costResource">
      <div v-for="(elem, index) in costResource.result" :key="index">
        {{ JSON.stringify(elem) }}
      </div>
    </stateful-resource>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { StatefulResource, Resource } from 'vue-stateful-resource';
import firebase from 'firebase/app';
import { awsCostConfig } from '../aws-cost-config';
import { AWSCostEntry } from '../AWSCostEntry';

function getCol() {
  console.log(`Col=${awsCostConfig.firestoreCollection}`);
  return firebase.firestore().collection(awsCostConfig.firestoreCollection);
}

async function getData() {
  const qs = await getCol()
    .limit(100)
    .orderBy('timestampMs', 'desc')
    .where('type', '==', 'month_to_date')
    .get();
  return qs.docs.map(doc => doc.data() as AWSCostEntry);
}

@Component({
  components: { StatefulResource },
})
export default class AWSCostMonthToDate extends Vue {
  costResource: Resource<AWSCostEntry[]> = Resource.empty();

  get entries(): AWSCostEntry[] {
    return this.costResource.result || [];
  }

  beforeMount() {
    Resource.fetchResource(
      'aws-cost-month-to-date',
      () => getData(),
      costResource => {
        this.costResource = costResource;
        console.log(costResource);
      },
    );
  }
}
</script>

<style>
#aws-cost-month-to-date {
  border: 1px solid red;
}
</style>
