$ErrorActionPreference = "Stop"

$serverHost = "aabporg.uk"
$serverUser = "aabporg"
$serverPath = "/home/aabporg/app"
$standalone = ".next\standalone"

if (-not (Test-Path $standalone)) {
    Write-Host "Xeta: $standalone tapilmadi. Evvel build edin." -ForegroundColor Red
    exit 1
}

Write-Host "=== Server temizlenir (.env + storage/ qorunur) ===" -ForegroundColor Cyan
ssh "$serverUser@$serverHost" "cd $serverPath; find . -mindepth 1 -not -name '.env' -not -name 'storage' -exec rm -rf {} +"
if ($LASTEXITCODE -ne 0) { throw "Temizleme ugursuz" }

Write-Host "`n=== Fayllar yuklenir ===" -ForegroundColor Cyan
scp -r "$standalone\*" "$serverUser@$serverHost:$serverPath"
if ($LASTEXITCODE -ne 0) { throw "Yukleme ugursuz" }

Write-Host "`n=== Bitdi. cPanel-den restart edin. ===" -ForegroundColor Green
