<template>
  <div id="aws-cost-month-to-date">
    <h1>Aws cost</h1>
    <stateful-resource :resource="costRes"> </stateful-resource>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { StatefulResource, Resource } from 'vue-stateful-resource';
import { getFirebaseSubcollection } from '@/helpers';
import { awsCostConfig } from '../aws-cost-config';
import { AWSCostEntry } from '../AWSCostEntry';


function getCol() {
  return getFirebaseSubcollection(awsCostConfig.firestoreCollection);
}

async function getData() {
  const qs = await getCol()
    .limit(100)
    .orderBy('timestampMs', 'desc').get();
  return qs.docs.map(doc => doc.data() as AWSCostEntry);
}

@Component({
  components: { StatefulResource },
})
export default class AWSCostMonthToDate extends Vue {
  costRes: Resource<AWSCostEntry[]> = Resource.empty()

  beforeMount() {
    Resource.fetchResource('aws-cost-month-to-date', () => getData(), (res) => { this.costRes = res; });
  }
}

</script>

<style>
#aws-cost-month-to-date {
  border: 1px solid red;
}
</style>
