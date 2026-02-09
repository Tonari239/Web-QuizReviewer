# XAMPP HTTPS Configuration Script
# This script automates the setup of HTTPS for XAMPP projects across different Windows machines

param(
    [string]$XamppPath = "",
    [string]$ProjectPath = ""
)

# Function to find XAMPP installation directory
function Find-XamppPath {
    $commonPaths = @(
        "C:\xampp",
        "C:\Program Files\xampp",
        "C:\Program Files (x86)\xampp",
        "D:\xampp"
    )
    
    foreach ($path in $commonPaths) {
        if (Test-Path "$path\apache\conf\httpd.conf") {
            return $path
        }
    }
    
    # Try to find via registry or common locations
    Write-Warning "XAMPP installation not found in common locations."
    return $null
}

# Function to backup a file
function Backup-ConfigFile {
    param([string]$FilePath)
    
    if (Test-Path $FilePath) {
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $backupPath = "$FilePath.backup_$timestamp"
        Copy-Item -Path $FilePath -Destination $backupPath -Force
        Write-Host "✓ Backed up: $backupPath" -ForegroundColor Green
        return $true
    }
    return $false
}

# Function to uncomment a line in a file
function Enable-ConfigLine {
    param(
        [string]$FilePath,
        [string]$LinePattern
    )
    
    if (-not (Test-Path $FilePath)) {
        Write-Error "File not found: $FilePath"
        return $false
    }
    
    $content = Get-Content -Path $FilePath
    $modified = $false
    $newContent = @()
    
    foreach ($line in $content) {
        if ($line -match "^\s*#\s*($LinePattern)") {
            # Uncomment the line
            $newContent += $matches[1]
            $modified = $true
            Write-Host "  Enabled: $LinePattern" -ForegroundColor Cyan
        } else {
            $newContent += $line
        }
    }
    
    if ($modified) {
        Set-Content -Path $FilePath -Value $newContent -Encoding UTF8
        return $true
    } else {
        # Check if line is already uncommented
        if ($content -match $LinePattern) {
            Write-Host "  Already enabled: $LinePattern" -ForegroundColor Yellow
            return $true
        }
    }
    
    return $false
}

# Function to restart Apache
function Restart-Apache {
    param([string]$XamppPath)
    
    Write-Host "`nRestarting Apache..." -ForegroundColor Yellow
    
    # Try to stop Apache
    $apacheExe = Join-Path $XamppPath "apache\bin\httpd.exe"
    $apacheProcess = Get-Process -Name "httpd" -ErrorAction SilentlyContinue
    
    if ($apacheProcess) {
        Write-Host "  Stopping Apache..." -ForegroundColor Cyan
        try {
            Stop-Process -Name "httpd" -Force -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 2
            Write-Host "  ✓ Apache stopped" -ForegroundColor Green
        } catch {
            Write-Warning "  Could not stop Apache gracefully"
        }
    } else {
        Write-Host "  Apache is not currently running" -ForegroundColor Yellow
    }
    
    # Start Apache
    $apacheCtl = Join-Path $XamppPath "apache_start.bat"
    if (Test-Path $apacheCtl) {
        Write-Host "  Starting Apache..." -ForegroundColor Cyan
        try {
            Start-Process -FilePath $apacheCtl -WorkingDirectory $XamppPath -WindowStyle Hidden
            Start-Sleep -Seconds 3
            
            # Verify Apache started
            $apacheProcess = Get-Process -Name "httpd" -ErrorAction SilentlyContinue
            if ($apacheProcess) {
                Write-Host "  ✓ Apache started successfully" -ForegroundColor Green
                return $true
            } else {
                Write-Warning "  Apache may not have started. Please check XAMPP Control Panel."
                return $false
            }
        } catch {
            Write-Error "  Failed to start Apache: $_"
            return $false
        }
    } else {
        Write-Warning "  apache_start.bat not found. Please start Apache manually from XAMPP Control Panel."
        return $false
    }
}

# Main execution
Write-Host "`n=== XAMPP HTTPS Configuration Script ===" -ForegroundColor Cyan
Write-Host "This script will configure Apache for HTTPS`n" -ForegroundColor Cyan

# Step 1: Determine XAMPP path
if ([string]::IsNullOrWhiteSpace($XamppPath)) {
    Write-Host "[1/8] Detecting XAMPP installation..." -ForegroundColor Yellow
    $XamppPath = Find-XamppPath
    
    if ($null -eq $XamppPath) {
        $XamppPath = Read-Host "Please enter your XAMPP installation path (e.g., C:\xampp)"
        if (-not (Test-Path "$XamppPath\apache\conf\httpd.conf")) {
            Write-Error "Invalid XAMPP path. httpd.conf not found."
            exit 1
        }
    }
} else {
    Write-Host "[1/8] Using provided XAMPP path..." -ForegroundColor Yellow
}

Write-Host "  XAMPP Path: $XamppPath" -ForegroundColor Green

