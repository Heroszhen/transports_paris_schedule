<?php

declare(strict_types=1);

namespace App\Command;

use App\Entity\Line;
use App\Entity\TransportType;
use App\Repository\LineRepository;
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
 * @exempl  php bin/console app:add-line-by-file "abc.csv"
 *
 * ShortName_Line(index-2)
 * TransportMode(index-3):bus, metro, rail, tramway
 */
#[AsCommand(
    name: 'app:add-line-by-file',
    description: 'Read one csv file to add lines',
)]
class AddLineByFileCommand extends Command
{
    public const BATCH = 500;

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly LineRepository $lineRepository,
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

        $io->info('AddLineByFileCommand - start:'.(new \DateTime())->format('d/m/Y h:i:s'));

        $filename = $input->getArgument('file');
        $filePath = $this->projectDir.'/public/'.$filename;
        if (!$this->filesystem->exists($filePath)) {
            $io->error('File not find');

            return Command::FAILURE;
        }

        $transportTypes = $this->transportTypeRepository->findAll();
        $types = [];
        foreach ($transportTypes as $tt) {
            /* @var TransportType $tt */
            $types[$tt->getName()] = $tt;
        }

        $created = 0;
        $updated = 0;
        $tab = $this->fileService->readCSV($filePath);

        $io->progressStart(count($tab));
        foreach ($tab as $key => $row) {
            if (0 === $key || empty($row)) {
                continue;
            }

            $io->progressAdvance();

            if (!isset($types[$row[3]])) {
                $io->writeln('');
                $io->error(sprintf('row %s: type %s does not exist for line %s', $key, $row[3], $row['2']));
                $io->writeln('');
                continue;
            }

            try {
                $line = $this->lineRepository->findOneBy(['name' => $row['2'], 'transportType' => $types[$row[3]]]);
                if ($line instanceof Line) {
                    ++$updated;
                } else {
                    ++$created;
                    $line = new Line();
                }

                $line
                    ->setName($row['2'])
                    ->setLabel($row['2'])
                    ->setTransportType($types[$row[3]]);

                $this->entityManager->persist($line);
                $this->entityManager->flush();
            } catch (\Throwable $e) {
                $io->writeln('');
                $io->error(sprintf('row %s: line %s enter into exception because of %s', $key, $row['2'], $e->getMessage()));
                $io->writeln('');

                $io->progressAdvance();
            }
        }

        $io->progressFinish();

        $io->info('AddLineByFileCommand - end:'.(new \DateTime())->format('d/m/Y h:i:s'));
        $io->success(sprintf('created: %s | updated: %s', $created, $updated));

        return Command::SUCCESS;
    }
}
