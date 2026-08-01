<?php

declare(strict_types=1);

namespace App\Tests\Unit\Service;

use App\Service\UtilService;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

class UtilServiceTest extends TestCase
{
    private UtilService $utilService;

    protected function setUp(): void
    {
        $this->utilService = new UtilService();
    }

    #[DataProvider('monthsWith31DaysProvider')]
    public function testGetDaysOfMonthWith31Days(int $month, int $year): void
    {
        $days = $this->utilService->getDaysOfMonth($month, $year);

        $this->assertSame($days, 31);
    }

    public static function monthsWith31DaysProvider(): array
    {
        return [
            'January' => [1, 2000],
            'March' => [3, 2026],
        ];
    }

    #[DataProvider('monthsWith29DaysProvider')]
    public function testGetDaysOfMonthWith29Days(int $month, int $year): void
    {
        $days = $this->utilService->getDaysOfMonth($month, $year);

        $this->assertLessThan(30, $days);
    }

    public static function monthsWith29DaysProvider(): array
    {
        return [
            '2000' => [2, 2000],
            '2026' => [2, 2026],
            '2028' => [2, 2028],
        ];
    }
}
