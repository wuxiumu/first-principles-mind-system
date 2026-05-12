<?php
// FPS Unified Router — serves both static frontend and API
// Usage: cd dist && php -S 0.0.0.0:8080 router.php
// Or:    php -S 0.0.0.0:8080 -t dist/ dist/router.php

// 判断是 API 请求还是静态文件
if (strpos($_SERVER['REQUEST_URI'], '/api/') === 0) {
    require __DIR__ . '/api/server.php';
    return true;
}

// SPA fallback：文件不存在时返回 index.html
if ($_SERVER['REQUEST_METHOD'] === 'GET' && !file_exists(__DIR__ . $_SERVER['REQUEST_URI'])) {
    require __DIR__ . '/index.html';
    return true;
}

return false;
