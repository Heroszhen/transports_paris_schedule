<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\LineRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LineRepository::class)]
class Line
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private int $id;

    #[ORM\Column(length: 255)]
    private string $name;

    #[ORM\Column(length: 255)]
    private string $line;

    #[ORM\ManyToOne(inversedBy: 'lines')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Transport $transport = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $primStopId = null;

    public function getId(): ?int
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

    public function getLine(): string
    {
        return $this->line;
    }

    public function setLine(string $line): static
    {
        $this->line = $line;

        return $this;
    }

    public function getTransport(): ?Transport
    {
        return $this->transport;
    }

    public function setTransport(?Transport $transport): static
    {
        $this->transport = $transport;

        return $this;
    }

    public function getPrimStopId(): ?string
    {
        return $this->primStopId;
    }

    public function setPrimStopId(?string $primStopId): static
    {
        $this->primStopId = $primStopId;

        return $this;
    }
}
