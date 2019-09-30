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

UNSTAGED=$(git diff --name-only)
UNCOMMITTED=$(git diff --cached --name-only)

if [[ -z $UNSTAGED ]] && [[ -z $UNCOMMITTED ]]; then
  yarn build
  cd build

  VERSION=$(jq -r ".version" ./manifest.json)

  git tag "v${VERSION}"
  git push --tags

  zip -r -X "../ump-toolbox-v${VERSION}.zip" .

  cd "${PROJECT_DIR}"
  npx crx pack build -o "ump-toolbox-v${VERSION}.crx"
else
  echo "You are not in a clean git state"
  exit 1
fi
