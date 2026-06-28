<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Station;
use App\Repository\StationRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class PrimService
{
    public const MONITORING_PREFIX = 'STIF:StopPoint:Q:';
    public const STOP_MONITORING_URL = 'stop-monitoring';

    public function __construct(
        private readonly HttpClientInterface $httpClient,
        private readonly StationRepository $stationRepository,
    ) {
    }

    public function getStationScheldules(int $stationId): array
    {
        $scheldules = [];

        $getScheldule = function (HttpClientInterface $httpClient, Station $station) use (&$scheldules) {
            $tab = explode(':', $station->getStopId() ?? '');
            $code = end($tab);
            $monitoringRef = self::MONITORING_PREFIX.$code.':';
            $query = ['MonitoringRef' => $monitoringRef];

            try {
                $response = $httpClient->request('GET', $_ENV['PRIM_API_ENDPOINT'].self::STOP_MONITORING_URL, [
                    'query' => $query,
                    'headers' => [
                        'apikey' => $_ENV['PRIM_API_TOKEN'],
                    ],
                ]);

                if (Response::HTTP_OK === $response->getStatusCode()) {
                    $data = $response->toArray();

                    $visits = $data['Siri']['ServiceDelivery']['StopMonitoringDelivery'][0]['MonitoredStopVisit'] ?? [];
                    foreach ($visits as $visit) {
                        $journey = $visit['MonitoredVehicleJourney'];
                        $call = $journey['MonitoredCall'];
                        $destination = $journey['DestinationName'][0]['value'];
                        $expectedTime = isset($call['ExpectedArrivalTime']) ? $call['ExpectedArrivalTime'] : $call['ExpectedDepartureTime'];
                        $scheldules[$destination][] = [
                            'time' => (new \DateTime($expectedTime))->modify('+2 hours')->format('H:i'),
                            'status' => $call['DepartureStatus'],
                            'isRealTime' => true,
                        ];
                    }
                }
            } catch (\Exception $exception) {
            }
        };

        $station = $this->stationRepository->findOneBy(['id' => $stationId]);
        if (!$station instanceof Station) {
            throw new NotFoundHttpException('station_not_found');
        }
        $getScheldule($this->httpClient, $station);

        $station2 = $this->stationRepository->getAnotherStation($station);
        if ($station2 instanceof Station) {
            $getScheldule($this->httpClient, $station2);
        }

        return $scheldules;
    }
}
