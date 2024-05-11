<?php

namespace App\Services;
use GuzzleHttp\Client;

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
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_NOBODY, true);

        curl_exec($ch);

        $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return $statusCode;
    }

    public function getTwitchStatusCode($url, $username)
    {
        $html = file_get_contents($url);
        $position = strpos($html, 'Sorry, that page is in another castle');
        return $position !== false ? 404 : 200;
    }

    public function getFacebookStatusCode($url, $username)
    {
        $client = new Client();
        try {
            $response = $client->request('GET', $url);
            $htmlContent = $response->getBody()->getContents();
            echo $htmlContent;exit;
            $position = strpos($htmlContent, 'fb://profile/');
            return $position !== false ? 200 : 404;
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            echo $e->getMessage();exit;
            return 404;
        }
    }

    public function getInstagramStatusCode($url, $username)
    {
        $client = new Client();
        try {
            $response = $client->request('GET', $url);
            $htmlContent = $response->getBody()->getContents();
            $position = strpos($htmlContent, 'https://www.instagram.com/' . $username);
            return $position !== false ? 200 : 404;
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            return 404;
        }
    }
}
