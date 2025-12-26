<#
Simple helper to download font files into this folder.
Usage examples:
  .\download-fonts.ps1 -Files @{
    'dmmono-regular-webfont.woff2' = 'https://example.com/path/to/DMMono-Regular.woff2';
    'dmmono-medium-webfont.woff2' = 'https://example.com/path/to/DMMono-Medium.woff2'
  }

If you run without parameters, the script prints the expected filenames and exits.
#>
param(
    [Parameter(Mandatory=$false)]
    [Hashtable]$Files
)

if (-not $Files) {
    Write-Host "No files specified. Example usage and expected filenames:" -ForegroundColor Yellow
    Write-Host "dmmono-regular-webfont.woff2"
    Write-Host "dmmono-regular-webfont.woff"
    Write-Host "dmmono-medium-webfont.woff2"
    Write-Host "dmmono-medium-webfont.woff"
    Write-Host "dmmono-light-webfont.woff2"
    Write-Host "dmmono-light-webfont.woff"
    Write-Host "dmmono-mediumitalic-webfont.woff2"
    Write-Host "dmmono-mediumitalic-webfont.woff"
    Write-Host "\nTo download, call the script with a hashtable mapping filenames to URLs. See script header for example." -ForegroundColor Cyan
    exit 0
}

foreach ($name in $Files.Keys) {
    $url = $Files[$name]
    $target = Join-Path -Path (Get-Location) -ChildPath $name
    Write-Host "Downloading $name from $url ..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $target -UseBasicParsing -Headers @{ 'User-Agent' = 'Mozilla/5.0' }
        Write-Host "Saved: $target" -ForegroundColor Green
    } catch {
        Write-Host "Failed to download $name: $_" -ForegroundColor Red
    }
}

Write-Host "Done. Verify the files are present and restart your dev server if necessary." -ForegroundColor Green
