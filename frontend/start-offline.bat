@echo off
title Happiwrapz E-Commerce Server (Offline Mode)
echo ====================================================
echo   HAPPIWRAPZ HANDMADE FLOWERS & GIFTS (OFFLINE)     
echo ====================================================
echo Starting local web server on http://localhost:3000...
echo.

cd /d "%~dp0"
call npm run dev

pause
