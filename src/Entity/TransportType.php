<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\TransportTypeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    operations: [
        new GetCollection(),
    ],
    normalizationContext: ['groups' => ['transport-type:o']],
)]
#[ORM\Entity(repositoryClass: TransportTypeRepository::class)]
class TransportType
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['transport-type:o'])]
    private int $id;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['transport-type:o'])]
    private ?string $label = null;

    /**
     * @var Collection<int, Line>
     */
    #[ORM\OneToMany(targetEntity: Line::class, mappedBy: 'transportType', orphanRemoval: true)]
    private Collection $lines;

    public function __construct()
    {
        $this->lines = new ArrayCollection();
    }

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

    /**
     * @return Collection<int, Line>
     */
    public function getLines(): Collection
    {
        return $this->lines;
    }

    public function addLine(Line $line): static
    {
        if (!$this->lines->contains($line)) {
            $this->lines->add($line);
            $line->setTransportType($this);
        }

        return $this;
    }

    public function removeLine(Line $line): static
    {
        if ($this->lines->removeElement($line)) {
            // set the owning side to null (unless already changed)
            if ($line->getTransportType() === $this) {
                $line->setTransportType(null);
            }
        }

        return $this;
    }
}
