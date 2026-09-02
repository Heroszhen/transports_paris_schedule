<?php

declare(strict_types=1);

namespace App\Tests\Functional\ApiPlatform;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Symfony\Bundle\Test\Client;

class UserTest extends ApiTestCase
{
    private Client $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
    }

    public function testGetUserWithoutToken(): void
    {
        $response = $this->client->request('GET', '/api/users/4');

        self::assertResponseStatusCodeSame(401);

        $content = $response->toArray(false);
        $this->assertArrayHasKey('message', $content);
        $this->assertStringContainsString('Token not found', $content['message']);
    }

    public function testGetUserWithToken(): void
    {
        $response = $this->client->request('GET', '/api/users/4', [
            'headers' => ['Authorization' => 'Bearer '.$this->getToken()],
        ]);

        self::assertResponseStatusCodeSame(200);

        $content = $response->toArray(false);
        $this->assertSame(4, $content['id']);
    }

    private function getToken(): string
    {
        $response = $this->client->request('POST', '/api/login_check', [
            'json' => ['email' => 'user@gmail.com', 'password' => 'aaaaaaaa'],
        ]);

        $data = $response->toArray();

        return $data['token'];
    }
}
