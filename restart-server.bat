@echo off
echo Stopping any existing development servers...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo Starting development server on port 3001...
npm run dev




