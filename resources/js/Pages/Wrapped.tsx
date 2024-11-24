import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
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

export default function Wrapped(props:any) {
  console.log(props);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [cards, setCards] = useState<CategoryCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [total, setTotal] = useState(0);

  const messages = [
    'Contando las piscolas... 🥃',
    '¡Mucho pádel partner 🎾!',
    'Era necesario lo de MercadoLibre 📦?',
    'Cómo tantas suscripciones 😱!?',
  ];

  const totalSlides = cards.length + 1; // Summary + cards

  const { y } = useSpring({
    y: currentIndex * -100,
    config: { tension: 120, friction: 14 },
  });
  
  const isScrolling = useRef(false);

  const handleScroll = (deltaY: number) => {
    if (isScrolling.current) return;

    if (deltaY > 0 && currentIndex < totalSlides - 1) {
      isScrolling.current = true;
      setCurrentIndex((prev) => prev + 1);
    } else if (deltaY < 0 && currentIndex > 0) {
      isScrolling.current = true;
      setCurrentIndex((prev) => prev - 1);
    }

    // Reset the `isScrolling` flag after animation
    setTimeout(() => {
      isScrolling.current = false;
    }, 500); // Match this duration to your animation
  };

  useEffect(() => {
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
    };
  }, [currentIndex, totalSlides]);

  useEffect(() => {
    const categories = props.categories;
  
    const fetchedCards:any = Object.keys(categories).map((key) => {
      const category = categories[key];
      return {
        title: category.category.charAt(0).toUpperCase() + category.category.slice(1), // Capitalize the title
        amount: `$${category.sum.toLocaleString()}`, // Format amount with currency
        quantity: Math.ceil(category.sum / 1000), // Placeholder quantity logic
        rant: `¿Estás gastando mucho en ${category.category}?`, // Placeholder rant
        emoji: '💸', // Placeholder emoji
      };
    });
  
    // Calculate the total sum
    const totalAmount:any = Object.values(categories).reduce((acc, category: any) => acc + category.sum, 0);
  
    setCards(fetchedCards);
    setTotal(totalAmount);
    setIsLoading(false);
  }, [props.categories]);
  
  
  const formattedMinDate = props.minDate.split(' ')[0];
  const formattedMaxDate = props.maxDate.split(' ')[0];
  
  

  return (
    <AuthenticatedLayout>
      <Head title="Wrapped" />
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 dark:text-white overflow-hidden">
        <div className="relative w-full max-w-4xl h-screen">
          {isLoading ? (
           <div className="flex-shrink-0 h-screen flex flex-col items-center justify-center">
           <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mb-4"></div>
           <p className="text-xl text-gray-700 dark:text-gray-300">
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
                    <p className="text-lg text-gray-600 dark:text-gray-400 pb-3 text-center">
                      Desde el {formattedMinDate} al {formattedMaxDate} gastaste:
                    </p>
                    <p>
                    <span className="text-4xl font-bold">${total.toLocaleString()}</span>
                    </p>
                  </div>
                  
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full px-6 w-full max-w-3xl">
                      <div className="flex flex-col items-center justify-center h-full w-full rounded-xl bg-gradient-to-r p-8 text-black dark:text-white">
                        <span className="text-8xl mb-6 animate-bounce">
                          {'emoji' in card && card.emoji}
                        </span>
                        <h2 className="text-5xl font-extrabold mb-4 tracking-wide">
                          {'title' in card && card.title}
                        </h2>
                        <p className="mt-2 text-6xl font-extrabold mb-4 bg-black dark:bg-white text-white dark:text-gray-800 rounded-lg px-4 py-2 shadow-md">
                          {'amount' in card && card.amount}
                        </p>
                        <p className="mt-4 text-3xl font-bold text-yellow-600 dark:text-yellow-300">
                          {'quantity' in card && card.quantity}{' '}
                          {'quantity' in card && (card.quantity === 1 ? 'compra' : 'compras')}
                        </p>
                        <p className="mt-4 text-2xl italic font-light dark:text-gray-200">
                          {"rant" in card && card.rant}
                        </p>
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
