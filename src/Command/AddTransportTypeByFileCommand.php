<?php

declare(strict_types=1);

namespace App\Command;

use App\Entity\TransportType;
use App\Repository\TransportTypeRepository;
use App\Service\FileService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Filesystem\Filesystem;

/**
 * @exempl  php bin/console app:add-transport-type-by-file "abc.csv"
 */
#[AsCommand(
    name: 'app:add-transport-type-by-file',
    description: 'Read one csv file to add transport types',
)]
class AddTransportTypeByFileCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly TransportTypeRepository $transportTypeRepository,
        private readonly Filesystem $filesystem,
        private readonly FileService $fileService,
        #[Autowire('%kernel.project_dir%')]
        private readonly string $projectDir,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('file', InputArgument::REQUIRED, 'file name in public');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->info('AddTransportTypeByFileCommand - start:'.(new \DateTime())->format('d/m/Y h:i:s'));

        $filename = $input->getArgument('file');
        $filePath = $this->projectDir.'/public/'.$filename;
        if (!$this->filesystem->exists($filePath)) {
            $io->error('File not find');

            return Command::FAILURE;
        }

        $created = 0;
        $updated = 0;
        $types = $this->fileService->readCSV($filePath);
        foreach ($types as $key => $type) {
            if (0 === $key || empty($type)) {
                continue;
            }

            $found = $this->transportTypeRepository->findOneBy(['label' => $type[1]]);
            if ($found instanceof TransportType) {
                ++$updated;
            } else {
                ++$created;
                $found = new TransportType();
            }

            $found
                ->setName($type[0])
                ->setLabel($type[1]);

            $this->entityManager->persist($found);
            $this->entityManager->flush();
        }

        $io->info('AddTransportTypeByFileCommand - end:'.(new \DateTime())->format('d/m/Y h:i:s'));
        $io->success(sprintf('created: %s | updated: %s', $created, $updated));

        return Command::SUCCESS;
    }
}
