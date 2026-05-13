<?php
// API 入口 — 直接加载 server.php 逻辑
$script = __DIR__ . '/server.php';

if (!file_exists($script)) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Server file not found: ' . $script]);
    exit;
}

require $script;
