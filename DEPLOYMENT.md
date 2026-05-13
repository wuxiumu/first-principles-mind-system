# 部署指南

## 环境要求

- PHP 7.4+（无需 Nginx/Apache，PHP 内置服务器即可）

## 快速开始

### 开发模式

```bash
./start.sh
# 或分开启动：
php -S localhost:3001 -t server/ server/server.php   # API
npm run dev                                           # 前端
```

### 生产构建

`symlink.sh` 通过顶部配置变量控制部署行为：

```bash
# 配置区（脚本顶部）
DEPLOY_DIR=""       # 留空 → 打包到 dist/
DEPLOY_HOST=""      # 留空 → 本地部署
```

**模式一：本地打包**（留空 DEPLOY_DIR）

```bash
./symlink.sh
# 产物在本项目 dist/ 目录下
```

**模式二：直接部署到服务器**

修改 `symlink.sh` 顶部配置：

```bash
DEPLOY_DIR="/www/wwwroot/cg.dwd5.cc"    # 服务器 Web 根目录
DEPLOY_HOST="root@cg.dwd5.cc"           # 远程服务器（可选）
```

部署到 `/www/wwwroot/cg.dwd5.cc` 的完整步骤：

```bash
# ─── 方式 A：本地构建后 scp/rsync 上传 ───

# 1. 修改 symlink.sh，设置 DEPLOY_DIR="/www/wwwroot/cg.dwd5.cc"
# 2. 构建（产物在本地 dist/ 下）
DEPLOY_DIR="" ./symlink.sh   # 或直接 ./symlink.sh（DEPLOY_DIR 留空时默认打 dist/）

# 3. 上传到服务器
rsync -avz --delete dist/ root@your-server:/www/wwwroot/cg.dwd5.cc/

# ─── 方式 B：本地构建后直接输出到目标路径（本机部署）───

# 1. 修改 symlink.sh 顶部：DEPLOY_DIR="/www/wwwroot/cg.dwd5.cc"
# 2. 运行（直接构建到目标目录）
./symlink.sh

# ─── 方式 C：服务器端构建 ───

# 1. 把整个项目上传到服务器（git clone 或 scp）
git clone <your-repo> /www/wwwroot/cg.dwd5.cc
cd /www/wwwroot/cg.dwd5.cc

# 2. 安装依赖并构建
npm install
# 修改 symlink.sh: DEPLOY_DIR="/www/wwwroot/cg.dwd5.cc"
./symlink.sh
```

**nginx 配置** (`/etc/nginx/conf.d/cg.dwd5.cc.conf`):

```nginx
server {
    listen 80;
    server_name cg.dwd5.cc;
    root /www/wwwroot/cg.dwd5.cc;
    index index.html;

    # 前端 SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # PHP API
    location /api/ {
        fastcgi_pass unix:/tmp/php-cgi-74.sock;  # 改为你的 PHP-FPM socket
        fastcgi_param SCRIPT_FILENAME $document_root/api/index.php;
        include fastcgi_params;
    }
}
```

部署后目录结构：

```
/www/wwwroot/cg.dwd5.cc/
├── index.html           # 前端 SPA
├── assets/              # JS/CSS 打包文件
├── router.php           # PHP 路由（开发调试用）
├── api/                 # API 入口
│   ├── index.php        # API 入口（?action=xxx）
│   └── server.php       # API 逻辑
└── data/                # 书籍数据
    └── book/
```

访问验证：
- `http://cg.dwd5.cc/` → 前端页面
- `http://cg.dwd5.cc/api/index.php?action=books` → API 返回书籍列表

## 部署

### 一键启动（开发调试）

```bash
cd dist
php -S 0.0.0.0:8080 router.php
```

`router.php` 统一处理：
- `/api/*` → 转发到 `api/index.php`（查询参数路由）
- 其他 → 静态文件，SPA fallback 到 `index.html`

### Nginx + PHP-FPM（生产环境）

见上方「部署到 `/www/wwwroot/cg.dwd5.cc`」的 nginx 配置示例。

## API 接口规范

所有接口通过查询参数路由，无需服务器额外配置：

| 接口 | 参数 | 说明 |
|------|------|------|
| `?action=books` | - | 获取书籍列表 |
| `?action=book&id=7d-mgmt` | `id`: 书籍 ID | 获取书籍详情（含所有天数） |
| `?action=day&book_id=7d-mgmt&day=1` | `book_id`: 书籍 ID, `day`: 天数 | 获取某一天的内容 |
| `?action=intro&book_id=7d-mgmt` | `book_id`: 书籍 ID | 获取书籍简介 |

## 环境变量

| 变量 | 说明 | 默认 |
|------|------|------|
| `VITE_API_BASE` | API 地址 | `http://localhost:3001/api/index.php`（开发） `/api/index.php`（生产） |

生产构建自动使用 `/api/index.php`，前后端同端口。
