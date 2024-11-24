<?php

use App\Http\Controllers\AddBankController;
use App\Http\Controllers\AddFilesController;
use App\Http\Controllers\GetMovementsController;
use App\Http\Controllers\ListBanksController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StoreBanksController;
use App\Http\Controllers\SelectBankAccountsController;
use App\Http\Controllers\StoreFileController;
use App\Http\Controllers\StoreSelectedAccounts;
use App\Http\Controllers\WrappedController;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/add-bank', AddBankController::class);
Route::get('/banks/{fintocLinkId}/select-accounts', SelectBankAccountsController::class)->name('banks.select-accounts');
Route::post('/banks', StoreBanksController::class)->name('banks.store');
Route::post('banks/{fintocLinkId}/select-accounts', StoreSelectedAccounts::class)->name('save-selected-bank-accounts');
Route::get('/banks', ListBanksController::class)->name('banks.index');
Route::get('/add-files', AddFilesController::class)->name('add-files');
Route::get('/wrapped', WrappedController::class)->name('wrapped');
Route::get('/movements', GetMovementsController::class)->name('movements.index');
Route::post('/files', StoreFileController::class)->name('files.store');
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('test', function() {
    dispatch(new \App\Jobs\CategorizeMovements(User::find(1)));
});

require __DIR__.'/auth.php';
