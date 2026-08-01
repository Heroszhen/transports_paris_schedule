<?php

declare(strict_types=1);

namespace App\Tests\Unit\Command;

use App\Command\CreateUserCommand;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Tester\CommandTester;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\ConstraintViolationList;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class CreateUserCommandTest extends TestCase
{
    private CreateUserCommand $command;
    private CommandTester $tester;

    private UserPasswordHasherInterface&MockObject $passwordHasher;
    private EntityManagerInterface&MockObject $entityManager;
    private UserRepository&MockObject $userRepository;
    private ValidatorInterface&MockObject $validator;

    protected function setUp(): void
    {
        $this->passwordHasher = $this->createMock(UserPasswordHasherInterface::class);
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->userRepository = $this->createMock(UserRepository::class);
        $this->validator = $this->createMock(ValidatorInterface::class);

        $this->command = new CreateUserCommand(
            $this->passwordHasher,
            $this->entityManager,
            $this->userRepository,
            $this->validator
        );

        $this->tester = new CommandTester($this->command);
    }

    public function testNotInputedEmail(): void
    {
        $exitCode = $this->tester->execute([
            '--password' => '123456',
        ]);

        $this->assertNotEmpty($this->tester->getDisplay());
        $this->assertStringContainsString('Email is empty', $this->tester->getDisplay());
        $this->assertSame(Command::FAILURE, $exitCode);
    }

    public function testNotInputedPassword(): void
    {
        $exitCode = $this->tester->execute([
            '--email' => 'exemple@gmail.com',
        ]);

        $this->assertNotEmpty($this->tester->getDisplay());
        $this->assertStringContainsString('password is empty', $this->tester->getDisplay());
        $this->assertSame(Command::FAILURE, $exitCode);
    }

    public function testInvalidEmail(): void
    {
        $violation = new ConstraintViolation(
            'Invalid email format',
            null,
            [],
            '',
            'email',
            'not-an-email'
        );

        $this->validator
            ->expects($this->once())
            ->method('validate')
            ->willReturn(new ConstraintViolationList([$violation]));

        $exitCode = $this->tester->execute([
            '--email' => 'exemple',
            '--password' => '123456',
        ]);

        $this->assertSame(Command::FAILURE, $exitCode);
        $this->assertStringContainsString('Invalid email format', $this->tester->getDisplay());
    }

    public function testExistedEmail(): void
    {
        $email = 'exemple@gmail.com';

        $this->userRepository
            ->expects($this->once())
            ->method('findOneBy')
            ->with([
                'email' => $email,
            ])
            ->willReturn(new User());

        $exitCode = $this->tester->execute([
            '--email' => $email,
            '--password' => '123456',
        ]);

        $this->assertSame(Command::FAILURE, $exitCode);
        $this->assertStringContainsString('email is already used', $this->tester->getDisplay());
    }

    public function testCreateUserSuccessfully(): void
    {
        $this->passwordHasher
            ->method('hashPassword')
            ->willReturn('hashed-password');

        $this->validator
            ->method('validate')
            ->willReturn(new ConstraintViolationList());

        $this->userRepository
            ->method('findOneBy')
            ->willReturn(null);

        $this->entityManager
            ->expects($this->once())
            ->method('persist');

        $this->entityManager
            ->expects($this->once())
            ->method('flush');

        $exitCode = $this->tester->execute([
            '--email' => 'test@gmail.com',
            '--password' => '123456',
        ]);

        $this->assertSame(Command::SUCCESS, $exitCode);
    }
}
