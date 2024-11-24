import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from "@inertiajs/react";
import { animated, useSpring } from '@react-spring/web';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/es';
import { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { CATEGORIES } from '../utils';

type CategoryCard = {
    title: string;
    amount: string;
    dateRange: string;
    rant: string;
    emoji: string;
    quantity: number;
    isSummary?: boolean;
};

export default function Wrapped(props: any) {
    moment.locale('es');
    const [isLoading, setIsLoading] = useState(true);
    const [currentMessage, setCurrentMessage] = useState(0);
    const [cards, setCards] = useState<CategoryCard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [total, setTotal] = useState(0);
    const [roast, setRoast] = useState<Record<string, string>>({}); // Roast messages
    const [filesReady, setFilesReady] = useState(!props.waitForFile);
    const [fintocReady, setFintocReady] = useState(!props.waitForFintoc);

    // Initialize messages as a state variable
    const initialMessages = [
        'Contando las piscolas... 🥃',
        '¡Mucho pádel partner 🎾!',
        'Era necesario lo de MercadoLibre 📦?',
        'Cómo tantas suscripciones 😱!?',
    ];
    const [messages, setMessages] = useState<string[]>([]);

    const totalSlides = cards.length + 1; // Summary + cards

    const { y } = useSpring({
        y: currentIndex * -100,
        config: { tension: 120, friction: 14 },
    });

    const isScrolling = useRef(false);

    const handleScroll = (deltaY: number) => {
        if (isScrolling.current || isLoading) return; // Disable scrolling until data is loaded

        if (deltaY > 0 && currentIndex < totalSlides - 1) {
            isScrolling.current = true;
            setCurrentIndex((prev) => prev + 1);
        } else if (deltaY < 0 && currentIndex > 0) {
            isScrolling.current = true;
            setCurrentIndex((prev) => prev - 1);
        }

        setTimeout(() => {
            isScrolling.current = false;
        }, 500); // Match this duration to your animation
    };

    useEffect(() => {
        (window as any).Echo.private(`App.Models.User.${props.auth.user.id}`)
            .listen('FinishedFintocImport', (e: any) => {
                toast('Ya está lista la carga de movimientos de tu banco');
                setFintocReady(true);
                if (fintocReady && filesReady) {
                    setIsLoading(false);
                    window.reload();
                }
            })
            .listen('FinishedFileProcess', (e: any) => {
                toast('Ya está lista la carga de movimientos de tu archivo');
                setFilesReady(true);
                if (fintocReady && filesReady) {
                    setIsLoading(false);
                    window.reload();
                }
            });

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            handleScroll(e.deltaY);
        };

        let touchStartY = 0;

        const onTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
        };

        const onTouchEnd = (e: TouchEvent) => {
            const touchEndY = e.changedTouches[0].clientY;
            const deltaY = touchStartY - touchEndY;

            if (Math.abs(deltaY) > 50) {
                handleScroll(deltaY);
            }
        };

        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('touchstart', onTouchStart);
        window.addEventListener('touchend', onTouchEnd);

        return () => {
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchend', onTouchEnd);

            (window as any).Echo.private(
                `App.Models.User.${props.auth.user.id}`,
            )
                .stopListening('FinishedFintocImport')
                .stopListening('FinishedFileProcess');
        };
    }, [currentIndex, totalSlides, isLoading]); // Added isLoading to dependencies

    // Shuffle messages and set up message cycling
    useEffect(() => {
        // Shuffle messages
        const shuffledMessages = [...initialMessages].sort(
            () => Math.random() - 0.5,
        );
        setMessages(shuffledMessages);
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isLoading) {
            interval = setInterval(() => {
                setCurrentMessage((prev) => (prev + 1) % messages.length);
            }, 1500); // Change message every 1.5 seconds
        }

        return () => {
            clearInterval(interval);
        };
    }, [isLoading, messages.length]);

    useEffect(() => {
        const fetchData = async () => {
            const startTime = Date.now(); // Record start time
            try {
                // Fetch roast data
                const roastResponse = await axios.get('/roast');
                const roastData = roastResponse.data || {};
                setRoast(roastData.roasts || {}); // Access the "roasts" key

                // Process categories after roast data is fetched
                const categories = props.categories;

                const fetchedCards: any = Object.keys(categories).map((key) => {
                    const category = categories[key];
                    const categoryKey = category.category; // Use the category name directly
                    // Find the category info from CATEGORIES
                    const categoryInfo = Object.values(CATEGORIES).find(
                        (cat) => cat.key === categoryKey,
                    );

                    return {
                        title: categoryInfo?.label || category.category,
                        amount: `$${category.sum.toLocaleString()}`,
                        quantity: category.count,
                        rant:
                            roastData.roasts?.[categoryKey] ||
                            `¿Estás gastando mucho en ${categoryInfo?.label || category.category}?`,
                        emoji: categoryInfo?.emoji || '❓',
                    };
                });

                const totalAmount: any = Object.values(categories).reduce(
                    (acc, category: any) => acc + category.sum,
                    0,
                );

                setCards(fetchedCards);
                setTotal(totalAmount);
            } catch (error) {
                console.error('Error fetching data:', error);
                setRoast({
                    default:
                        '¡No pudimos traer tu roast, pero aquí está tu resumen de gastos!',
                });
            } finally {
                const elapsedTime = Date.now() - startTime;
                const remainingTime = 6000 - elapsedTime; // Calculate remaining time to reach 6 seconds
                if (remainingTime > 0) {
                    setTimeout(() => {
                        if (fintocReady && filesReady) {
                            setIsLoading(false);
                        }
                    }, remainingTime);
                } else {
                    if (fintocReady && filesReady) {
                        setIsLoading(false);
                    }
                }
            }
        };

        fetchData();
    }, [props.categories, fintocReady, filesReady]);

    const formattedMinDate = moment(props.minDate).format('D [de] MMMM');
    const formattedMaxDate = moment(props.maxDate).format(
        'D [de] MMMM [del] YYYY',
    );

    return (
        <AuthenticatedLayout>
            <Head title="Wrapped" />
            <div className="flex min-h-screen items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-900 dark:text-white">
                <div className="relative h-screen w-full max-w-4xl">
                    {isLoading ? (
                        <div className="flex h-screen flex-shrink-0 flex-col items-center justify-center px-4">
                            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                            <p className="text-center text-3xl text-gray-700 dark:text-gray-300">
                                {messages[currentMessage]}
                            </p>
                        </div>
                    ) : (
                        <>
                            <animated.div
                                style={{
                                    transform: y.to(
                                        (val) => `translateY(${val}vh)`,
                                    ),
                                }}
                                className="h-full"
                            >
                                {[{ isSummary: true }, ...cards].map(
                                    (card, index) => (
                                        <div
                                            key={index}
                                            className="flex h-screen flex-shrink-0 items-center justify-center"
                                        >
                                            {card.isSummary ? (
                                                <div className="flex h-full w-full max-w-3xl flex-col items-center justify-center px-6">
                                                    <h1 className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text pb-3 text-center text-6xl font-bold text-transparent">
                                                        Resumen de tus gastos
                                                    </h1>
                                                    <p className="pb-3 text-center text-lg text-gray-600 dark:text-gray-400"></p>
                                                    <p className="pb-3 text-center text-lg text-gray-600 dark:text-gray-400">
                                                        Desde el{' '}
                                                        {formattedMinDate} al{' '}
                                                        {formattedMaxDate}{' '}
                                                        gastaste:
                                                    </p>
                                                    <p>
                                                        <span className="text-4xl font-bold">
                                                            $
                                                            {total.toLocaleString()}
                                                        </span>
                                                    </p>
                                                    <p className="animate-bounce pt-20 text-2xl">
                                                        ▼
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="flex h-full w-full max-w-3xl flex-col items-center justify-center px-6">
                                                    <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-gradient-to-r p-8 text-black dark:text-white">
                                                        <span className="mb-6 animate-bounce text-8xl">
                                                            {'emoji' in card &&
                                                                card.emoji}
                                                        </span>
                                                        <h2 className="mb-4 text-center text-5xl font-extrabold tracking-wide">
                                                            {'title' in card &&
                                                                card.title}
                                                        </h2>
                                                        <p className="mb-4 mt-2 rounded-lg bg-black px-4 py-2 text-6xl font-extrabold text-white shadow-md dark:bg-white dark:text-gray-800">
                                                            {'amount' in card &&
                                                                card.amount}
                                                        </p>
                                                        <p className="mt-4 text-3xl font-bold text-yellow-600 dark:text-yellow-300">
                                                            {'quantity' in
                                                                card &&
                                                                card.quantity}{' '}
                                                            {'quantity' in
                                                                card &&
                                                                (card.quantity ===
                                                                1
                                                                    ? 'compra'
                                                                    : 'compras')}
                                                        </p>
                                                        <p className="mt-4 text-center text-2xl font-light italic dark:text-gray-200">
                                                            {'rant' in card &&
                                                                card.rant}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ),
                                )}
                            </animated.div>
                        </>
                    )}
                </div>

                <div className="absolute bottom-10 right-10">
                    <button
                        onClick={() => setCurrentIndex(0)}
                        className="flex items-center rounded-lg bg-purple-900 px-4 py-2 font-semibold text-white shadow hover:bg-purple-800 focus:outline-none"
                    >
                        🚀
                        <span className="ml-2">up</span>
                    </button>
                </div>
            </div>
            <ToastContainer />
        </AuthenticatedLayout>
    );
}
