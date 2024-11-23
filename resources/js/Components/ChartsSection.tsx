import React, { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { AIQuestion } from './AIQuestion';
import { transactionData } from '../data.js';
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
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Determine unique categories from transaction types
    const categories = Array.from(
        new Set(transactionData.map((t) => t.type))
    );

    const filteredData =
        selectedCategory === 'all'
            ? transactionData
            : transactionData.filter((t) => t.type === selectedCategory);

    const totalCredits = filteredData
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

    const totalDebits = filteredData
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const transactionTypeCounts = filteredData.reduce(
        (acc, t) => {
            acc[t.type] = (acc[t.type] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );

    const barData = {
        labels: ['Credits', 'Debits'],
        datasets: [
            {
                label: 'Transaction Totals',
                data: [totalCredits, totalDebits],
                backgroundColor: ['rgba(79, 70, 229, 0.8)', 'rgba(220, 38, 38, 0.8)'],
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
                text: `Credits vs. Debits (${selectedCategory})`,
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
        labels: Object.keys(transactionTypeCounts),
        datasets: [
            {
                label: 'Transaction Types',
                data: Object.values(transactionTypeCounts),
                backgroundColor: [
                    'rgba(79, 70, 229, 0.8)',
                    'rgba(31, 41, 55, 0.8)',
                    'rgba(107, 114, 128, 0.8)',
                    'rgba(220, 38, 38, 0.8)',
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
                text: `Transaction Type Distribution (${selectedCategory})`,
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

            <h4 className='mb-3 size-2xl text-white text-center'>¡Este més has gastado $16.900 en Starbucks!</h4>

            {/* Input Field */}
            <AIQuestion
                value={inputValue}
                onChange={handleInputChange}
                placeholder="¿Cuánto café tomé este mes? 🤔"
                onSend={onSend}
            />

            {/* Category Buttons */}
            <div className="flex flex-wrap gap-2 mb-3">
                <button
                    className={`px-4 py-2 rounded-lg ${
                        selectedCategory === 'all'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                    }`}
                    onClick={() => setSelectedCategory('all')}
                >
                    All
                </button>
                {categories.map((category) => (
                    <button
                        key={category}
                        className={`px-4 py-2 rounded-lg ${
                            selectedCategory === category
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                        }`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bar Chart */}
                <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Credits vs. Debits</h3>
                    <Bar data={barData} options={barOptions} />
                </div>

                {/* Pie Chart */}
                <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Transaction Type Distribution</h3>
                    <Pie data={pieData} options={pieOptions} />
                </div>
            </div>
        </div>
    );
};
