<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\StationRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    operations: [
        new GetCollection(
            paginationEnabled: false
        ),
    ],
    normalizationContext: ['groups' => ['station:o']],
)]
#[ApiFilter(SearchFilter::class, properties: ['line' => 'exact'])]
#[ORM\Entity(repositoryClass: StationRepository::class)]
class Station
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['station:o'])]
    private int $id;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['station:o'])]
    private ?string $label = null;

    #[ORM\ManyToOne(inversedBy: 'stations')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Line $line = null;

    #[ORM\Column(length: 255, nullable: true, unique: true)]
    #[Groups(['station:o'])]
    private ?string $stopId = null;

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(?string $label): static
    {
        $this->label = $label;

        return $this;
    }

    public function getLine(): ?Line
    {
        return $this->line;
    }

    public function setLine(?Line $line): static
    {
        $this->line = $line;

        return $this;
    }

    public function getStopId(): ?string
    {
        return $this->stopId;
    }

    public function setStopId(?string $stopId): static
    {
        $this->stopId = $stopId;

        return $this;
    }
}
