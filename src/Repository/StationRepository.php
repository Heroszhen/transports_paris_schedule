<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Station;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Station>
 */
class StationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Station::class);
    }

    //    /**
    //     * @return Station[] Returns an array of Station objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('s.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Station
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    public function findIdByStopId(string $stopId): bool|int
    {
        $conn = $this->getEntityManager()->getConnection();
        $query = 'SELECT id FROM station WHERE stop_id = :stopId';
        $params = [
            'stopId' => $stopId,
        ];

        return $conn->fetchOne($query, $params);
    }

    public function saveStations(array $stationsToInsert, array $stationsToUpdate): void
    {
        $conn = $this->getEntityManager()->getConnection();
        $conn->beginTransaction();
        try {
            if (!empty($stationsToInsert)) {
                $sql = '
                    INSERT INTO station (name, label, stop_id, line_id)
                    VALUES (:name, :label, :stop_id, :line_id)
                ';

                foreach ($stationsToInsert as $station) {
                    try {
                        $conn->executeStatement($sql, $station);
                    } catch (\Exception $e) {
                        throw $e;
                    }
                }
            }

            if (!empty($stationsToUpdate)) {
                foreach ($stationsToUpdate as $id => $station) {
                    $conn->update(
                        'station',
                        $station,
                        ['id' => $id]
                    );
                }
            }

            $conn->commit();
        } catch (\Throwable $e) {
            if ($conn->isTransactionActive()) {
                $conn->rollBack();
            }

            throw $e;
        }
    }

    public function getAnotherStation(Station $station): ?Station
    {
        return $this->createQueryBuilder('station')
            ->where('station.id != :id')
            ->andWhere('station.label = :label')
            ->andWhere('station.line = :line')
            ->setParameter('id', $station->getId())
            ->setParameter('label', $station->getLabel())
            ->setParameter('line', $station->getLine())
            ->getQuery()
            ->getOneOrNullResult();
    }
}
