#!/bin/bash

# ============================
# 配置区 — 每次部署前改这里
# ============================

# 项目根目录（自动取当前目录，一般不用改）
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 部署目标目录（留空 → 打包到 dist/）
# 命令行注入: DEPLOY_DIR="/www/wwwroot/cg.dwd5.cc" ./symlink.sh
DEPLOY_DIR="${DEPLOY_DIR:-""}"

# API 目录名（部署后通过 /api/index.php 访问接口）
API_DIR_NAME="api"

# 服务器 IP（留空表示本地部署）
# 命令行注入: DEPLOY_HOST="root@1.2.3.4" ./symlink.sh
DEPLOY_HOST="${DEPLOY_HOST:-""}"

# ============================
# 以下是构建逻辑，一般无需修改
# ============================

# 1. 确定部署目标
if [[ -n "${DEPLOY_DIR}" ]]; then
    DEPLOY_TARGET="${DEPLOY_DIR}"
else
    DEPLOY_TARGET="${PROJECT_DIR}/dist"
    echo "📦 DEPLOY_DIR 为空，默认打包到 dist/"
fi

# 2. 构建前端（输出到目标目录）
if [[ -n "${DEPLOY_DIR}" ]]; then
    echo "🔨 Building frontend → ${DEPLOY_TARGET} ..."
    npm run build -- --outDir "${DEPLOY_TARGET}"
else
    echo "🔨 Building frontend → dist/ ..."
    npm run build
fi

# 3. 复制 API 文件 + 数据文件到目标目录
API_TARGET="${DEPLOY_TARGET}/${API_DIR_NAME}"
echo "📋 Copying API files to ${API_TARGET} ..."
rm -rf "${API_TARGET}"
mkdir -p "${API_TARGET}"
cp "${PROJECT_DIR}/server/index.php"  "${API_TARGET}/"
cp "${PROJECT_DIR}/server/server.php" "${API_TARGET}/"
cp "${PROJECT_DIR}/server/router.php" "${DEPLOY_TARGET}/"

DATA_TARGET="${DEPLOY_TARGET}/data"
echo "📋 Copying data files to ${DATA_TARGET} ..."
rm -rf "${DATA_TARGET}"
if [[ -d "${PROJECT_DIR}/data" ]]; then
    cp -R "${PROJECT_DIR}/data" "${DATA_TARGET}"
fi

echo ""
echo "✅ 构建完成！"
echo ""
echo "部署目标: ${DEPLOY_TARGET}"
echo "目录结构:"
echo "  ${DEPLOY_TARGET}/"
echo "  ├── index.html           # 前端 SPA"
echo "  ├── assets/              # JS/CSS 资源"
echo "  ├── router.php           # PHP 路由（开发用）"
echo "  └── ${API_DIR_NAME}/"
echo "      ├── index.php        # API 入口"
echo "      └── server.php       # API 逻辑"
echo ""

# 4. 远程部署提示
if [[ -n "${DEPLOY_HOST}" ]]; then
    echo "📡 远程部署命令:"
    echo ""
    echo "  # 在本机运行（将构建产物上传到服务器）:"
    echo "  rsync -avz --delete ${DEPLOY_TARGET}/ ${DEPLOY_HOST}${DEPLOY_TARGET}/"
    echo ""
fi
