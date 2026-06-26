<?php

declare(strict_types=1);

namespace App\Command;

use App\Repository\LineRepository;
use App\Repository\StationRepository;
use App\Service\FileService;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Filesystem\Filesystem;

/**
 * @exempl  php bin/console app:add-station-by-file "arrets-lignes.csv"
 *
 * ID_Line(index-0)
 * stop_id(index-2)
 * stop_name(index-3)
 */
#[AsCommand(
    name: 'app:add-station-by-file',
    description: 'Read one csv file to add stations',
)]
class AddStationByFileCommand extends Command
{
    public const BATCH = 100;

    public function __construct(
        private readonly LineRepository $lineRepository,
        private readonly StationRepository $stationRepository,
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

        $idLine = null;
        $stationsToInsert = [];
        $stationsToUpdate = [];

        $created = 0;
        $updated = 0;
        $tab = $this->fileService->readCSV($filePath);

        $io->progressStart(count($tab));
        foreach ($tab as $key => $row) {
            if (0 === $key || empty($row)) {
                continue;
            }

            $io->progressAdvance();

            try {
                $idTab = explode(':', $row[0]);
                $lineId = count($idTab) > 1 ? $idTab[1] : $idTab[0];
                $idLine = $this->lineRepository->findIdByLineId($lineId);

                if (!is_int($idLine)) {/*
                    $this->showErrorMessage(
                        $io,
                        sprintf('row %s: line %s is not found', $key, $lineId)
                    );*/
                    continue;
                }

                $station = [
                    'name' => $row[3],
                    'label' => $row[3],
                    'stop_id' => $row[2],
                    'line_id' => $idLine,
                ];

                $idStation = $this->stationRepository->findIdByStopId($row[2]);
                if (is_int($idStation)) {
                    ++$updated;
                    $stationsToUpdate[$idStation] = $station;
                } else {
                    ++$created;
                    $stationsToInsert[$row[2]] = $station;
                }

                if ((count($stationsToInsert) + count($stationsToUpdate)) === self::BATCH) {
                    $this->stationRepository->saveStations($stationsToInsert, $stationsToUpdate);
                    $stationsToInsert = [];
                    $stationsToUpdate = [];
                }
            } catch (\Throwable $e) {
                $this->showErrorMessage(
                    $io,
                    sprintf('row %s: station %s enter into exception because of %s', $key, $row[3], $e->getMessage())
                );
                $io->progressAdvance();
            }
        }

        $this->stationRepository->saveStations($stationsToInsert, $stationsToUpdate);

        $io->progressFinish();
        $io->info('AddLineByFileCommand - end:'.(new \DateTime())->format('d/m/Y h:i:s'));
        $io->success(sprintf('created: %s | updated: %s', $created, $updated));

        return Command::SUCCESS;
    }

    private function showErrorMessage(SymfonyStyle $io, string $msg): void
    {
        $io->writeln('');
        $io->error($msg);
        $io->writeln('');
    }
}
