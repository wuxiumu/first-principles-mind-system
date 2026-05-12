#!/bin/bash

echo "🚀 Starting First Principles Mind System..."

# 启动 PHP 后端 API
echo "📡 Starting PHP API server on port 3001..."
php -S localhost:3001 -t server/ server/server.php &
SERVER_PID=$!

# 等待 server 启动
sleep 1

# 启动前端
echo "🎨 Starting frontend dev server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ All services started!"
echo "   Frontend: http://localhost:5174"
echo "   API:      http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all services"

trap "kill $SERVER_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
