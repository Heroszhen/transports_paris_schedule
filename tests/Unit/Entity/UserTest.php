<?php

declare(strict_types=1);

namespace App\Tests\Unit\Entity;

use App\Entity\User;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    public function testEmail(): void
    {
        $email = 'exemple@gmail.com';
        $user = (new User())
            ->setEmail($email);

        $this->assertSame($email, $user->getEmail());
    }

    public function testRoles(): void
    {
        $user = new User();

        $this->assertNotEmpty($user->getRoles());
        $this->assertContains('ROLE_USER', $user->getRoles());

        $user->setRoles(['ROLE_USER', 'ROLE_USER']);
        $this->assertSame(1, count($user->getRoles()));
    }
}
