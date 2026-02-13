#!/bin/bash

echo "=========================================="
echo "  TODO 项目一键启动脚本"
echo "=========================================="
echo ""

# 检查 Go 是否安装
if ! command -v go &> /dev/null; then
    echo "❌ 未检测到 Go，请先安装 Go"
    exit 1
fi

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "⚠️  未检测到 Node.js，将只启动后端"
    SKIP_FRONTEND=true
else
    SKIP_FRONTEND=false
fi

echo "✅ 环境检查完成"
echo ""

# 启动后端
echo "🚀 启动后端服务..."
go run main.go &
BACKEND_PID=$!
echo "后端服务已启动 (PID: $BACKEND_PID)"
echo "后端地址: http://localhost:8080"
echo ""

# 等待后端启动
sleep 2

# 启动前端
if [ "$SKIP_FRONTEND" = false ]; then
    echo "🚀 启动前端服务..."
    cd frontend

    # 检查是否已安装依赖
    if [ ! -d "node_modules" ]; then
        echo "📦 检测到未安装依赖，正在安装..."
        npm install
    fi

    npm run dev &
    FRONTEND_PID=$!
    cd ..
    echo "前端服务已启动 (PID: $FRONTEND_PID)"
    echo "前端地址: http://localhost:3000"
    echo ""
fi

echo "=========================================="
echo "✨ 所有服务已启动"
echo "=========================================="
echo ""
echo "按 Ctrl+C 停止所有服务"
echo ""

# 捕获 Ctrl+C 信号
trap 'echo ""; echo "正在停止所有服务..."; kill $BACKEND_PID 2>/dev/null; [ "$SKIP_FRONTEND" = false ] && kill $FRONTEND_PID 2>/dev/null; echo "已停止所有服务"; exit 0' INT

# 保持脚本运行
wait
