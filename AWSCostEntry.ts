export interface AWSCostEntryBase {
  timestampMs: number;
  currency: 'USD';
  error?: string;
}

export interface AWSCostEntryMonthToDate extends AWSCostEntryBase {
  type: 'month_to_date';
  monthToDate: {
    startISODate: string;
    endISODate: string;
    blendedCost: number;
  };
}

export interface AWSCostEntryToday extends AWSCostEntryBase {
  type: 'today';
  today: {
    blendedCost: number;
  };
}

export type AWSCostEntry = AWSCostEntryMonthToDate | AWSCostEntryToday;
