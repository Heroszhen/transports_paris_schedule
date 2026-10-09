<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Controller\Action\MediaObjectController;
use App\Repository\MediaObjectRepository;
use App\State\MediaObjectRemoveProcessor;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    outputFormats: ['jsonld' => ['application/ld+json']],
    normalizationContext: ['groups' => ['media_object:read']],
    operations: [
        new Get(),
        new GetCollection(),
        new Post(
            controller: MediaObjectController::class,
            security: "is_granted('ROLE_ADMIN')",
            inputFormats: ['multipart' => ['multipart/form-data']],
            deserialize: false,
        ),
        new Delete(
            processor: MediaObjectRemoveProcessor::class,
            security: "is_granted('ROLE_ADMIN')"
        ),
    ]
)]
#[ORM\Entity(repositoryClass: MediaObjectRepository::class)]
class MediaObject extends AbstractEntity
{
    #[Groups(['media_object:read'])]
    #[ORM\Column(length: 255)]
    private string $originalName;

    #[Groups(['media_object:read', 'actor:read', 'movie:read', 'movie:o'])]
    #[ORM\Column(length: 255)]
    private string $name;

    public function getOriginalName(): string
    {
        return $this->originalName;
    }

    public function setOriginalName(string $originalName): static
    {
        $this->originalName = $originalName;

        return $this;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }
}
