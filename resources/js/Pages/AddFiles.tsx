import FileUpload from '@/Components/FileUpload';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

function skip(e: any) {
    e.preventDefault();
    router.visit(route('wrapped'));
}

export default function AddFiles() {
    const [loadedFiles, setLoadedFiles] = useState<boolean>(false);
    const handleUploadComplete = () => {
        setLoadedFiles(true);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="flex min-h-screen items-center justify-center bg-gray-100 px-6 py-12 dark:bg-gray-900 dark:text-white">
                <div className="relative w-full max-w-4xl">
                    <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
                        <div className="mb-8 text-center">
                            <h1 className="mb-4 text-4xl font-bold text-gray-800 dark:text-gray-100">
                                ¿Faltó algo?
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                Sube tu cartola del banco o de tu tarjeta de
                                crédito
                            </p>
                        </div>

                        <div className="mb-4">
                            <FileUpload
                                onUploadComplete={handleUploadComplete}
                            />
                        </div>

                        {!loadedFiles ? (
                            <a
                                onClick={skip}
                                className="mt-10 flex cursor-pointer items-center justify-center text-lg hover:underline text-gray-400"
                            >
                                Saltar paso. No quiero subir archivos...
                            </a>
                        ) : null}

                        {loadedFiles ? (
                            <div className="flex items-center justify-center">
                                <a
                                    onClick={() =>
                                        router.visit(route('wrapped'))
                                    }
                                    className="mt-10 cursor-pointer items-center justify-center rounded-lg text-white bg-green-700 px-20 py-2 text-lg transition-all hover:scale-105"
                                >
                                    Continuar
                                </a>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
