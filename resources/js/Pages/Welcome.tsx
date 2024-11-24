import React, { useEffect, useState } from 'react'
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

import { usePage } from '@inertiajs/react';

const LandingPage: React.FC = () => {
  const { auth } = usePage().props;
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-b from-purple-900 to-purple-800 text-white overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              ¿Ta Clarito? 🤑
            </h1>
            <p className={`text-xl md:text-2xl mb-8 transition-all duration-1000 delay-300 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Revisa tus finanzas de manera inteligente con la ayuda de IA
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="col-span-2 px-5 flex w-full items-center justify-center rounded-lg bg-indigo-900 py-4 font-semibold text-white transition-colors hover:bg-indigo-800 focus:outline-none"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="flex w-full items-center px-5 justify-center rounded-lg bg-indigo-900 py-4 font-semibold text-white transition-colors hover:bg-indigo-800 focus:outline-none"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="flex w-full items-center px-5 justify-center rounded-lg border-2 border-white py-4 font-semibold text-white transition-colors hover:bg-indigo-50 focus:outline-none dark:border-white dark:text-white dark:hover:bg-indigo-900/20"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { value: '89%', description: 'de los chilenos buscan reducir gastos' },
              { value: '25%', description: 'sufre de ansiedad por temas económicos' },
              { value: '2+', description: 'años de preocupación financiera' },
            ].map((stat, index) => (
              <div key={index} className="text-center transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}` ">
                <h3 className="text-6xl font-bold text-purple-900 mb-2">{stat.value}</h3>
                <p className="text-2    xl text-gray-600">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            ¿Cómo funciona Taclarito?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { icon: '📊', title: 'Conecta tus cuentas', description: 'Vincula tus cuentas bancarias y tarjetas de crédito de forma segura' },
              { icon: '📄', title: 'Sube documentos', description: 'Importa cartolas, boletas, facturas y rendiciones fácilmente' },
              { icon: '🤖', title: 'Análisis IA', description: 'Clasificación automática y recomendaciones personalizadas' },
              { icon: '💰', title: 'Optimiza gastos', description: 'Encuentra oportunidades de ahorro y mejora tu bienestar económico' },
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            No dejes que la incertidumbre económica siga afectando tu vida
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Únete a Taclarito y recupera el control de tus finanzas. ¡Taclarito, no?
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 Taclarito.cl - Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

