<?php

declare(strict_types=1);

namespace App\Service;

use Aws\Result;
use Aws\S3\Exception\S3Exception;
use Aws\S3\S3Client;

class S3Service
{
    private S3Client $s3Client;

    public function __construct()
    {
        $this->s3Client = new S3Client([
            'region' => 'eu-west-3',
            'version' => 'latest',
            'credentials' => [
                'key' => $_ENV['AWS_KEY'],
                'secret' => $_ENV['AWS_SECRET_KEY'],
            ],
        ]);
    }

    public function sendFile(string $fileName, string $filePath): ?Result
    {
        $openedPath = fopen($filePath, 'r');
        if (false === $openedPath) {
            throw new \RuntimeException('file can not be opened');
        }

        try {
            return $this->s3Client->putObject([
                'Bucket' => $_ENV['AWS_BUCKET'],
                'Key' => $_ENV['AWS_ROOT'].'/'.$fileName,
                'Body' => $openedPath,
                'ACL' => 'public-read',
            ]);
        } catch (S3Exception $e) {
        }

        return null;
    }

    public function deleteFile(string $fileName): ?Result
    {
        try {
            return $this->s3Client->deleteObject([
                'Bucket' => $_ENV['AWS_BUCKET'],
                'Key' => $_ENV['AWS_ROOT'].'/'.$fileName,
            ]);
        } catch (S3Exception $e) {
        }

        return null;
    }
}
