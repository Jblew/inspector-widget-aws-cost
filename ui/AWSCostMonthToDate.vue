<template>
  <stateful-resource :resource="costResource">
    <CostBarChart :entries="entries" title="AWS Cost Month-to-date [USD]" color="#f48fb1" />
  </stateful-resource>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { StatefulResource, Resource } from 'vue-stateful-resource';
import firebase from 'firebase/app';
import { awsCostConfig } from '../aws-cost-config';
import { AWSCostEntryMonthToDate } from '../AWSCostEntry';
import { listenForMonthToDate } from './listenForMonthToDate';
import CostBarChart from './CostBarChart.vue';

@Component({
  components: { StatefulResource, CostBarChart },
})
export default class AWSCostMonthToDate extends Vue {
  costResource: Resource<AWSCostEntryMonthToDate[]> = Resource.empty();

  get entries(): [string, number][] {
    const raw: AWSCostEntryMonthToDate[] = [...(this.costResource.result || [])];
    return raw
      .sort((a, b) => a.timestampMs - b.timestampMs)
      .map(e => [entryLabel(e), e.monthToDate.blendedCost]);
  }

  beforeMount() {
    listenForMonthToDate(res => {
      this.costResource = res;
    });
  }
}
function entryLabel(entry: AWSCostEntryMonthToDate) {
  const date = new Date(entry.timestampMs);
  return date.toISOString().substring(0, 10);
}
</script>
