<?php

declare(strict_types=1);

namespace App\Command;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * @exemple php bin/console app:create-user --email=abc --password=abdefe
 */
#[AsCommand(
    name: 'app:create-user',
    description: 'Add a short description for your command',
)]
class CreateUserCommand extends Command
{
    public function __construct(
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly EntityManagerInterface $entityManager,
        private readonly UserRepository $userRepository,
        private readonly ValidatorInterface $validator,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addOption('email', null, InputOption::VALUE_REQUIRED)
            ->addOption('password', null, InputOption::VALUE_REQUIRED);
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $email = $input->getOption('email');
        if (empty($email)) {
            $io->error('Email is empty');

            return Command::FAILURE;
        }

        $password = $input->getOption('password');
        if (empty($password)) {
            $io->error('password is empty');

            return Command::FAILURE;
        }

        $user = new User();

        $hashedPassword = $this->passwordHasher->hashPassword(
            $user,
            $password
        );
        $user
            ->setEmail($email)
            ->setPassword($hashedPassword)
            ->setRoles(['ROLE_USER']);

        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            $io->error((string) $errors);

            return Command::FAILURE;
        }

        $found = $this->userRepository->findOneBy(['email' => $email]);
        if ($found instanceof User) {
            $io->error('email is already used');

            return Command::FAILURE;
        }

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $io->success('Done');

        return Command::SUCCESS;
    }
}
