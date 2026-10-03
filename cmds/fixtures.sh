#! /bin/bash
#create datafixtures

rm -rf var

tables=("movie_actor" "actor" "movie")

for t in "${tables[@]}"; 
do
  php bin/console dbal:run-sql "DROP TABLE $t"
  echo "$t is removed"
done

php bin/console doctrine:schema:update --force
php bin/console doctrine:fixtures:load --append
