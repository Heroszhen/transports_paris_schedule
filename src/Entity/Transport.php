<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\TransportRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TransportRepository::class)]
class Transport
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private int $id;

    #[ORM\Column(length: 255)]
    private string $name;

    #[ORM\Column(length: 255)]
    private string $label;

    /**
     * @var Collection<int, Line>
     */
    #[ORM\OneToMany(targetEntity: Line::class, mappedBy: 'transport', orphanRemoval: true)]
    private Collection $lines;

    public function __construct()
    {
        $this->lines = new ArrayCollection();
    }

    public function getId(): int
    {
        return $this->id;
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

    public function getLabel(): string
    {
        return $this->label;
    }

    public function setLabel(string $label): static
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
            $line->setTransport($this);
        }

        return $this;
    }

    public function removeLine(Line $line): static
    {
        if ($this->lines->removeElement($line)) {
            // set the owning side to null (unless already changed)
            if ($line->getTransport() === $this) {
                $line->setTransport(null);
            }
        }

        return $this;
    }
}
