// tslint:disable no-console
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { awsCostConfig } from '../../aws-cost-config';
import { fetchMonthToDateCosts } from './fetchMonthToDate';
import { getRegion } from './getRegion';
import { handler } from './handler';
import { fetchTodayCosts } from './fetchToday';

const firebaseApp = admin.initializeApp();
const firestore = firebaseApp.firestore();
const region = getRegion();

const aws_cost_check_month_to_date = functions
  .region(region)
  .pubsub.schedule(awsCostConfig.checkSchedule.monthToDate)
  .onRun(async () => {
    try {
      await handler(firestore, fetchMonthToDateCosts);
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

const aws_cost_check_today = functions
  .region(region)
  .pubsub.schedule(awsCostConfig.checkSchedule.today)
  .onRun(async () => {
    try {
      await handler(firestore, fetchTodayCosts);
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

export const aws_cost = { aws_cost_check_month_to_date, aws_cost_check_today };
