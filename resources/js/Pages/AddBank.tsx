import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { getFintoc } from '@fintoc/fintoc-js';
import { Head, router } from "@inertiajs/react";
import { useEffect } from "react";
import axios from "axios";


const Fintoc = await getFintoc();


function sendExchangeTokenToBackend(exchangeToken: string) {
    axios.post(route('banks.store'), {exchangeToken});
}

interface Props {
    widget_token: string;
}

export default function AddBank({ widget_token }: Props) {
    useEffect(() => {
        const options = {
            publicKey: 'pk_live_5cNLzP6Yd9tq8woSjppJ5PHV6cDwRn9B',
            widgetToken: widget_token,
            onSuccess: (linkIntent: { exchangeToken: string }) => {
                const exchangeToken = linkIntent.exchangeToken;
                sendExchangeTokenToBackend(exchangeToken);
                router.visit(route('banks.index'));
            },
        };
        if (Fintoc) {
            const widget = Fintoc.create(options);
            widget.open();
        }

    }, []);


    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Agregar banco
                </h2>
            }
        >
            <Head title="Dashboard" />
            <script src="https://js.fintoc.com/v1/"></script>

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100"></div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
