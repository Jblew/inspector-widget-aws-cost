<template>
  <div id="aws-cost-month-to-date">
    <h1>Aws cost</h1>
    <stateful-resource :resource="costResource">
      <div v-for="(elem, index) in entries" :key="index">
        {{ JSON.stringify(elem) }}
      </div>
      <span>Total {{ entries.length }}</span>
    </stateful-resource>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { StatefulResource, Resource } from 'vue-stateful-resource';
import firebase from 'firebase/app';
import { awsCostConfig } from '../aws-cost-config';
import { AWSCostEntryMonthToDate } from '../AWSCostEntry';
import { listenForMonthToDate } from './listenForMonthToDate';

@Component({
  components: { StatefulResource },
})
export default class AWSCostMonthToDate extends Vue {
  costResource: Resource<AWSCostEntryMonthToDate[]> = Resource.empty();

  get entries(): AWSCostEntryMonthToDate[] {
    return this.costResource.result || [];
  }

  beforeMount() {
    listenForMonthToDate(res => {
      this.costResource = res;
    });
  }
}
</script>

<style>
#aws-cost-month-to-date {
  border: 1px solid red;
}
</style>
