<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\LineRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    operations: [
        new GetCollection(
            paginationEnabled: false
        ),
    ],
    normalizationContext: ['groups' => ['line:o']],
)]
#[ApiFilter(SearchFilter::class, properties: ['transportType' => 'exact'])]
#[ORM\Entity(repositoryClass: LineRepository::class)]
class Line
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['line:o'])]
    private int $id;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['line:o'])]
    private ?string $label = null;

    #[ORM\ManyToOne(inversedBy: 'lines')]
    #[ORM\JoinColumn(nullable: false)]
    private ?TransportType $transportType = null;

    /**
     * @var Collection<int, Station>
     */
    #[ORM\OneToMany(targetEntity: Station::class, mappedBy: 'line', orphanRemoval: true)]
    private Collection $stations;

    #[ORM\Column(length: 255, nullable: true, unique: true)]
    #[Groups(['line:o'])]
    private ?string $lineId = null;

    public function __construct()
    {
        $this->stations = new ArrayCollection();
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

    public function getTransportType(): ?TransportType
    {
        return $this->transportType;
    }

    public function setTransportType(?TransportType $transportType): static
    {
        $this->transportType = $transportType;

        return $this;
    }

    /**
     * @return Collection<int, Station>
     */
    public function getStations(): Collection
    {
        return $this->stations;
    }

    public function addStation(Station $station): static
    {
        if (!$this->stations->contains($station)) {
            $this->stations->add($station);
            $station->setLine($this);
        }

        return $this;
    }

    public function removeStation(Station $station): static
    {
        if ($this->stations->removeElement($station)) {
            // set the owning side to null (unless already changed)
            if ($station->getLine() === $this) {
                $station->setLine(null);
            }
        }

        return $this;
    }

    public function getLineId(): ?string
    {
        return $this->lineId;
    }

    public function setLineId(?string $lineId): static
    {
        $this->lineId = $lineId;

        return $this;
    }
}
