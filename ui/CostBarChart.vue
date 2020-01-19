<script lang="ts">
import { Component, Mixins, Watch, Prop } from 'vue-property-decorator';
import { Bar } from 'vue-chartjs';
import { ChartData, ChartOptions, ChartDataSets } from 'chart.js';

@Component
export default class CostBarChart extends Mixins(Bar) {
  @Prop({ required: true, type: Array })
  entries!: CostBarEntry[];

  @Prop({ required: true, type: String })
  title!: string;

  @Prop({ required: true, type: String })
  color!: string;

  @Watch('entries')
  entriesChanged() {
    this.rerender();
  }

  mounted() {
    this.rerender();
  }

  rerender() {
    const labels = this.entries.map(entry => entry[0]);
    const series = this.entries.map(entry => entry[1]);

    const dataset: ChartDataSets = { label: this.title, data: series, backgroundColor: this.color };
    const data: ChartData = {
      labels,
      datasets: [dataset],
    };

    const options: ChartOptions = { maintainAspectRatio: false };
    this.renderChart(data, options);
  }
}

type CostBarEntry = [string, number];
</script>
