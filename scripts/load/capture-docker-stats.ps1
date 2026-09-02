param(
    [int]$DurationSeconds = 900,
    [int]$IntervalSeconds = 2,
    [string]$ContainerNamePattern = "ongi-*",
    [string]$OutputDirectory = "tests/load/results"
)

$ErrorActionPreference = "Stop"

if ($DurationSeconds -lt 1) {
    throw "DurationSeconds must be at least 1."
}

if ($IntervalSeconds -lt 1) {
    throw "IntervalSeconds must be at least 1."
}

New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null

$startedAt = Get-Date
$deadline = $startedAt.AddSeconds($DurationSeconds)
$samples = [System.Collections.Generic.List[object]]::new()

Write-Host "Capturing Docker stats for $DurationSeconds seconds..."
Write-Host "Container pattern: $ContainerNamePattern"

while ((Get-Date) -lt $deadline) {
    $capturedAt = (Get-Date).ToUniversalTime().ToString("o")
    $lines = docker stats --no-stream --format "{{json .}}"

    if ($LASTEXITCODE -ne 0) {
        throw "docker stats failed with exit code $LASTEXITCODE."
    }

    foreach ($line in $lines) {
        if ([string]::IsNullOrWhiteSpace($line)) {
            continue
        }

        $stat = $line | ConvertFrom-Json
        if ($stat.Name -notlike $ContainerNamePattern) {
            continue
        }

        $samples.Add([pscustomobject]@{
            capturedAt = $capturedAt
            container = $stat.Name
            cpuPercent = $stat.CPUPerc
            memoryUsage = $stat.MemUsage
            memoryPercent = $stat.MemPerc
            networkIO = $stat.NetIO
            blockIO = $stat.BlockIO
            pids = $stat.PIDs
        })
    }

    Start-Sleep -Seconds $IntervalSeconds
}

$finishedAt = Get-Date
$timestamp = $startedAt.ToUniversalTime().ToString("yyyy-MM-ddTHH-mm-ssZ")
$outputPath = Join-Path $OutputDirectory "$timestamp-docker-stats.json"

$result = [ordered]@{
    schemaVersion = 1
    startedAt = $startedAt.ToUniversalTime().ToString("o")
    finishedAt = $finishedAt.ToUniversalTime().ToString("o")
    durationSeconds = [math]::Round(($finishedAt - $startedAt).TotalSeconds, 2)
    intervalSeconds = $IntervalSeconds
    containerNamePattern = $ContainerNamePattern
    samples = $samples
}

$result | ConvertTo-Json -Depth 5 | Set-Content -Encoding utf8 $outputPath
Write-Host "Docker stats result: $outputPath"
