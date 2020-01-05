import * as functions from 'firebase-functions';
import ow from 'ow--fork-by-jblew-with-catching';

export function getRegion() {
  const region = functions.config().default_region;
  ow(region, 'firebase.functions.config().default_region', ow.string.nonEmpty);

  return region;
}
