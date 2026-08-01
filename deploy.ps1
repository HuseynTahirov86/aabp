$ErrorActionPreference = "Stop"
$serverHost = "aabporg.uk"
$serverUser = "aabporg"
$serverPath = "/home/aabporg/app"
$standalone = ".next/standalone"
$sshTarget  = "${serverUser}@${serverHost}"
$scpTarget  = "${serverUser}@${serverHost}:${serverPath}"

Write-Host "=== 1. LOKAL BUILD ===" -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { throw "Build ugursuz" }

Write-Host "`n=== 2. STANDALONE HAZIRLANIR ===" -ForegroundColor Cyan
if (-not (Test-Path $standalone)) { throw "Standalone tapilmadi" }

Write-Host "  public/ kopyalanir..."
Copy-Item -Path "public" -Destination "$standalone/public" -Recurse -Force

Write-Host "  .next/static/ kopyalanir..."
New-Item -ItemType Directory -Path "$standalone/.next" -Force | Out-Null
Copy-Item -Path ".next/static" -Destination "$standalone/.next/static" -Recurse -Force

if (Test-Path "storage") {
    Write-Host "  storage/ kopyalanir..."
    Copy-Item -Path "storage" -Destination "$standalone/storage" -Recurse -Force
}

Write-Host "  .env kopyalanir..."
Copy-Item -Path ".env" -Destination "$standalone/.env" -Force

Write-Host "`n=== 3. SERVER TEMIZLENIR (.env + storage/ qorunur) ===" -ForegroundColor Cyan
ssh $sshTarget "cd $serverPath; rm -rf `$(ls -A | grep -v -E '^\.env$|^storage$')"
if ($LASTEXITCODE -ne 0) { throw "Temizleme ugursuz" }

Write-Host "`n=== 4. FAYLLAR YUKLENIR ===" -ForegroundColor Cyan
scp -r "$standalone/." "$scpTarget/"
if ($LASTEXITCODE -ne 0) { throw "Yukleme ugursuz" }

Write-Host "`n=== 5. SERVERDE KOHNE PROSESLER TEMIZLENIR ===" -ForegroundColor Cyan
ssh $sshTarget "pkill -9 -f 'next-server' 2>/dev/null; mkdir -p $serverPath/tmp; touch $serverPath/tmp/restart.txt; sleep 1; echo done"

Write-Host "`n=== BITDI. Sayti yoxlayin: https://aabporg.uk ===" -ForegroundColor Green