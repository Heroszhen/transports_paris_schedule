<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[Route('/api/security')]
final class SecurityController extends AbstractController
{
    public function __construct(
        private readonly HttpClientInterface $httpClient,
        private readonly LoggerInterface $logger,
        private readonly JWTTokenManagerInterface $jwtManager,
        private readonly UserRepository $userRepository,
    ) {
    }

    #[Route('/get-gmail-login-token', name: 'app_get_login_token', methods: ['POST'])]
    public function getGmailLoginToken(Request $request): Response
    {
        $token = null;
        $content = json_decode($request->getContent(), true);

        if (empty($content['access_token'])) {
            throw new BadRequestHttpException('access_token is required');
        }

        if (empty($content['scope'])) {
            throw new BadRequestHttpException('scope is required');
        }

        if (!str_contains($content['scope'], 'email')) {
            throw new AccessDeniedHttpException('Access denied');
        }

        try {
            $response = $this->httpClient->request('POST', $_ENV['GOOGLE_TOKENINFO_URL'], [
                'headers' => [
                    'Authorization' => "Bearer {$content['access_token']}",
                ],
            ]);

            if (200 !== $response->getStatusCode()) {
                throw new \Exception('app_get_login_token: '.$response->getContent(false));
            }

            $result = json_decode($response->getContent(), true, 512, JSON_THROW_ON_ERROR);

            if (empty($result['aud']) || $result['aud'] !== $_ENV['GOOGLE_CLIENT_ID_FRONT']) {
                throw new AccessDeniedHttpException('Access denied');
            }

            if ('true' !== $result['email_verified'] || empty($result['email'])) {
                throw new AccessDeniedHttpException('Access denied');
            }

            $user = $this->userRepository->findOneBy(['email' => $result['email']]);
            if (!$user instanceof User) {
                throw new AccessDeniedHttpException('Access denied');
            }

            $token = $this->jwtManager->create($user);
        } catch (\Exception $e) {
            $this->logger->error('app_get_login_token', [$e]);
        }

        return $this->json(['token' => $token]);
    }
}
