import { DateTime } from 'luxon';
import * as AWS from 'aws-sdk';
import { AWSCostEntry } from '../../AWSCostEntry';
import ow from 'ow--fork-by-jblew-with-catching';

const requiredCurrency = 'USD';
const region = 'us-east-1';

export async function fetchCosts(credentials: { accessKeyId: string; secretAccessKey: string }) {
  const awsConfig = new AWS.Config();
  awsConfig.update({ credentials, region });

  const costExplorer = new AWS.CostExplorer(awsConfig);

  const monthToDayCost = await fetchMonthToDate(costExplorer);
  const todayCost = await fetchToday(costExplorer);

  const costEntry: AWSCostEntry = {
    currency: 'USD',
    timestampMs: Date.now(),
    monthToDate: monthToDayCost,
    today: todayCost,
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
      Metrics: ['BLENDED_COST', 'UNBLENDED_COST'],
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
    startISODate: timePeriod!.Start!,
    endISODate: timePeriod!.End,
    blendedCost: Number(total.BlendedCost.Amount),
    unblendedCost: Number(total.UnblendedCost.Amount),
  };
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
      Metrics: ['BLENDED_COST', 'UNBLENDED_COST'],
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

function getTodayDay() {
  return DateTime.utc().toISODate();
}

function getTomorrowDay() {
  return DateTime.utc()
    .plus({ days: 1 })
    .toISODate();
}
