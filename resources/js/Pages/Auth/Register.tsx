import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Registro" />
                <div className="w-full max-w-md">
                    <div className="rounded-lg bg-white p-8 dark:bg-gray-800">
                        {/* Title Section */}
                        <div className="mb-8 text-center">
                            <h1 className="mb-4 text-4xl font-bold text-gray-800 dark:text-gray-100">
                                ¡Crear cuenta! 🚀
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                Completa tus datos para registrarte
                            </p>
                        </div>

                        <form onSubmit={submit}>
                            <div className="space-y-6">
                                <div>
                                    <InputLabel
                                        htmlFor="name"
                                        value="Nombre"
                                        className="text-gray-700 dark:text-gray-300"
                                    />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="email"
                                        value="Correo electrónico"
                                        className="text-gray-700 dark:text-gray-300"
                                    />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                        autoComplete="username"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="password"
                                        value="Contraseña"
                                        className="text-gray-700 dark:text-gray-300"
                                    />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="password_confirmation"
                                        value="Confirmar Contraseña"
                                        className="text-gray-700 dark:text-gray-300"
                                    />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                        autoComplete="new-password"
                                        onChange={(e) =>
                                            setData('password_confirmation', e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex flex-col space-y-4">
                                    <button
                                        className="w-full rounded-lg bg-indigo-900 py-4 font-semibold text-white transition-colors hover:bg-indigo-800 focus:outline-none disabled:opacity-75"
                                        disabled={processing}
                                    >
                                        Registrarse
                                    </button>

                                    <Link
                                        href={route('login')}
                                        className="text-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                                    >
                                        ¿Ya tienes cuenta?{' '}
                                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                            Inicia sesión
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
        </GuestLayout>
    );
}
