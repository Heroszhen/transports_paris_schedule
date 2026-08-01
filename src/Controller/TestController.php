<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class TestController extends AbstractController
{
    #[Route('/test', name: 'app_test', methods: ['GET', 'POST'])]
    public function index(): Response
    {
        $articles = [
            ['id' => 1],
        ];

        return $this->render('test/index.html.twig', ['articles' => $articles]);
    }
}
