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
    ├── index.php        # 入口文件
    ├── server.php       # API 逻辑（查询参数路由）
    └── router.php       # 统一路由
```

## 部署

### 一键启动（推荐）

```bash
cd dist
php -S 0.0.0.0:8080 router.php
```

`router.php` 统一处理：
- `/api/*` → 转发到 `api/index.php`（查询参数路由）
- 其他 → 静态文件，SPA fallback 到 `index.html`

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
        fastcgi_param SCRIPT_FILENAME $document_root/api/index.php;
        include fastcgi_params;
    }
}
```

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
