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

```bash
./symlink.sh    # 构建 + 软链接 server → dist/api
```

产物结构：
```
dist/
├── index.html           # 前端 SPA
├── assets/              # 打包资源
└── api -> ../server/    # 软链接 PHP 接口
    ├── server.php       # API 路由
    └── router.php       # 统一路由
```

## 部署

### 一键启动（推荐）

```bash
cd dist
php -S 0.0.0.0:8080 router.php
```

`router.php` 统一处理：
- `/api/*` → 转发到 `api/server.php`
- 其他 → 静态文件，SPA  fallback 到 `index.html`

### Nginx + PHP-FPM

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/project/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_param SCRIPT_FILENAME $document_root/api/server.php;
        include fastcgi_params;
    }
}
```

## 环境变量

| 变量 | 说明 | 默认 |
|------|------|------|
| `VITE_API_BASE` | API 地址 | `http://localhost:3001/api`（开发） `/api`（生产） |

生产构建自动使用 `/api`，前后端同端口。