# Step 2: Determine project path
if ([string]::IsNullOrWhiteSpace($ProjectPath)) {
    Write-Host "`n[2/8] Detecting project path..." -ForegroundColor Yellow
    $scriptDir = Split-Path -Parent $PSCommandPath
    $ProjectPath = Split-Path -Parent $scriptDir
    Write-Host "  Project Path: $ProjectPath" -ForegroundColor Green
} else {
    Write-Host "`n[2/8] Using provided project path..." -ForegroundColor Yellow
    Write-Host "  Project Path: $ProjectPath" -ForegroundColor Green
}

# Normalize paths
$ProjectPath = $ProjectPath.TrimEnd('\')
$httpdConfPath = Join-Path $XamppPath "apache\conf\httpd.conf"
$httpdSslConfPath = Join-Path $XamppPath "apache\conf\extra\httpd-ssl.conf"
$htaccessPath = Join-Path $ProjectPath ".htaccess"

# Step 3: Backup configuration files
Write-Host "`n[3/8] Backing up configuration files..." -ForegroundColor Yellow
Backup-ConfigFile -FilePath $httpdConfPath
Backup-ConfigFile -FilePath $httpdSslConfPath

# Step 4: Enable SSL module in httpd.conf
Write-Host "`n[4/8] Enabling SSL module in httpd.conf..." -ForegroundColor Yellow
Enable-ConfigLine -FilePath $httpdConfPath -LinePattern "LoadModule ssl_module modules/mod_ssl.so"
Enable-ConfigLine -FilePath $httpdConfPath -LinePattern "Include conf/extra/httpd-ssl.conf"

# Step 5: Enable mod_rewrite in httpd.conf
Write-Host "`n[5/8] Enabling mod_rewrite in httpd.conf..." -ForegroundColor Yellow
Enable-ConfigLine -FilePath $httpdConfPath -LinePattern "LoadModule rewrite_module modules/mod_rewrite.so"

# Step 6: Configure SSL virtual host
Write-Host "`n[6/8] Configuring SSL virtual host in httpd-ssl.conf..." -ForegroundColor Yellow

if (Test-Path $httpdSslConfPath) {
    $sslContent = Get-Content -Path $httpdSslConfPath -Raw
    
    # Update DocumentRoot
    $sslContent = $sslContent -replace 'DocumentRoot\s+"[^"]*"', "DocumentRoot `"$ProjectPath`""
    
    # Update ServerName (default to localhost:443)
    $sslContent = $sslContent -replace 'ServerName\s+\S+', 'ServerName localhost:443'
    
    # Update Directory path if it exists
    $sslContent = $sslContent -replace '<Directory\s+"[^"]*">', "<Directory `"$ProjectPath`">"
    
    # Ensure SSLEngine is on (should be by default)
    if ($sslContent -notmatch 'SSLEngine\s+on') {
        Write-Host "  Warning: SSLEngine directive not found in httpd-ssl.conf" -ForegroundColor Yellow
    }
    
    Set-Content -Path $httpdSslConfPath -Value $sslContent -Encoding UTF8
    Write-Host "  ✓ DocumentRoot set to: $ProjectPath" -ForegroundColor Green
    Write-Host "  ✓ ServerName set to: localhost:443" -ForegroundColor Green
} else {
    Write-Error "httpd-ssl.conf not found at: $httpdSslConfPath"
    exit 1
}

# Step 7: Create/Update .htaccess file for HTTP to HTTPS redirect
Write-Host "`n[7/8] Creating/Updating .htaccess file..." -ForegroundColor Yellow

$htaccessContent = @"
# Force HTTPS redirect
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
"@

Set-Content -Path $htaccessPath -Value $htaccessContent -Encoding UTF8
Write-Host "  ✓ .htaccess file created/updated at: $htaccessPath" -ForegroundColor Green

# Step 8: Restart Apache
Write-Host "`n[8/8] Restarting Apache..." -ForegroundColor Yellow
$restartSuccess = Restart-Apache -XamppPath $XamppPath

# Final summary
Write-Host "`n=== Configuration Complete! ===" -ForegroundColor Green

if ($restartSuccess) {
    Write-Host "`n✓ Apache has been restarted with HTTPS enabled" -ForegroundColor Green
    Write-Host "`nYou can now access your project at: https://localhost" -ForegroundColor White
} else {
    Write-Host "`n⚠ Please restart Apache manually from XAMPP Control Panel" -ForegroundColor Yellow
    Write-Host "Then access your project at: https://localhost" -ForegroundColor White
}

Write-Host "`nNote: Your browser may show a security warning because XAMPP uses a self-signed certificate." -ForegroundColor Yellow
Write-Host "This is normal for development. Click 'Advanced' and proceed to localhost." -ForegroundColor Yellow

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "XAMPP Path:   $XamppPath" -ForegroundColor White
Write-Host "Project Path: $ProjectPath" -ForegroundColor White
Write-Host "HTTPS URL:    https://localhost" -ForegroundColor White
Write-Host ""
