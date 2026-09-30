# Deploy Autoreal to RuVDS VPS.
# Usage (from project root or any cwd):
#   powershell -ExecutionPolicy Bypass -File .\scripts\deploy.ps1

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path (Join-Path $ProjectRoot "package.json"))) {
  $ProjectRoot = Get-Location
}

$ServerHost = if ($env:AUTOREAL_DEPLOY_HOST) { $env:AUTOREAL_DEPLOY_HOST } else { "170.168.112.201" }
$ServerUser = if ($env:AUTOREAL_DEPLOY_USER) { $env:AUTOREAL_DEPLOY_USER } else { "root" }
$SshKey = if ($env:AUTOREAL_DEPLOY_KEY) { $env:AUTOREAL_DEPLOY_KEY } else { Join-Path $env:USERPROFILE ".ssh\autoreal_deploy" }
$RemoteDir = "/var/www/autoreal"

$SshTarget = "${ServerUser}@${ServerHost}"
$SshOpts = @("-i", $SshKey, "-o", "IdentitiesOnly=yes", "-o", "StrictHostKeyChecking=accept-new")

Write-Host "==> Project: $ProjectRoot"
Write-Host "==> Target:  $SshTarget:$RemoteDir"
Write-Host "==> Key:     $SshKey"

if (-not (Test-Path $SshKey)) {
  throw "SSH key not found: $SshKey"
}

Set-Location $ProjectRoot

Write-Host "`n==> npm run build"
npm run build
if ($LASTEXITCODE -ne 0) { throw "Build failed" }

$OutputDir = Join-Path $ProjectRoot ".output"
if (-not (Test-Path (Join-Path $OutputDir "server\index.mjs"))) {
  throw "Missing .output/server/index.mjs — build did not produce output"
}

Write-Host "`n==> Upload .output (scp)"
# Ensure remote parent exists, then replace .output
& ssh @SshOpts $SshTarget "mkdir -p $RemoteDir && rm -rf $RemoteDir/.output"
if ($LASTEXITCODE -ne 0) { throw "Remote prepare failed" }

& scp @SshOpts -r $OutputDir "${SshTarget}:${RemoteDir}/"
if ($LASTEXITCODE -ne 0) { throw "Upload failed" }

Write-Host "`n==> Install server deps + restart PM2"
$RemoteCmd = "set -e; cd $RemoteDir/.output/server; npm install --omit=dev; cd $RemoteDir; pm2 restart autoreal || pm2 start ecosystem.config.cjs; pm2 save; curl -sI http://127.0.0.1:3000 | head -n 5"

& ssh @SshOpts $SshTarget $RemoteCmd
if ($LASTEXITCODE -ne 0) { throw "Remote restart failed" }

Write-Host "`n==> Done. Site: http://$ServerHost"
