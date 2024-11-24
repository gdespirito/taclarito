import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

interface Props {
    movements: any;
}

export default function SelectBankAccounts({ movements }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Selecciona que cuentas vas a sincronizar" />

            <div className="flex min-h-screen items-center justify-center bg-gray-100 px-6 py-12 dark:bg-gray-900 dark:text-white">
                <div className="relative w-full max-w-2xl">
                    <h1 className="mb-4 text-4xl font-bold text-gray-800 dark:text-gray-100">
                        Movimientos
                    </h1>

                    <div className="flex flex-col flex-wrap">
                        {movements.map((movement:any) => (
                            <div key={`movement-${movement.id}`} className="my-2 rounded bg-white dark:bg-gray-600 p-3 shadow">
                                <div className="flex items-center justify-center">
                                    <span>{movement.description}</span>
                                    <span className="ml-auto text-lg font-bold">
                                        {new Intl.NumberFormat('es-CL', {
                                            style: 'currency',
                                            currency: 'CLP',
                                        }).format(movement.amount)}
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="text-xs text-gray-600 dark:text-white">
                                        {new Date(movement.date)
                                            .toLocaleString('es-CL', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })
                                            .replace(',', '')}
                                    </span>
                                    <span className="ml-auto font-bold text-green-700 dark:text-green-400">
                                        {movement.category.category ?? '-'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex">
                        <div className="ml-auto mt-10 flex items-center justify-center">
                            <a
                                href=""
                                className="rounded-lg bg-green-700 px-20 py-3 text-white transition-all hover:scale-105"
                            >
                                Continuar
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
