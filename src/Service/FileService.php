<?php

declare(strict_types=1);

namespace App\Service;

class FileService
{
    public function readCSV(string $filePath, string $separator = ';'): array
    {
        $rows = [];
        $fp = fopen($filePath, 'rb');
        if (false === $fp) {
            return $rows;
        }

        while (($data = fgetcsv($fp, 0, $separator)) !== false) {
            if (1 === \count($data) && '' === trim((string) $data[0])) {
                continue;
            }

            $rows[] = $data;
        }

        fclose($fp);

        return $rows;
    }
}
