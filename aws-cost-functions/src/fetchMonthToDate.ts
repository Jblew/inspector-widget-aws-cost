import { DateTime } from 'luxon';
import * as AWS from 'aws-sdk';
import { AWSCostEntry } from '../../AWSCostEntry';
import ow from 'ow--fork-by-jblew-with-catching';

const requiredCurrency = 'USD';

export async function fetchMonthToDateCosts(costExplorer: AWS.CostExplorer) {
  const monthToDayCost = await fetchMonthToDate(costExplorer);

  const costEntry: AWSCostEntry = {
    currency: 'USD',
    type: 'month_to_date',
    timestampMs: Date.now(),
    monthToDate: monthToDayCost,
  };
  return costEntry;
}

async function fetchMonthToDate(costExplorer: AWS.CostExplorer) {
  const Start = getFirstDayOfMonth();
  const End = getLastDayOfMonth();
  const resp = await costExplorer
    .getCostAndUsage({
      TimePeriod: {
        Start,
        End,
      },
      Granularity: 'MONTHLY',
      Metrics: ['BLENDED_COST'],
    })
    .promise();

  const timePeriod = resp.ResultsByTime![0].TimePeriod;
  const total = resp.ResultsByTime![0].Total!;

  ow(timePeriod?.Start, 'fetchMonthToDate().timePeriod.Start', ow.string.equals(Start));
  ow(timePeriod?.End, 'fetchMonthToDate().timePeriod.Etart', ow.string.equals(End));
  ow(
    total.BlendedCost.Unit,
    'fetchToday().timePeriod.BlendedCost.Unit',
    ow.string.equals(requiredCurrency),
  );

  return {
    startISODate: timePeriod!.Start!,
    endISODate: timePeriod!.End,
    blendedCost: Number(total.BlendedCost.Amount),
  };
}

function getFirstDayOfMonth() {
  return DateTime.utc()
    .startOf('month')
    .toISODate();
}

function getLastDayOfMonth() {
  return DateTime.utc()
    .endOf('month')
    .toISODate();
}
