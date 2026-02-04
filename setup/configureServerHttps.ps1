
$htaccessPath = "..\.htaccess"
$htaccessContent = @"
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
"@
Set-Content -Path $htaccessPath -Value $htaccessContent -Encoding UTF8
Write-Host ".htaccess file created/updated at $htaccessPath"