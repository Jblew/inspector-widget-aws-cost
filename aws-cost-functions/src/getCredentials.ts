import * as functions from 'firebase-functions';
import ow from 'ow--fork-by-jblew-with-catching';

export function getCredentials() {
  const accessKeyId = functions.config().aws_cost.access_key_id;
  ow(accessKeyId, 'firebase.functions.config().aws_cost.access_key_id', ow.string.nonEmpty);

  const secretAccessKey = functions.config().aws_cost.secret_access_key;
  ow(secretAccessKey, 'firebase.functions.config().aws_cost.secretAccessKey', ow.string.nonEmpty);

  return { accessKeyId, secretAccessKey };
}
