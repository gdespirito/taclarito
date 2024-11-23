import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import FileUpload from '../Components/FileUpload';
import { ChartsSection } from '../Components/ChartsSection';
import { IconFintoc, IconGoogle } from '@/Components/Icons';

export default function Dashboard() {
    const [uploadComplete, setUploadComplete] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [currentMessage, setCurrentMessage] = useState(0);

    const messages = [
        "Contando las piscolas... 🥃",
        "¡Mucho pádel partner 🎾!",
        "Era necesario lo de MercadoLibre 📦?",
        "Cómo que 9 suscripciones 😱!?"
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

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-12 px-6 flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="w-full max-w-4xl relative">
                    {/* Loading Animation */}
                    {isLoading && (
                        <div
                            className={`flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 z-10 transition-opacity duration-500 ${
                                isLoading ? 'opacity-100 visible' : 'opacity-0 invisible'
                            }`}
                        >
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-gray-700 text-xl dark:text-gray-300"> {messages[currentMessage]}</p>
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
                        <div className="p-8 bg-white shadow-lg rounded-lg dark:bg-gray-800">
                            <div className="text-center mb-8">
                                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">¿Tas clarito? 🤑</h1>
                                <p className="text-lg text-gray-600 dark:text-gray-400">
                                    ¡Sube tu cartola y accede a todas tus estadísticas!
                                </p>
                            </div>

                            <div className="mb-4">
                                <FileUpload onUploadComplete={handleUploadComplete} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                className="w-full py-4 bg-indigo-900 text-white font-semibold rounded-lg hover:bg-indigo-800 focus:outline-none flex items-center justify-center"
                                onClick={() => console.log('Fintoc Login Clicked')}
                            >
                                <IconFintoc />
                            </button>

                            <button
                                className="w-full py-4 bg-indigo-900 text-white font-semibold rounded-lg hover:bg-indigo-800 focus:outline-none flex items-center justify-center"
                                onClick={() => console.log('Fintoc Login Clicked')}
                            >
                                <IconGoogle />
                            </button>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}



