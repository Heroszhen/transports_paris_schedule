<?php

declare(strict_types=1);

namespace App\Controller\Action;

use App\Entity\MediaObject;
use App\Service\S3Service;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

#[AsController]
class MediaObjectController
{
    public function __construct(
        private S3Service $s3Service,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function __invoke(Request $request): MediaObject
    {
        $file = $request->files->get('file');
        if (!$file) {
            throw new BadRequestHttpException('file is required.');
        }

        /** @var UploadedFile $file */
        $originalName = $file->getClientOriginalName();
        $newName = uniqid().'_'.$originalName;
        $filePath = $file->getPathname();
        $mimeType = $file->getMimeType();
        if (null === $mimeType) {
            throw new BadRequestHttpException('file extention is unknown.');
        }

        $this->s3Service->sendFile($newName, $filePath);

        $mediaObject = (new MediaObject())
            ->setOriginalName($originalName)
            ->setName($newName);

        $this->entityManager->persist($mediaObject);
        $this->entityManager->flush();

        return $mediaObject;
    }
}
