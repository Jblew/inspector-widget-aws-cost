import { DateTime } from 'luxon';
import * as AWS from 'aws-sdk';
import { AWSCostEntry } from '../../AWSCostEntry';
import ow from 'ow--fork-by-jblew-with-catching';

const requiredCurrency = 'USD';

export async function fetchTodayCosts(costExplorer: AWS.CostExplorer) {
  const todayCost = await fetchToday(costExplorer);

  const costEntry: AWSCostEntry = {
    currency: 'USD',
    type: 'today',
    timestampMs: Date.now(),
    today: todayCost,
  };
  return costEntry;
}

async function fetchToday(costExplorer: AWS.CostExplorer) {
  const Start = getTodayDay();
  const End = getTomorrowDay();
  const resp = await costExplorer
    .getCostAndUsage({
      TimePeriod: {
        Start,
        End,
      },
      Granularity: 'DAILY',
      Metrics: ['BLENDED_COST'],
    })
    .promise();

  const timePeriod = resp.ResultsByTime![0].TimePeriod;
  const total = resp.ResultsByTime![0].Total!;

  ow(timePeriod?.Start, 'fetchToday().timePeriod.Start', ow.string.equals(Start));
  ow(timePeriod?.End, 'fetchToday().timePeriod.Etart', ow.string.equals(End));
  ow(
    total.BlendedCost.Unit,
    'fetchToday().timePeriod.BlendedCost.Unit',
    ow.string.equals(requiredCurrency),
  );
  ow(
    total.UnblendedCost.Unit,
    'fetchToday().timePeriod.UnblendedCost.Unit',
    ow.string.equals(requiredCurrency),
  );

  return {
    blendedCost: Number(total.BlendedCost.Amount),
    unblendedCost: Number(total.UnblendedCost.Amount),
  };
}

function getTodayDay() {
  return DateTime.utc().toISODate();
}

function getTomorrowDay() {
  return DateTime.utc()
    .plus({ days: 1 })
    .toISODate();
}
