#!/usr/bin/env bash
set -e

SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_DIR="$( cd "${SCRIPTS_DIR}" && cd .. && pwd )"

if [[ -f "${PROJECT_DIR}/.env" ]]; then
  set -o allexport
  source "${PROJECT_DIR}/.env"
  set +o allexport
fi

cd "${PROJECT_DIR}"
yarn build
cd build

VERSION=$(jq -r ".version" ./manifest.json)

zip -r -X "../ump-toolbox-v${VERSION}.zip" .

cd "${PROJECT_DIR}"
npx crx pack build -o "ump-toolbox-v${VERSION}.crx"
