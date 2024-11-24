import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

type CategoryCard = {
  title: string;
  amount: string;
  dateRange: string;
  rant: string;
  emoji: string;
  quantity: number;
  isSummary?: boolean;
};

export default function Wrapped() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [cards, setCards] = useState<CategoryCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const messages = [
    'Contando las piscolas... 🥃',
    '¡Mucho pádel partner 🎾!',
    'Era necesario lo de MercadoLibre 📦?',
    'Cómo tantas suscripciones 😱!?',
  ];

  const totalSlides = cards.length + 1; // Summary + cards

  // Spring animation for smooth scrolling
  const { y } = useSpring({
    y: currentIndex * -100, // Calculate the Y offset based on the index
    config: { tension: 120, friction: 14 }, // Adjust tension and friction for smoother animation
  });

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isLoading) {
      interval = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % messages.length);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isLoading, messages.length]);

  useEffect(() => {
    setTimeout(() => {
      const fetchedCards = [
        {
          title: 'Delivery',
          amount: '$1.560.000',
          dateRange: '01 Jan - 31 Jan',
          quantity: 10,
          rant: 'Vamos bajando la cantidad de deliverys, ¿no?',
          emoji: '🍔',
        },
        {
          title: 'Food',
          amount: '$200.000',
          dateRange: '01 Jan - 31 Jan',
          quantity: 10,
          rant: 'ñam ñam',
          emoji: '🍕',
        },
        {
          title: 'Health',
          amount: '$3.000.100',
          dateRange: '01 Jan - 31 Jan',
          quantity: 2,

          rant: '¿Tantas pastillas? 💊',
          emoji: '💊',
        },
        {
          title: 'Shopping',
          amount: '$500.000',
          quantity: 98,
          rant: '¿Otra vez comprando ropa? 👗',
          dateRange: '01 Jan - 31 Jan',
          emoji: '🛍️',
        },
      ];
      setCards(fetchedCards);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleScroll = (e: WheelEvent) => {
    if (e.deltaY > 0 && currentIndex < totalSlides - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (e.deltaY < 0 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const onWheel = (e: WheelEvent) => handleScroll(e);
    window.addEventListener('wheel', onWheel);

    return () => {
      window.removeEventListener('wheel', onWheel);
    };
  }, [currentIndex, totalSlides]);

  return (
    <AuthenticatedLayout>
      <Head title="Wrapped" />
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 dark:text-white overflow-hidden">
        <div className="relative w-full max-w-4xl h-screen">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-4 text-xl text-gray-700 dark:text-gray-300">
                {messages[currentMessage]}
              </p>
            </div>
          ) : (
            <animated.div
              style={{
                transform: y.to((val) => `translateY(${val}vh)`),
              }}
              className="h-full"
            >
              {[{ isSummary: true }, ...cards].map((card, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 h-screen flex items-center justify-center"
                >
                  {card.isSummary ? (
                    <div className="flex flex-col items-center justify-center h-full px-6 w-full max-w-3xl">
                      <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text pb-3 text-center">
                        Resumen de tus gastos
                      </h1>
                      <p className="text-lg text-gray-600 dark:text-gray-400 pb-3 text-center   ">
                        Desde el 17 de enero al 20 de noviembre del 2024
                        gastaste:
                      </p>
                      <p>
                        <span className="text-4xl font-bold">$56.900.800</span>
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full px-6 w-full max-w-3xl">
                    <div className="flex flex-col items-center justify-center h-full w-full rounded-xl bg-gradient-to- p-8 shadow-lg text-white">
                      {'emoji' in card && (
                        <span className="text-8xl mb-6 animate-bounce">{card.emoji}</span>
                      )}
                      {'title' in card && (
                        <h2 className="text-5xl font-extrabold mb-4 tracking-wide">
                          {card.title}
                        </h2>
                      )}
                      {'amount' in card && (
                        <p className="mt-2 text-6xl font-extrabold mb-4 bg-white text-gray-800 rounded-lg px-4 py-2 shadow-md">
                          {card.amount}
                        </p>
                      )}
                      {'quantity' in card && (
                        <p className="mt-4 text-3xl font-bold text-yellow-300">
                          {card.quantity} {card.quantity === 1 ? 'compra' : 'compras'}
                        </p>
                      )}
                      {'rant' in card && (
                        <p className="mt-4 text-2xl italic font-light text-gray-200">
                          "{card.rant}"
                        </p>
                      )}
                    </div>
                  </div>
                  
                  
                  )}
                </div>
              ))}
            </animated.div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
