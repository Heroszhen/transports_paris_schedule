<?php

declare(strict_types=1);

namespace App\Service;

class UtilService
{
    public function getDaysOfMonth(int $month, int $year): int
    {
        return 2 == $month ? ($year % 4 ? 28 : ($year % 100 ? 29 : ($year % 400 ? 28 : 29))) : (($month - 1) % 7 % 2 ? 30 : 31);
    }
}
