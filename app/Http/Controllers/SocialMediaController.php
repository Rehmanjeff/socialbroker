<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\SocialMediaService;
use App\Http\Requests\SocialMediaPresenceRequest;

class SocialMediaController extends Controller
{
    protected $socialMediaService;

    public function __construct(SocialMediaService $socialMediaService)
    {
        $this->socialMediaService = $socialMediaService;
    }

    public function showForm (Request $request)
    {
        $data = [

        ];

        return view('welcome', $data);
    }

    public function getSocialMediaPresence (SocialMediaPresenceRequest $request)
    {
        $response = $this->socialMediaService->getAvailability($request->input('username'));
        return response()->json(['data' => $response['result'], 'total' => $response['total'], 'matched' => $response['matched']]);
    }
}
