<?php

namespace App\Services;
use GuzzleHttp\Client;
use Abraham\TwitterOAuth\TwitterOAuth;

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

            if ($platform['id'] == 13) {
                $statusCode = $this->getTwitchStatusCode($url, $username);
            } else if ($platform['id'] == 7) {
                $statusCode = $this->getFacebookStatusCode($url, $username);
            } else if ($platform['id'] == 1) {
                $statusCode = $this->getInstagramStatusCode($url, $username);
            } else if ($platform['id'] == 10) {
                $statusCode = $this->getImgurStatusCode($url, $username);
            } else if ($platform['id'] == 35) {
                $statusCode = $this->getWishListStatusCode($url, $username);
            } else if ($platform['id'] == 32) {
                $statusCode = $this->getTeamTreeHouseStatusCode($url, $username);
            } else if ($platform['id'] == 12) {
                $statusCode = $this->getReditStatusCode($url, $username);
            } else if ($platform['id'] == 16) {
                $statusCode = $this->getMediumStatusCode($url, $username);
            } else if ($platform['id'] == 14) {
                $statusCode = $this->getFiverStatusCode($url, $username);
            } else if ($platform['id'] == 20) {
                $statusCode = $this->getThemeForestStatusCode($url, $username);
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

    public function getTeamTreeHouseStatusCode($url, $username)
    {
        $headers = array(
            'Content-Type: application/json',
            'Authorization: Bearer 260|hVeSAQEjshS0mnBoDrH5zWS7L8SDJrXID0UGDMspd6bcea69',
            'Cookie: _treehouse_session=DbYjeddH%2B6q90XgIpPKGd6aErQcXQWqjo59cbaixvgPG8PGK42nnHfsP4dm8NVyTCCD6nWFsz%2BwnydmuL2XIhkV74apkF9sDcUaqKtnUwzxZc9RnjmJyR6oUPB5Inn6VYt4%2BpyYNFasNwSKFIbf445Q77df4y3Q3MaktoKYOAF%2BC7GWRglsr%2FTrs%2BL9%2B%2BJFkfnXocNM72Q3cUVjiyhg8f%2FSclwKJ1La%2B%2FZ6b7bFuiJ1U3kMvhTbDN5N%2BxCrb2mRlQTB71S6VLLBFeca%2BI3lPsvfyjzbx1aAkbb%2BjZzO2hXXl--BBNip8SH89nduJzC--aeXPNSTnSMmXyWOFHP7qoA%3D%3D; sid=31b4d0a4-147b-48fb-9d9d-66b553d7d14c; vid=8682444096'
        );

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

        $response = curl_exec($ch);
        curl_close($ch);
        if ($response === false) {
            return 404;
        } else {
            $position = strpos($response, $username);
            return $position !== false ? 200 : 404;
        }
    }

    public function getWishListStatusCode($url, $username)
    {
        $client = new Client();
        try {
            $response = $client->request('POST', $url);
            $htmlContent = $response->getBody()->getContents();
            $position = strpos($htmlContent, 'Page Not Found');
            return $position !== false ? 404 : 200;
        } catch (\Exception $e) {
            return 404;
        }
    }

    public function getImgurStatusCode($url, $username)
    {
        $client = new Client();
        try {
            $response = $client->request('POST', $url);
            $htmlContent = $response->getBody()->getContents();
            $position = strpos($htmlContent, 'https://imgur.com/user/' . $username);
            return $position !== false ? 200 : 404;
        } catch (\Exception $e) {
            return 404;
        }
    }

    public function getFacebookStatusCode($url, $username)
    {
        $client = new Client();
        try {
            $response = $client->request('GET', $url);
            $htmlContent = $response->getBody()->getContents();
            $position = strpos($htmlContent, 'fb://profile/');
            return $position !== false ? 200 : 404;
        } catch (\Exception $e) {
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
        } catch (\Exception $e) {
            return 404;
        }
    }

    public function getReditStatusCode($url, $username)
    {
        $client = new Client();
        try {
            $response = $client->request('GET', $url);
            $htmlContent = $response->getBody()->getContents();
            $position = strpos($htmlContent, 'nobody on Reddit goes by that name');
            return $position !== false ? 404 : 200;
        } catch (\Exception $e) {
            return 404;
        }
    }

    public function getMediumStatusCode($url, $username)
    {
        $client = new Client();
        try {
            $response = $client->request('GET', $url);
            $htmlContent = $response->getBody()->getContents();
            $position = strpos($htmlContent, 'PAGE NOT FOUND');
            return $position !== false ? 404 : 200;
        } catch (\Exception $e) {
            return 404;
        }
    }

    public function getFiverStatusCode($url, $username)
    {
        $client = new Client();
        try {
            $response = $client->request('GET', $url);
            $htmlContent = $response->getBody()->getContents();
            $position = strpos($htmlContent, $username . ' | Profile | Fiverr');
            return $position !== false ? 200 : 404;
        } catch (\Exception $e) {
            return 404;
        }
    }

    public function getThemeForestStatusCode($url, $username)
    {
        $client = new Client();
        try {
            $response = $client->request('GET', $url);
            $htmlContent = $response->getBody()->getContents();
            $position = strpos($htmlContent, 'https://themeforest.net/user/' . $username);
            return $position !== false ? 200 : 404;
        } catch (\Exception $e) {
            return 404;
        }
    }
}
