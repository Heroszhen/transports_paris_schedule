<?php

declare(strict_types=1);

namespace App\Controller;

use App\Service\PrimService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/station')]
final class StationController extends AbstractController
{
    public function __construct(
        private readonly PrimService $primService,
    ) {
    }

    #[Route('/{id}/scheldule', name: 'app_station_scheldule', methods: ['GET'])]
    public function index(int $id): Response
    {
        $scheldules = $this->primService->getStationScheldules($id);

        return $this->json(['data' => $scheldules]);
    }
}
