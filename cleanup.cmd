@echo off
taskkill /IM "All-in-One Desktop App.exe" /F >nul 2>&1
timeout /t 2 >nul
rmdir /s /q dist win-unpacked >nul 2>&1