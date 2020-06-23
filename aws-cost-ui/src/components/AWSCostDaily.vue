<template>
  <stateful-resource :resource="costResource">
    <CostBarChart :entries="entries" title="AWS Cost daily [USD]" color="#e6ee9c" />
  </stateful-resource>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { StatefulResource, Resource } from 'vue-stateful-resource';
import firebase from 'firebase/app';
import { awsCostConfig } from '../../../aws-cost-config';
import { AWSCostEntryToday } from '../../../AWSCostEntry';
import { listenForDaily } from './listenForDaily';
import CostBarChart from './CostBarChart.vue';

@Component({
  components: { StatefulResource, CostBarChart },
})
export default class AWSCostDaily extends Vue {
  costResource: Resource<AWSCostEntryToday[]> = Resource.empty();

  get entries(): [string, number][] {
    const raw: AWSCostEntryToday[] = [...(this.costResource.result || [])];
    /* eslint-disable */
    console.log(raw);
    return raw
      .sort((a, b) => a.timestampMs - b.timestampMs)
      .map(e => [entryLabel(e), e.today.blendedCost]);
  }

  beforeMount() {
    listenForDaily(res => {
      this.costResource = res;
    });
  }
}
function entryLabel(entry: AWSCostEntryToday) {
  const date = new Date(entry.timestampMs);
  return date.toTimeString().substring(0, 12);
}
</script>
