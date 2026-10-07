<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Doctrine\Orm\Paginator;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\Movie\MovieRepository;
use Doctrine\ORM\Tools\Pagination\Paginator as DoctrinePaginator;

class MovieListProvider implements ProviderInterface
{
    public function __construct(
        private MovieRepository $movieRepository,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): Paginator
    {
        $qb = $this->movieRepository->findMoviesByFilters($context['filters'] ?? []);

        return new Paginator(new DoctrinePaginator($qb->getQuery()));
    }
}
