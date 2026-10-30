<?php

// Zips a directory's contents (dotfiles included) for scripts/package-release.mjs:
//   php scripts/make-zip.php <source-dir> <archive.zip>

declare(strict_types=1);

[, $source, $target] = $argv + [null, null, null];
if ($source === null || $target === null || !is_dir($source)) {
    fwrite(STDERR, "usage: php make-zip.php <source-dir> <archive.zip>\n");
    exit(2);
}

$zip = new ZipArchive();
if ($zip->open($target, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
    fwrite(STDERR, "cannot create {$target}\n");
    exit(1);
}

$base = rtrim(str_replace('\\', '/', (string) realpath($source)), '/') . '/';
$files = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($source, FilesystemIterator::SKIP_DOTS),
    RecursiveIteratorIterator::SELF_FIRST,
);
foreach ($files as $file) {
    $path = str_replace('\\', '/', (string) $file->getRealPath());
    $name = substr($path, strlen($base));
    $file->isDir() ? $zip->addEmptyDir($name) : $zip->addFile($path, $name);
}

$count = $zip->numFiles;
$zip->close();
echo "{$count} entries\n";
