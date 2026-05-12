<?php
// FPS API Server
// Usage: php -S localhost:3001 -t server/ server/server.php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

// 书籍元数据
$books = [
    [
        'id' => '7d-mgmt',
        'title' => '7 天管理高手体系',
        'cover' => '📚',
        'description' => '一套写给普通管理者的 7 天实战管理体系，让你从"自己会干"升级为"能带人干成"',
        'totalDays' => 7,
        'tags' => ['管理', '实战', '目标'],
    ],
];

// ID 到实际文件夹的映射
$bookDirMap = [
    '7d-mgmt' => '7天管理高手体系',
    'first-principles' => '第一性原理',
];

$baseDir = __DIR__ . '/../data/book';
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api/', '', $path);
$segments = explode('/', trim($path, '/'));

// GET /api/books
if ($segments[0] === 'books') {
    // GET /api/books/:bookId/days/:day
    if (isset($segments[2]) && $segments[2] === 'days' && isset($segments[3])) {
        getDay($books, $baseDir, $bookDirMap, $segments);
    // GET /api/books/:bookId/intro
    } elseif (isset($segments[2]) && $segments[2] === 'intro') {
        getIntro($baseDir, $bookDirMap, $segments);
    // GET /api/books/:bookId
    } elseif (isset($segments[1])) {
        getBook($books, $baseDir, $bookDirMap, $segments);
    // GET /api/books
    } else {
        json_response($books);
    }
} else {
    http_response_code(404);
    json_response(['error' => 'Not found']);
}

function getBook($books, $baseDir, $bookDirMap, $segments) {
    $bookId = $segments[1];
    $book = findBook($books, $bookId);

    if (!$book) {
        http_response_code(404);
        json_response(['error' => 'Book not found']);
        return;
    }

    $dirName = $bookDirMap[$bookId] ?? $bookId;
    $daysDir = $baseDir . '/' . $dirName . '/days';

    if (!is_dir($daysDir)) {
        http_response_code(500);
        json_response(['error' => 'Days directory not found']);
        return;
    }

    $days = [];
    $files = scandir($daysDir);
    sort($files);

    foreach ($files as $file) {
        if (preg_match('/^day-(\d+)\.md$/', $file, $m)) {
            $filePath = $daysDir . '/' . $file;
            $content = file_get_contents($filePath);
            $parsed = parseFrontMatter($content);

            $days[] = [
                'id' => $parsed['frontmatter']['id'] ?? ('day-' . $m[1]),
                'day' => $parsed['frontmatter']['day'] ?? intval($m[1]),
                'title' => $parsed['frontmatter']['title'] ?? $file,
                'subtitle' => $parsed['frontmatter']['title'] ?? '',
                'content' => $parsed['body'],
                'raw' => $parsed['frontmatter'],
            ];
        }
    }

    usort($days, fn($a, $b) => $a['day'] - $b['day']);

    json_response(array_merge($book, ['days' => $days]));
}

function getDay($books, $baseDir, $bookDirMap, $segments) {
    $bookId = $segments[1];
    $day = $segments[3];

    $dirName = $bookDirMap[$bookId] ?? $bookId;
    $filePath = $baseDir . '/' . $dirName . '/days/day-' . $day . '.md';

    if (!file_exists($filePath)) {
        http_response_code(404);
        json_response(['error' => 'Day not found']);
        return;
    }

    $content = file_get_contents($filePath);
    $parsed = parseFrontMatter($content);

    json_response([
        'id' => $parsed['frontmatter']['id'] ?? ('day-' . $day),
        'day' => $parsed['frontmatter']['day'] ?? $day,
        'title' => $parsed['frontmatter']['title'] ?? '',
        'subtitle' => $parsed['frontmatter']['title'] ?? '',
        'content' => $parsed['body'],
        'raw' => $parsed['frontmatter'],
    ]);
}

function getIntro($baseDir, $bookDirMap, $segments) {
    $bookId = $segments[1];
    $dirName = $bookDirMap[$bookId] ?? $bookId;
    $nodeFile = $baseDir . '/' . $dirName . '/node.md';

    if (!file_exists($nodeFile)) {
        json_response(['content' => '']);
        return;
    }

    $content = file_get_contents($nodeFile);
    json_response(['content' => $content]);
}

function findBook($books, $id) {
    foreach ($books as $book) {
        if ($book['id'] === $id) return $book;
    }
    return null;
}

function parseFrontMatter($raw) {
    if (preg_match('/^---\s*\n(.*?)\n---\s*\n(.*)$/s', $raw, $matches)) {
        $frontmatter = parseYamlSimple($matches[1]);
        return ['frontmatter' => $frontmatter, 'body' => $matches[2]];
    }
    return ['frontmatter' => [], 'body' => $raw];
}

function parseYamlSimple($yaml) {
    $result = [];
    $lines = explode("\n", $yaml);
    $currentKey = null;
    $currentArray = null;

    foreach ($lines as $line) {
        if (trim($line) === '') continue;

        // Array item
        if (preg_match('/^\s+-\s+(.*)$/', $line, $m)) {
            if ($currentKey && $currentArray !== null) {
                $currentArray[] = trim($m[1], "'\" ");
            }
            continue;
        }

        // Key-value
        if (preg_match('/^(\w+):\s*(.*)$/', $line, $m)) {
            $key = $m[1];
            $value = trim($m[2]);

            if ($value === '') {
                $currentKey = $key;
                $currentArray = [];
            } elseif ($value === '[]') {
                $result[$key] = [];
                $currentKey = null;
                $currentArray = null;
            } else {
                $value = trim($value, "'\"");
                // Try numeric
                if (is_numeric($value)) {
                    $value = intval($value);
                }
                $result[$key] = $value;
                $currentKey = null;
                $currentArray = null;
            }
        } elseif ($currentKey) {
            $result[$currentKey] = $currentArray;
            $currentKey = null;
            $currentArray = null;
        }
    }

    if ($currentKey && $currentArray !== null) {
        $result[$currentKey] = $currentArray;
    }

    return $result;
}

function json_response($data) {
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
