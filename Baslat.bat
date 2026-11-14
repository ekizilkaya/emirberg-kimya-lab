@echo off
chcp 65001 >nul
title Emirberg Kimya Lab
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Node.js bulunamadi. Lutfen once https://nodejs.org adresinden Node.js LTS surumunu kur.
  echo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo  Ilk calistirma: gerekli paketler kuruluyor, biraz surebilir...
  call npm install
  if errorlevel 1 goto hata
)

if not exist dist\index.html (
  echo  Oyun hazirlaniyor...
  call npm run build
  if errorlevel 1 goto hata
)

echo.
echo  Emirberg Kimya Lab aciliyor... Bu pencereyi kapatirsan oyun da kapanir.
echo.
call npx vite preview --port 4173 --open
goto :eof

:hata
echo.
echo  Bir sorun oldu. Yukaridaki mesajlari bir buyugune goster.
pause
exit /b 1
