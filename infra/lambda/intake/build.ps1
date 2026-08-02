$ErrorActionPreference = "Stop"

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $here

if (Test-Path dist) { Remove-Item -Recurse -Force dist }
New-Item -ItemType Directory -Path dist | Out-Null

npm install --silent

Copy-Item handler.mjs dist/handler.mjs

# Bundle node_modules into zip (simple, no bundler)
Compress-Archive -Force -Path dist/*,node_modules,package.json -DestinationPath dist.zip

Write-Host "Wrote $(Join-Path $here 'dist.zip')"
