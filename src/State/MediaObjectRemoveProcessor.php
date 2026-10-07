<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\MediaObject;
use App\Service\S3Service;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class MediaObjectRemoveProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.remove_processor')]
        private ProcessorInterface $removeProcessor,
        private S3Service $s3Service,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): void
    {
        if (!$data instanceof MediaObject) {
            return;
        }

        $this->s3Service->deleteFile($data->getName());

        $this->removeProcessor->process($data, $operation, $uriVariables, $context);
    }
}
