<?php

declare(strict_types=1);

namespace App\Repository\Movie;

use App\Entity\Movie\Movie;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Movie>
 */
class MovieRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Movie::class);
    }

    //    /**
    //     * @return Movie[] Returns an array of Movie objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('m.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Movie
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    public function findMoviesByFilters(array $filters): QueryBuilder
    {
        $qb = $this->createQueryBuilder('movie');

        $page = empty($filters['page']) ? 1 : $filters['page'];
        $qb
            ->setFirstResult(($page - 1) * 20)
            ->setMaxResults(20);

        if (!empty($filters['title']) && !empty($filters['actor'])) {
            $qb
                ->leftJoin('movie.actors', 'actors')
                ->andWhere(
                    $qb->expr()->orX(
                        'movie.title LIKE :title',
                        'actors.name LIKE :actor',
                    )
                )
                ->setParameter('title', "%{$filters['title']}%")
                ->setParameter('actor', "%{$filters['actor']}%");
        } else {
            if (!empty($filters['title'])) {
                $qb
                    ->andWhere('movie.title LIKE :title')
                    ->setParameter('title', "%{$filters['title']}%");
            }

            if (!empty($filters['actor'])) {
                $qb
                    ->leftJoin('movie.actors', 'actors')
                    ->andWhere('actors.name LIKE :actor')
                    ->setParameter('actor', "%{$filters['actor']}%");
            }
        }

        if (isset($filters['order']) && is_array($filters['order'])) {
            foreach ($filters['order'] as $key => $value) {
                $qb->orderBy("movie.{$key}", $value);
            }
        } else {
            $qb->orderBy('movie.createdAt', 'DESC');
        }

        return $qb;
    }
}
