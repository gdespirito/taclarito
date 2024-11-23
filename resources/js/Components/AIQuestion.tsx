import React from 'react';

export const AIQuestion = ({
    value,
    onChange,
    placeholder,
    onSend,
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    onSend: () => void;
}) => {
    return (
        <div className="flex items-center mb-3">
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            />
            <button
                onClick={onSend}
                className="ml-3 px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 focus:outline-none"
            >
             Enviar
            </button>
        </div>
    );
};
