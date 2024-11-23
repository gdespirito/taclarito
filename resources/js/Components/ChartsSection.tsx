import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { AIQuestion } from './AIQuestion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register required Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export const ChartsSection = ({
    handleBack,
    handleInputChange,
    inputValue,
    onSend,
}: {
    handleBack: () => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputValue: string;
    onSend: () => void;
}) => {
    const barData = {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
            {
                label: 'Sales',
                data: [30, 45, 60, 75, 90],
                backgroundColor: 'rgba(79, 70, 229, 0.8)', // Tailwind indigo-600
            },
        ],
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
                labels: {
                    color: '#FFFFFF',
                },
            },
            title: {
                display: true,
                text: 'Monthly Sales',
                color: '#FFFFFF',
            },
        },
        scales: {
            x: {
                ticks: {
                    color: '#FFFFFF',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
            },
            y: {
                ticks: {
                    color: '#FFFFFF',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
            },
        },
    };

    const pieData = {
        labels: ['Product A', 'Product B', 'Product C'],
        datasets: [
            {
                label: 'Product Distribution',
                data: [40, 35, 25],
                backgroundColor: [
                    'rgba(79, 70, 229, 0.8)', // Tailwind indigo-600
                    'rgba(31, 41, 55, 0.8)', // Tailwind gray-800
                    'rgba(107, 114, 128, 0.8)', // Tailwind gray-600
                ],
                borderColor: 'transparent',
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'bottom' as const,
                labels: {
                    color: '#FFFFFF',
                },
            },
            title: {
                display: true,
                text: 'Product Sales Distribution',
                color: '#FFFFFF',
            },
        },
    };

    return (
        <div className="transition-opacity duration-500 opacity-100 visible">
            {/* Back Button */}
            <button
                className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                onClick={handleBack}
            >
                Volver
            </button>

            {/* Input Field */}
            <AIQuestion
                value={inputValue}
                onChange={handleInputChange}
                placeholder="¿Cuánto café tomé este mes? 🤔"
                onSend={onSend}
            />

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bar Chart */}
                <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Monthly Sales</h3>
                    <Bar data={barData} options={barOptions} />
                </div>

                {/* Pie Chart */}
                <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Product Sales Distribution</h3>
                    <Pie data={pieData} options={pieOptions} />
                </div>
            </div>
        </div>
    );
};
