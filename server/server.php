<?php
// FPS API Server
// Usage: php -S localhost:3001 -t server/ server/server.php
// All params via URL query string: ?action=xxx

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Max-Age: 86400');

$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($requestMethod === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

$baseDir = __DIR__ . '/../data/book';
$books = loadBooks($baseDir);
$action = $_GET['action'] ?? '';

// ?action=books
if ($action === 'books') {
    json_response($books);
// ?action=book&id=7d-mgmt
} elseif ($action === 'book') {
    getBook($books, $baseDir);
// ?action=day&book_id=7d-mgmt&day=1
} elseif ($action === 'day') {
    getDay($books, $baseDir);
// ?action=intro&book_id=7d-mgmt
} elseif ($action === 'intro') {
    getIntro($books, $baseDir);
} else {
    http_response_code(400);
    json_response(['error' => 'Unknown action']);
}

function loadBooks($baseDir) {
    if (!is_dir($baseDir)) return [];

    $books = [];
    $entries = scandir($baseDir);
    sort($entries);

    foreach ($entries as $entry) {
        if ($entry === '.' || $entry === '..') continue;

        $bookDir = $baseDir . '/' . $entry;
        if (!is_dir($bookDir)) continue;

        $metaFile = $bookDir . '/README.md';
        if (!file_exists($metaFile)) continue;

        $parsed = parseFrontMatter(file_get_contents($metaFile));
        $meta = $parsed['frontmatter'];
        if (($meta['type'] ?? 'book') !== 'book') continue;

        $days = loadBookDays($baseDir, $entry);
        $books[] = [
            'id' => $meta['id'] ?? slugify($entry),
            'dir' => $entry,
            'title' => $meta['title'] ?? inferTitleFromMarkdown($parsed['body']) ?? $entry,
            'cover' => $meta['cover'] ?? '📘',
            'description' => $meta['description'] ?? firstNonEmptyParagraph($parsed['body']),
            'totalDays' => count($days),
            'tags' => normalizeList($meta['tags'] ?? []),
            'progress' => $meta['progress'] ?? 0,
            'createdAt' => $meta['created_at'] ?? $meta['createdAt'] ?? '',
            'sortOrder' => $meta['sort_order'] ?? $meta['sortOrder'] ?? 999,
            'purpose' => $meta['purpose'] ?? '',
            'summary' => $meta['summary'] ?? '',
            'prediction' => $meta['prediction'] ?? '',
        ];
    }

    usort($books, function ($a, $b) {
        $sortA = $a['sortOrder'] ?? 999;
        $sortB = $b['sortOrder'] ?? 999;
        if ($sortA !== $sortB) return $sortA - $sortB;
        return strcmp($b['createdAt'] ?? '', $a['createdAt'] ?? '');
    });

    return $books;
}

function getBook($books, $baseDir) {
    $bookId = $_GET['id'] ?? '';
    $book = findBook($books, $bookId);

    if (!$book) {
        http_response_code(404);
        json_response(['error' => 'Book not found']);
        return;
    }

    $days = loadBookDays($baseDir, $book['dir']);

    json_response(array_merge($book, ['days' => $days]));
}

function getDay($books, $baseDir) {
    $bookId = $_GET['book_id'] ?? '';
    $day = $_GET['day'] ?? '';

    if (!$bookId || !$day) {
        http_response_code(400);
        json_response(['error' => 'Missing book_id or day']);
        return;
    }

    $book = findBook($books, $bookId);
    if (!$book) {
        http_response_code(404);
        json_response(['error' => 'Book not found']);
        return;
    }

    $filePath = $baseDir . '/' . $book['dir'] . '/days/day-' . $day . '.md';

    if (!file_exists($filePath)) {
        $rootFiles = getRootChapterFiles($baseDir . '/' . $book['dir']);
        $index = intval($day) - 1;
        if (!isset($rootFiles[$index])) {
            http_response_code(404);
            json_response(['error' => 'Day not found']);
            return;
        }
        $filePath = $rootFiles[$index];
    }

    json_response(parseDayFile($filePath, intval($day), 'day-' . $day));
}

function loadBookDays($baseDir, $dirName) {
    $bookDir = $baseDir . '/' . $dirName;
    $daysDir = $bookDir . '/days';
    $days = [];

    if (is_dir($daysDir)) {
        $files = scandir($daysDir);
        sort($files);

        foreach ($files as $file) {
            if (preg_match('/^day-(\d+)\.md$/', $file, $m)) {
                $days[] = parseDayFile($daysDir . '/' . $file, intval($m[1]), 'day-' . $m[1]);
            }
        }
    } else {
        $rootFiles = getRootChapterFiles($bookDir);
        foreach ($rootFiles as $index => $filePath) {
            $days[] = parseDayFile($filePath, $index + 1, 'chapter-' . ($index + 1));
        }
    }

    usort($days, fn($a, $b) => $a['day'] - $b['day']);
    return $days;
}

function getRootChapterFiles($bookDir) {
    if (!is_dir($bookDir)) return [];

    $files = scandir($bookDir);
    sort($files);

    $paths = [];
    foreach ($files as $file) {
        if (preg_match('/^\d+-.+\.md$/u', $file) && !str_ends_with($file, '.quiz.md')) {
            $paths[] = $bookDir . '/' . $file;
        }
    }
    return $paths;
}

function parseDayFile($filePath, $fallbackDay, $fallbackId) {
    $content = file_get_contents($filePath);
    $parsed = parseFrontMatter($content);
    $frontmatter = $parsed['frontmatter'];
    $learning = extractQuizFileSections($filePath);
    $title = $frontmatter['title'] ?? inferTitleFromMarkdown($parsed['body']) ?? basename($filePath);

    return [
        'id' => $frontmatter['id'] ?? $fallbackId,
        'day' => $frontmatter['day'] ?? $fallbackDay,
        'title' => $title,
        'subtitle' => $title,
        'content' => $parsed['body'],
        'quiz' => $learning['quiz'],
        'referenceAnswer' => $learning['referenceAnswer'],
        'chapterSummary' => $learning['summary'],
        'chapterPrediction' => $learning['prediction'],
        'raw' => $frontmatter,
    ];
}

function extractQuizFileSections($chapterFilePath) {
    $quizFilePath = preg_replace('/\.md$/u', '.quiz.md', $chapterFilePath);

    if (!file_exists($quizFilePath)) {
        return emptyLearningSections();
    }

    return extractLearningSections(file_get_contents($quizFilePath));
}

function emptyLearningSections() {
    return [
        'quiz' => [],
        'referenceAnswer' => '',
        'summary' => '',
        'prediction' => '',
    ];
}

function extractLearningSections($body) {
    $sections = [
        'quiz' => [],
        'referenceAnswer' => '',
        'summary' => '',
        'prediction' => '',
    ];

    $start = mb_strpos($body, "\n## 测试题");
    if ($start === false) {
        $start = str_starts_with($body, "## 测试题") ? 0 : false;
    } else {
        $start += 1;
    }

    if ($start === false) {
        $learningBlock = trim($body);
    } else {
        $learningBlock = trim(mb_substr($body, $start));
    }

    $sections['quiz'] = parseQuizSection(getMarkdownSection($learningBlock, '测试题'));
    $sections['referenceAnswer'] = getMarkdownSection($learningBlock, '参考答案');
    $sections['summary'] = getMarkdownSection($learningBlock, '本章总结');
    $sections['prediction'] = getMarkdownSection($learningBlock, '本章预测');

    return $sections;
}

function getMarkdownSection($markdown, $heading) {
    $pattern = '/^##\s+' . preg_quote($heading, '/') . '\s*\n(.*?)(?=^##\s+|\z)/msu';
    if (preg_match($pattern, $markdown, $matches)) {
        return trim($matches[1]);
    }
    return '';
}

function parseQuizSection($markdown) {
    if (trim($markdown) === '') return [];

    $questions = [];
    $blocks = preg_split('/\n(?=\d+\.\s+)/u', trim($markdown));

    foreach ($blocks as $index => $block) {
        $lines = array_values(array_filter(array_map('trim', explode("\n", trim($block))), fn($line) => $line !== ''));
        if (!$lines) continue;

        $questionText = preg_replace('/^\d+\.\s*/u', '', array_shift($lines));
        $options = [];
        $correct = null;
        $explanation = '';

        foreach ($lines as $line) {
            if (preg_match('/^-\s*([A-D])\.\s*(.+)$/u', $line, $m)) {
                $value = ord($m[1]) - ord('A') + 1;
                $options[] = ['label' => $m[2], 'value' => $value];
                continue;
            }

            if (preg_match('/^答案[:：]\s*([A-D])$/u', $line, $m)) {
                $correct = ord($m[1]) - ord('A') + 1;
                continue;
            }

            if (preg_match('/^解析[:：]\s*(.+)$/u', $line, $m)) {
                $explanation = $m[1];
            }
        }

        if ($questionText && count($options) >= 2 && $correct !== null) {
            $questions[] = [
                'id' => 'q' . ($index + 1),
                'question' => $questionText,
                'options' => $options,
                'correct' => $correct,
                'explanation' => $explanation,
            ];
        }
    }

    return $questions;
}

function inferTitleFromMarkdown($body) {
    foreach (explode("\n", $body) as $line) {
        if (preg_match('/^#\s+(.+)$/u', trim($line), $m)) {
            return trim($m[1]);
        }
    }
    return null;
}

function firstNonEmptyParagraph($body) {
    foreach (explode("\n", $body) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || str_starts_with($line, '-')) continue;
        return $line;
    }
    return '';
}

function normalizeList($value) {
    if (is_array($value)) return $value;
    if (!is_string($value)) return [];

    $trimmed = trim($value);
    if (preg_match('/^\[(.*)\]$/', $trimmed, $m)) {
        $items = array_map('trim', explode(',', $m[1]));
        return array_values(array_filter(array_map(fn($item) => trim($item, "'\" "), $items)));
    }

    return [$trimmed];
}

function slugify($value) {
    $slug = strtolower(trim($value));
    $slug = preg_replace('/\s+/u', '-', $slug);
    return $slug ?: $value;
}

function getIntro($books, $baseDir) {
    $bookId = $_GET['book_id'] ?? '';
    $book = findBook($books, $bookId);
    if (!$book) {
        json_response(['content' => '']);
        return;
    }

    $bookDir = $baseDir . '/' . $book['dir'];
    $nodeFile = $bookDir . '/node.md';

    if (!file_exists($nodeFile)) {
        $nodeFile = $bookDir . '/README.md';
    }

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
            if ($currentKey && $currentArray !== null) {
                $result[$currentKey] = $currentArray;
                $currentKey = null;
                $currentArray = null;
            }

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
