<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use App\Entity\Log\LoginLog;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Http\Event\LoginSuccessEvent;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class LoginSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private EntityManagerInterface $em,
        private RequestStack $requestStack,
        private LoggerInterface $log,
        private HttpClientInterface $httpClient,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            LoginSuccessEvent::class => 'onLoginSuccess',
        ];
    }

    public function onLoginSuccess(LoginSuccessEvent $event): void
    {
        $user = $event->getUser();
        $request = $this->requestStack->getCurrentRequest();

        if (!$user instanceof User) {
            $this->log->error('LoginSubscriber: not existed user', ['ip' => $request?->getClientIp()]);

            return;
        }

        if ('/api/login_check' !== $request?->getPathInfo()) {
            return;
        }

        $ip = $request->getClientIp();
        $ipInfo = [];
        try {
            $response = $this->httpClient->request('GET', "http://ip-api.com/json/{$ip}");
            $ipInfo = $response->toArray();
        } catch (\Exception $e) {
            $this->log->error('LoginSubscriber: ip error', ['message' => $e->getMessage()]);
        }

        $loginLog = (new LoginLog())
            ->setUser($user)
            ->setIp($ip)
            ->setCountry($ipInfo['country'] ?? null)
            ->setRegion($ipInfo['regionName'] ?? null)
            ->setCity($ipInfo['city'] ?? null);

        $this->em->persist($loginLog);
        $this->em->flush();
    }
}
