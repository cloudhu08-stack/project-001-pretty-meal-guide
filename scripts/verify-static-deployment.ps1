param(
  [Parameter(Mandatory = $true)][uri]$Url,
  [string]$ReportPath = 'artifacts/mirror-deployment/public-file-parity.json'
)

$ErrorActionPreference = 'Stop'
if ($Url.Scheme -ne 'https') { throw 'A public HTTPS URL is required.' }
$projectRoot = Split-Path -Parent $PSScriptRoot
$distRoot = (Resolve-Path -LiteralPath (Join-Path $projectRoot 'dist')).Path
$reportFile = [IO.Path]::GetFullPath((Join-Path $projectRoot $ReportPath))
if (-not $reportFile.StartsWith($projectRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
  throw 'The report must stay inside this project.'
}
$reportDirectory = Split-Path -Parent $reportFile
New-Item -ItemType Directory -Path $reportDirectory -Force | Out-Null
$responseFile = Join-Path $reportDirectory ('response-' + [guid]::NewGuid().ToString('N') + '.bin')
$baseUrl = $Url.GetLeftPart([UriPartial]::Authority)
$indexFile = Get-Item -LiteralPath (Join-Path $distRoot 'index.html')
$files = @($indexFile) + @(Get-ChildItem -LiteralPath $distRoot -File -Recurse | Where-Object { $_.FullName -ne $indexFile.FullName })
$results = @()
$consecutiveFailures = 0
try {
  foreach ($file in $files) {
    $relative = $file.FullName.Substring($distRoot.Length).Replace('\', '/')
    if ($relative -eq '/index.html') { $relative = '/' }
    $entry = $null
    for ($attempt = 1; $attempt -le 2; $attempt++) {
      try {
        $response = Invoke-WebRequest -Uri ($baseUrl + $relative) -UseBasicParsing -TimeoutSec 20 -OutFile $responseFile -PassThru
        $contentType = [string]$response.Headers['Content-Type']
        $expectedType = switch ($file.Extension) {
          '.html' { 'text/html' }
          '.json' { 'application/json' }
          '.webp' { 'image/webp' }
          '.jpg' { 'image/jpeg' }
          '.png' { 'image/png' }
          default { '' }
        }
        $hash = (Get-FileHash -LiteralPath $responseFile -Algorithm SHA256).Hash
        $localHash = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash
        $entry = [pscustomobject]@{
          path = $relative
          status = [int]$response.StatusCode
          contentType = $contentType
          contentTypeMatches = $contentType.StartsWith($expectedType, [StringComparison]::OrdinalIgnoreCase)
          sha256 = $hash
          matches = ($hash -eq $localHash)
        }
        break
      } catch {
        $entry = [pscustomobject]@{ path = $relative; matches = $false; contentTypeMatches = $false; error = $_.Exception.Message }
      }
    }
    $results += $entry
    if ($entry.matches -and $entry.contentTypeMatches) { $consecutiveFailures = 0 } else { $consecutiveFailures++ }
    if ($consecutiveFailures -ge 3) { break }
  }
  $passed = ($results.Count -eq $files.Count) -and (@($results | Where-Object { -not $_.matches -or -not $_.contentTypeMatches }).Count -eq 0)
  $report = [pscustomobject]@{
    url = $baseUrl
    checkedAtUtc = [DateTime]::UtcNow.ToString('o')
    expectedFiles = $files.Count
    checkedFiles = $results.Count
    pass = $passed
    files = $results
  }
  $report | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $reportFile -Encoding UTF8
  [pscustomobject]@{ URL = $baseUrl; Checked = $results.Count; Expected = $files.Count; PASS = $passed; Report = $reportFile }
  if (-not $passed) { exit 1 }
} finally {
  if (Test-Path -LiteralPath $responseFile) { Remove-Item -LiteralPath $responseFile }
}
