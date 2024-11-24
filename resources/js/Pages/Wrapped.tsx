import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Wrapped() {
    const [isLoading, setIsLoading] = useState(true);
    const [currentMessage, setCurrentMessage] = useState(0);

    const messages = [
        'Contando las piscolas... 🥃',
        '¡Mucho pádel partner 🎾!',
        'Era necesario lo de MercadoLibre 📦?',
        'Cómo tantas suscripciones 😱!?',
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

    return (
        <AuthenticatedLayout>
            <Head title="Wrapped" />

            <div className="flex min-h-screen items-center justify-center bg-gray-100 px-6 py-12 dark:bg-gray-900 dark:text-white">
                <div className="relative w-full max-w-4xl">
                    {isLoading ? (
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
                    ) : null}

                    {!isLoading ? (
                        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
                            <div className="mb-8 text-center">
                                <h1 className="mb-4 text-4xl font-bold text-gray-800 dark:text-gray-100">
                                    Wrapped
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-400">
                                    Es la manera más simple y rápida de importar
                                    tus datos 🚀.
                                </p>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
