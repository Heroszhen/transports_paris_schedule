<?php

declare(strict_types=1);

namespace App\DataFixtures;

use App\Factory\Movie\ActorFactory;
use App\Factory\Movie\MovieFactory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        ActorFactory::createMany(53);
        MovieFactory::createMany(107);
    }
}
