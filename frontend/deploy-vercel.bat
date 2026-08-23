@echo off
title Deploy Happiwrapz to Vercel (Online Free 24/7 Cloud Hosting)
echo ====================================================
echo   DEPLOYING HAPPIWRAPZ TO VERCEL CLOUD HOSTING      
echo ====================================================
echo.
echo Launching Vercel Deployment...
echo (If prompted, press Enter to log in to your free Vercel account)
echo.

cd /d "%~dp0"
call npx vercel

echo.
echo ====================================================
echo Deployment complete! Your live URL is shown above.
echo ====================================================
pause
