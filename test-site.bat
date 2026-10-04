@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Сайт откроется на http://localhost:8080  (закрой это окно, чтобы остановить)
start "" http://localhost:8080/
where py >nul 2>nul && (py -m http.server 8080 & goto :eof)
where python >nul 2>nul && (python -m http.server 8080 & goto :eof)
echo Нужен Python: https://www.python.org/downloads/  (при установке отметь Add to PATH)
pause
