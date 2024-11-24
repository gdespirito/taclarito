import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from "@inertiajs/react";
import axios from 'axios';
import { useEffect } from "react";

interface Props {
    fintoc_accounts: any;
    fintoc_link_id: string;
}

export default function SelectBankAccounts({ fintoc_accounts, fintoc_link_id }: Props) {
    async function save(e) {
        const selectedAccounts = Array.from(
            document.querySelectorAll('input[name="account[]"]:checked'),
        ).map((checkbox) => checkbox.value);

        e.preventDefault();

        await axios.post(route('save-selected-bank-accounts', fintoc_link_id ), {
            accounts: selectedAccounts,
        });

        router.visit(route('add-files'));
    }

    function selectAll() {
        const checkboxes = document.querySelectorAll('input[name="account[]"]');
        checkboxes.forEach((checkbox) => {
            (checkbox as HTMLInputElement).checked = true;
        });
    }

    useEffect(() => {
        selectAll();
    }, [])

    const listItems = fintoc_accounts.map((account) => (
        <div
            className="m-2 flex items-center rounded-lg bg-gray-900 p-2 text-left shadow"
            key={account.id}
        >
            <div className="mr-4 p-2">
                <input
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:outline-none focus-visible:outline-none dark:border-gray-600 dark:bg-gray-700"
                    type="checkbox"
                    name="account[]"
                    value={account.id}
                    id={`account-${account.id}`}
                />
            </div>
            <label htmlFor={`account-${account.id}`}>
                <span className="block font-bold">{account.name}</span>
                <span className="block">{account.number}</span>
            </label>
        </div>
    ));

    return (
        <AuthenticatedLayout>
            <Head title="Selecciona que cuentas vas a sincronizar" />

            <div className="flex min-h-screen items-center justify-center bg-gray-100 px-6 py-12 dark:bg-gray-900 dark:text-white">
                <div className="relative w-full max-w-4xl">
                    <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
                        <div className="mb-8 text-center">
                            <h1 className="mb-20 text-4xl font-bold text-gray-800 dark:text-gray-100">
                                Selecciona que cuentas vamos a sincronizar
                            </h1>

                            <div className="mx-auto grid max-w-xl grid-cols-2">
                                {listItems}
                            </div>

                            <div className="mx-auto mt-10 flex items-center justify-center">
                                <a
                                    href=""
                                    onClick={save}
                                    className="rounded-lg bg-green-700 px-20 py-3 hover:scale-105 transition-all"
                                >
                                    Continuar
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
