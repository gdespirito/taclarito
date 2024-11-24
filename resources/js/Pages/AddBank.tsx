import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { getFintoc } from '@fintoc/fintoc-js';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';

const Fintoc = await getFintoc();

function sendExchangeTokenToBackend(exchangeToken: string) {
    return axios.post(route('banks.store'), { exchangeToken });
}

function skip(e) {
    e.preventDefault();
    router.visit(route('add-files'));
}

interface Props {
    widget_token: string;
}

export default function AddBank({ widget_token }: Props) {
    function connectTo(institution: string) {
        const options = {
            publicKey: 'pk_live_5cNLzP6Yd9tq8woSjppJ5PHV6cDwRn9B',
            widgetToken: widget_token,
            institutionId: institution,
            onSuccess: async (linkIntent: { exchangeToken: string }) => {
                const exchangeToken = linkIntent.exchangeToken;
                const response = await sendExchangeTokenToBackend(exchangeToken);
                console.log(response, response.data.id);
                router.visit(route('banks.select-accounts', response.data.id));
            },
        };
        if (Fintoc) {
            const widget = Fintoc.create(options);
            widget.open();
        }
    }

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <script src="https://js.fintoc.com/v1/"></script>

            <div className="flex min-h-screen items-center justify-center bg-gray-100 px-6 py-12 dark:bg-gray-900 dark:text-white">
                <div className="relative w-full max-w-4xl">
                    <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
                        <div className="mb-8 text-center">
                            <h1 className="mb-4 text-4xl font-bold text-gray-800 dark:text-gray-100">
                                Conecta tu banco
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                Es la manera más simple y rápida de importar tus
                                movimientos 🚀.
                            </p>
                        </div>

                        <div className="-ml-4 flex flex-wrap justify-center">
                            <div
                                onClick={() => connectTo('cl_banco_bice')}
                                className="m-4 h-24 w-40 cursor-pointer rounded bg-white p-2 shadow transition-all hover:scale-105"
                            >
                                <img
                                    className="h-full w-full object-cover"
                                    src="./images/banks/bice.png"
                                    alt="Banco Bice"
                                />
                            </div>
                            <div
                                onClick={() => connectTo('cl_banco_bci')}
                                className="m-4 h-24 w-40 cursor-pointer rounded bg-white p-2 shadow transition-all hover:scale-105"
                            >
                                <img
                                    className="h-full w-full object-cover"
                                    src="./images/banks/bci.png"
                                    alt="Banco BCI"
                                />
                            </div>
                            <div
                                onClick={() => connectTo('cl_banco_estado')}
                                className="m-4 h-24 w-40 cursor-pointer rounded bg-white p-2 shadow transition-all hover:scale-105"
                            >
                                <img
                                    className="h-full w-full object-cover"
                                    src="./images/banks/bancoestado.jpg"
                                    alt="Banco Estado"
                                />
                            </div>
                            <div
                                onClick={() => connectTo('cl_banco_scotiabank')}
                                className="m-4 h-24 w-40 cursor-pointer rounded bg-white p-2 shadow transition-all hover:scale-105"
                            >
                                <img
                                    className="h-full w-full object-cover"
                                    src="./images/banks/scotiabank.png"
                                    alt="Scotiabank"
                                />
                            </div>
                            <div
                                onClick={() => connectTo('cl_banco_de_chile')}
                                className="m-4 h-24 w-40 cursor-pointer rounded bg-white p-2 shadow transition-all hover:scale-105"
                            >
                                <img
                                    className="h-full w-full object-cover"
                                    src="./images/banks/bancochile.jpg"
                                    alt="Banco de Chile"
                                />
                            </div>
                            <div
                                onClick={() => connectTo('cl_banco_santander')}
                                className="m-4 h-24 w-40 cursor-pointer rounded bg-white p-2 shadow transition-all hover:scale-105"
                            >
                                <img
                                    className="h-full w-full object-cover"
                                    src="./images/banks/santander.png"
                                    alt="Banco Santander"
                                />
                            </div>
                            <div
                                onClick={() => connectTo('cl_banco_itau')}
                                className="m-4 h-24 w-40 cursor-pointer rounded bg-white p-2 shadow transition-all hover:scale-105"
                            >
                                <img
                                    className="h-full w-full object-cover"
                                    src="./images/banks/itau.png"
                                    alt="Banco ITAU"
                                />
                            </div>
                        </div>
                        <a
                            onClick={skip}
                            className="mt-10 flex cursor-pointer items-center justify-center text-lg hover:underline"
                        >
                            Prefiero no conectar con mi banco...
                        </a>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
