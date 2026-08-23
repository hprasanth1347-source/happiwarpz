@echo off
title Happiwrapz E-Commerce Server (Online & Local Mode)
echo ====================================================
echo   HAPPIWRAPZ E-COMMERCE SERVER (ONLINE / LAN)       
echo ====================================================
echo.
echo Starting server listening on all network interfaces...
echo Local Access:   http://localhost:3000
echo Network Access: http://10.89.72.44:3000
echo.

cd /d "%~dp0"
call npm run dev:online

pause
