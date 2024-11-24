import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }: PageProps) {
    return (
        <>
            <Head title="Welcome" />
            <div className="flex min-h-screen items-center justify-center bg-gray-100 px-6 py-12 dark:bg-gray-900">
                <div className="w-full max-w-4xl">
                    <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
                        {/* Title Section */}
                        <div className="mb-8 text-center">
                            <h1 className="mb-4 text-4xl font-bold text-gray-800 dark:text-gray-100">
                                ¿Tas Clarito? 🤑
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                Gestiona tus finanzas de manera inteligente
                            </p>
                        </div>

                        {/* Auth Buttons */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="col-span-2 flex w-full items-center justify-center rounded-lg bg-indigo-900 py-4 font-semibold text-white transition-colors hover:bg-indigo-800 focus:outline-none"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="flex w-full items-center justify-center rounded-lg bg-indigo-900 py-4 font-semibold text-white transition-colors hover:bg-indigo-800 focus:outline-none"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="flex w-full items-center justify-center rounded-lg border-2 border-indigo-900 py-4 font-semibold text-indigo-900 transition-colors hover:bg-indigo-50 focus:outline-none dark:border-indigo-600 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
