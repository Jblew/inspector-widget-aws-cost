#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "${DIR}"
set -e

npm i -g npm
npm i -g firebase firebase-tools

npm --prefix=./aws-cost-functions ci
npm --prefix=./aws-cost-functions run build
firebase deploy --only functions
