<?php

declare(strict_types=1);

namespace App\Entity\Movie;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Entity\AbstractEntity;
use App\Entity\MediaObject;
use App\Repository\Movie\MovieRepository;
use App\State\MovieListProvider;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    order: ['createdAt' => 'DESC'],
    security: "is_granted('ROLE_ADMIN')",
    normalizationContext: ['groups' => ['movie:read']],
    denormalizationContext: ['groups' => ['movie:write']],
    operations: [
        new GetCollection(
            provider: MovieListProvider::class,
        ),
        new Get(),
        new Post(),
        new Patch(),
    ]
)]
#[ORM\Entity(repositoryClass: MovieRepository::class)]
class Movie extends AbstractEntity
{
    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['movie:read'])]
    private string $title;

    /**
     * @var Collection<int, Actor>
     */
    #[ORM\ManyToMany(targetEntity: Actor::class, inversedBy: 'movies')]
    private Collection $actors;

    #[ORM\Column(nullable: true)]
    #[Groups(['movie:read'])]
    private ?\DateTimeImmutable $releaseDate = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['movie:read'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['movie:read'])]
    private array $links = [];

    #[ORM\ManyToOne]
    #[Groups(['movie:read'])]
    private ?MediaObject $photo = null;

    public function __construct()
    {
        $this->actors = new ArrayCollection();
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return Collection<int, Actor>
     */
    public function getActors(): Collection
    {
        return $this->actors;
    }

    public function addActor(Actor $actor): static
    {
        if (!$this->actors->contains($actor)) {
            $this->actors->add($actor);
        }

        return $this;
    }

    public function removeActor(Actor $actor): static
    {
        $this->actors->removeElement($actor);

        return $this;
    }

    public function getReleaseDate(): ?\DateTimeImmutable
    {
        return $this->releaseDate;
    }

    public function setReleaseDate(?\DateTimeImmutable $releaseDate): static
    {
        $this->releaseDate = $releaseDate;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getLinks(): array
    {
        return $this->links;
    }

    public function setLinks(array $links): static
    {
        $this->links = $links;

        return $this;
    }

    public function getPhoto(): ?MediaObject
    {
        return $this->photo;
    }

    public function setPhoto(?MediaObject $photo): static
    {
        $this->photo = $photo;

        return $this;
    }
}
