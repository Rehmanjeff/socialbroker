<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SocialMediaController;

Route::get('', [SocialMediaController::class, 'showForm'])->name('show.form');
Route::post('social-media-presence', [SocialMediaController::class, 'getSocialMediaPresence'])->name('check.social.media.presence');
