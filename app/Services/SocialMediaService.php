<?php

namespace App\Services;

class SocialMediaService
{
    public function __construct()
    {
        $this->platforms = Config('constants.platforms');
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
        $matched = 0;

        foreach ($this->platforms as $key => $platform) {

            $url = str_replace('{username}', $username, $platform['url']);
            if ($platform['name'] == 'Twitch') {
                $statusCode = $this->twitchStatusCode($url, $username);
            } else {
                $statusCode = $this->getStatusCode($url);
            }

            $return[] = [
                'id' => $platform['id'],
                'name' => $platform['name'],
                'url' => $url,
                'status' => $statusCode,
            ];

            if ($statusCode == 200) {
                $matched++;
            }
        }

        return ['result' => $return, 'total' => count($this->platforms), 'matched' => $matched];
    }

    public function twitchStatusCode($url, $username)
    {
        $html = file_get_contents($url);
        
        // Check if the username exists in the HTML content
        if (strpos($html, $username) !== false) {
            return 200;
        } else {
            return 404;
        }
    }

    public function getStatusCode($url)
    {
        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_NOBODY, true);

        curl_exec($ch);

        $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return $statusCode;
    }
}
