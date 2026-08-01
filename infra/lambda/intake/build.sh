#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "$0")" && pwd)"
cd "$script_dir"

rm -rf dist dist.zip
npm ci --silent
mkdir -p dist
cp handler.mjs dist/handler.mjs
zip -qr dist.zip dist node_modules package.json

printf 'Wrote %s\n' "$script_dir/dist.zip"
