<?php

declare(strict_types=1);

namespace App\Controller\Action;

use ApiPlatform\Symfony\Security\Exception\AccessDeniedException;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class GetUserByToken extends AbstractController
{
    public function __construct(
        private Security $security,
    ) {
    }

    public function __invoke(Request $request): ?User
    {
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            throw new AccessDeniedException();
        }

        return $user;
    }
}
