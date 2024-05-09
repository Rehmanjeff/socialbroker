<?php

namespace App\Services;

class SocialMediaService
{
    public function __construct()
    {
        $this->platforms = [
            [
                'id' => 1,
                'name' => 'JSFiddle',
                'uri' => 'https://jsfiddle.net/user/{username}/'
            ],
        ];
    }

    protected function findPlatformById($id)
    {
        foreach ($this->platforms as $platform) {
            if ($platform['id'] === $id) {
                return $platform;
            }
        }

        return null;
    }

    public function getAvailability($username)
    {
        $return = [];

        foreach ($platforms as $key => $platform) {

            $url = str_replace('{username}', $username, $platform['url']);
            $isAvailable = $this->isAvailable($username, $url);

            $return[] = [
                'id' => $platform['id'],
                'name' => $platform['name'],
                'url' => $url,
                'status' => $isAvailable ? 1 : 0,
            ];
        }

        return $return;
    }

    public function isAvailable($username, $url)
    {
        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_NOBODY, true);

        curl_exec($ch);

        $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($statusCode === 404) {
            return false;
        }

        return true;
    }
}
