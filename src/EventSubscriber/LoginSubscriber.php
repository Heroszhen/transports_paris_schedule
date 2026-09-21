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

class LoginSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private EntityManagerInterface $em,
        private RequestStack $requestStack,
        private LoggerInterface $log,
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

        $loginLog = (new LoginLog())
            ->setUser($user)
            ->setIp($request->getClientIp());

        $this->em->persist($loginLog);
        $this->em->flush();
    }
}
