import { IconFintoc, IconGoogle } from '@/Components/Icons';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { ChartsSection } from '../Components/ChartsSection';
import FileUpload from '../Components/FileUpload';
import axios from "axios";

async function getMovements() {
    const response = await axios.get(route('movements.get'));
    console.log(response);
}

export default function Dashboard() {
    const [uploadComplete, setUploadComplete] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [currentMessage, setCurrentMessage] = useState(0);

    const messages = [
        'Contando las piscolas... 🥃',
        '¡Mucho pádel partner 🎾!',
        'Era necesario lo de MercadoLibre 📦?',
        'Cómo que 9 suscripciones 😱!?',
    ];

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (isLoading) {
            interval = setInterval(() => {
                setCurrentMessage((prev) => (prev + 1) % messages.length);
            }, 2000); // Switch messages every 2 seconds
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval); // Cleanup on unmount
    }, [isLoading, messages.length]);

    const handleUploadComplete = () => {
        setIsLoading(true);

        // Simulate a loading animation delay
        setTimeout(() => {
            setIsLoading(false);
            setUploadComplete(true);
        }, 8000); // Simulates a 10-second delay
    };

    const handleBackButtonClick = () => {
        setUploadComplete(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSendMessage = () => {
        console.log(`Message sent: ${inputValue}`);
        setInputValue(''); // Clear input after sending
    };

    function start(e: any) {
        router.visit('add-bank');
        e.preventDefault();
    }

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="flex min-h-screen items-center justify-center bg-gray-100 px-6 py-12 dark:bg-gray-900">
                <div className="relative w-full max-w-4xl">
                    {/* Loading Animation */}
                    {isLoading && (
                        <div
                            className={`z-10 flex flex-col items-center justify-center bg-gray-100 transition-opacity duration-500 dark:bg-gray-900 ${
                                isLoading
                                    ? 'visible opacity-100'
                                    : 'invisible opacity-0'
                            }`}
                        >
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                            <p className="mt-4 text-xl text-gray-700 dark:text-gray-300">
                                {' '}
                                {messages[currentMessage]}
                            </p>
                        </div>
                    )}

                    {/* Statistics Content */}
                    {uploadComplete && !isLoading && (
                        <ChartsSection
                            handleBack={handleBackButtonClick}
                            handleInputChange={handleInputChange}
                            inputValue={inputValue}
                            onSend={handleSendMessage}
                        />
                    )}

                    {/* Initial Content */}
                    {!uploadComplete && !isLoading && (
                        <>
                            <div className="mb-10 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800 dark:text-white">
                                <div className="mb-8 text-center">
                                    <h1 className="mb-4 text-4xl font-bold text-gray-800 dark:text-gray-100">
                                        ¿Tas clarito? 🤑
                                    </h1>
                                    <p className="text-lg text-gray-600 dark:text-gray-400">
                                        Apuesto que no sabes en que gastas la plata. <br/>
                                        Revisa cuanto gastas en delivery, compras en China y mucho más.
                                    </p>

                                    <div className="mx-auto mt-10 flex items-center justify-center">
                                        <a
                                            href=""
                                            onClick={start}
                                            className="rounded-lg bg-green-700 px-20 py-3 text-white"
                                        >
                                            Démosle
                                        </a>
                                    </div>
                                </div>
                            </div>
                            {/*<div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">*/}
                            {/*    <div className="mb-8 text-center">*/}
                            {/*        <h1 className="mb-4 text-4xl font-bold text-gray-800 dark:text-gray-100">*/}
                            {/*            ¿Tas clarito? 🤑*/}
                            {/*        </h1>*/}
                            {/*        <p className="text-lg text-gray-600 dark:text-gray-400">*/}
                            {/*            ¡Sube tu rendición de gastos y accede a*/}
                            {/*            tus estadísticas!*/}
                            {/*        </p>*/}
                            {/*    </div>*/}

                            {/*    <div className="mb-4">*/}
                            {/*        <FileUpload*/}
                            {/*            onUploadComplete={handleUploadComplete}*/}
                            {/*        />*/}
                            {/*    </div>*/}

                            {/*    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">*/}
                            {/*        <button*/}
                            {/*            className="flex w-full items-center justify-center rounded-lg bg-indigo-900 py-4 font-semibold text-white hover:bg-indigo-800 focus:outline-none"*/}
                            {/*            onClick={() => router.visit('add-bank')}*/}
                            {/*        >*/}
                            {/*            <IconFintoc />*/}
                            {/*        </button>*/}

                            {/*        <button*/}
                            {/*            className="flex w-full items-center justify-center rounded-lg bg-indigo-900 py-4 font-semibold text-white hover:bg-indigo-800 focus:outline-none"*/}
                            {/*            onClick={() =>*/}
                            {/*                console.log('Fintoc Login Clicked')*/}
                            {/*            }*/}
                            {/*        >*/}
                            {/*            <IconGoogle />*/}
                            {/*        </button>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
                    }
