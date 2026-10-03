<?php

declare(strict_types=1);

namespace App\Factory\Movie;

use App\Entity\Movie\Movie;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;

/**
 * @extends PersistentProxyObjectFactory<Movie>
 */
final class MovieFactory extends PersistentProxyObjectFactory
{
    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#factories-as-services
     *
     * @todo inject services if required
     */
    public function __construct()
    {
    }

    public static function class(): string
    {
        return Movie::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array|callable
    {
        $links = [];
        $n = self::faker()->numberBetween(1, 3);
        for ($i = 0; $i < $n; ++$i) {
            $links[] = self::faker()->url();
        }

        return [
            'links' => $links,
            'title' => self::faker()->sentence(3),
            'releaseDate' => \DateTimeImmutable::createFromMutable(
                self::faker()->dateTimeBetween('-20 years', 'now')
            ),
            'description' => self::faker()->paragraph(5),
            'actors' => ActorFactory::randomRange(1, 20),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(Movie $movie): void {})
        ;
    }
}
