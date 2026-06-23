#! /bin/bash

npm run clean:code

winpty php vendor/bin/grumphp run --tasks=phpparser
vendor/bin/php-cs-fixer fix
vendor/bin/phpstan analyse