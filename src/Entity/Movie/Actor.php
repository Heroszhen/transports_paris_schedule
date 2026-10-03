<?php

declare(strict_types=1);

namespace App\Entity\Movie;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Entity\AbstractEntity;
use App\Repository\Movie\ActorRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    order: ['id' => 'DESC'],
    security: "is_granted('ROLE_ADMIN')",
    normalizationContext: ['groups' => ['actor:read']],
    denormalizationContext: ['groups' => ['actor:write']],
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Patch(),
    ]
)]
#[ApiFilter(SearchFilter::class, properties: ['name' => 'ipartial'])]
#[ORM\Entity(repositoryClass: ActorRepository::class)]
class Actor extends AbstractEntity
{
    #[ORM\Column(length: 255)]
    #[Groups(['actor:write', 'actor:read'])]
    #[Assert\NotBlank]
    private ?string $name = null;

    /**
     * @var Collection<int, Movie>
     */
    #[ORM\ManyToMany(targetEntity: Movie::class, mappedBy: 'actors')]
    private Collection $movies;

    public function __construct()
    {
        $this->movies = new ArrayCollection();
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection<int, Movie>
     */
    public function getMovies(): Collection
    {
        return $this->movies;
    }

    public function addMovie(Movie $movie): static
    {
        if (!$this->movies->contains($movie)) {
            $this->movies->add($movie);
            $movie->addActor($this);
        }

        return $this;
    }

    public function removeMovie(Movie $movie): static
    {
        if ($this->movies->removeElement($movie)) {
            $movie->removeActor($this);
        }

        return $this;
    }
}
