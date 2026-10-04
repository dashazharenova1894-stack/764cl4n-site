@echo off
chcp 65001 >nul
cd /d "%~dp0native"
where dotnet >nul 2>nul || (echo Установи .NET 8 SDK: https://dotnet.microsoft.com/download/dotnet/8.0 и запусти снова. & pause & exit /b 1)
set CL4N_BASE=http://localhost:8080/
echo Лоудер будет открывать сайт с http://localhost:8080 (сначала запусти test-site.bat)
dotnet run -c Release
pause
