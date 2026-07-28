param([switch]$SkipBuild)

$ErrorActionPreference = "Stop"

$serverHost  = "aabporg.uk"
$serverUser  = "aabporg"
$serverPath  = "/home/aabporg/app"
$standalone  = ".next\standalone"

if (-not $SkipBuild) {
    Write-Host "=== 1. BUILD ===" -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build failed" }

    Write-Host "`n=== 2. PREPARE STANDALONE ===" -ForegroundColor Cyan
    if (-not (Test-Path $standalone)) { throw "Standalone output not found at: $standalone" }

    Write-Host "  Copying public/ ..."
    Copy-Item -Path "public" -Destination "$standalone\public" -Recurse -Force

    Write-Host "  Copying .next/static/ ..."
    New-Item -ItemType Directory -Path "$standalone\.next" -Force | Out-Null
    Copy-Item -Path ".next\static" -Destination "$standalone\.next\static" -Recurse -Force

    if (Test-Path "storage") {
        Write-Host "  Copying storage/ ..."
        Copy-Item -Path "storage" -Destination "$standalone\storage" -Recurse -Force
    }
} else {
    Write-Host "=== SKIPPING BUILD ===" -ForegroundColor Yellow
    if (-not (Test-Path $standalone)) { throw "Standalone not found. Run without -SkipBuild first." }
}

Write-Host "`n=== 3. CLEAN SERVER (keep .env + storage/) ===" -ForegroundColor Cyan
Write-Host "  You'll be prompted for password (3 times)"
ssh "$serverUser@$serverHost" "cd $serverPath; find . -mindepth 1 -not -name '.env' -not -name 'storage' -exec rm -rf {} +"
if ($LASTEXITCODE -ne 0) { throw "SSH clean failed" }

Write-Host "`n=== 4. UPLOAD FILES ===" -ForegroundColor Cyan
scp -r "$standalone\*" "$serverUser@$serverHost:$serverPath"
if ($LASTEXITCODE -ne 0) { throw "SCP upload failed" }

Write-Host "`n=== 5. RESTART ===" -ForegroundColor Cyan
ssh "$serverUser@$serverHost" "cd $serverPath; mkdir -p tmp; touch tmp/restart.txt"
Write-Host "  Restart signal sent."

Write-Host "`n=== DEPLOY COMPLETE ===" -ForegroundColor Green
Write-Host "If the app doesn't auto-restart, restart it from cPanel."
