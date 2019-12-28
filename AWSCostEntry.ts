export interface AWSCostEntry {
  timestampMs: number;
  monthToDate: {
    startISODate: string;
    endISODate: string;
    blendedCost: number;
    unblendedCost: number;
  };
  today: {
    blendedCost: number;
    unblendedCost: number;
  };
  currency: 'USD';
  error?: string;
}
