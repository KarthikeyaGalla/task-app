@echo off
echo Starting Task Manager App...
start "Task Manager Backend" /D "server" cmd /k npm start
timeout /t 5
start "Task Manager Frontend" /D "client" cmd /k npm run dev
echo "App started! Backend on port 5000, Frontend on port 5173"
