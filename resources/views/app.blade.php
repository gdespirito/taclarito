<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Taclarito 💰</title>
        <meta name="description" content="Taclarito.cl te ayuda a consolidar y gestionar tus finanzas de forma sencilla. Conecta tus cuentas, sube documentos y recibe recomendaciones personalizadas basadas en Inteligencia Artificial para optimizar tus gastos y mejorar tu bienestar económico.">
        <meta name="keywords" content="finanzas personales, optimizar gastos, inteligencia artificial, ahorro, control financiero, finanzas Chile, gestión de gastos, finanzas familiares, reducir gastos, bienestar económico">
        <meta name="author" content="Taclarito">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="robots" content="index, follow">    

        <!-- Open Graph / Facebook -->
        <meta property="og:title" content="Taclarito - Recupera el Control de tus Finanzas con IA">
        <meta property="og:description" content="¿Sabías que el 89% de los chilenos están tratando de reducir gastos? Taclarito es la herramienta que necesitas para gestionar tus finanzas y encontrar oportunidades de ahorro, utilizando Inteligencia Artificial.">
        <meta property="og:image" content="https://taclarito.cl/assets/og-image.jpg">
        <meta property="og:url" content="https://taclarito.cl">
        <meta property="og:type" content="website">

        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="Taclarito - Recupera el Control de tus Finanzas con IA">
        <meta name="twitter:description" content="Con Taclarito, toma decisiones financieras informadas y mejora tu bienestar económico. Gestiona tus gastos con Inteligencia Artificial.">
        <meta name="twitter:image" content="https://taclarito.cl/assets/twitter-image.jpg">

        <!-- Additional Meta Tags -->
        <meta name="theme-color" content="#6A0DAD">
        <link rel="canonical" href="https://taclarito.cl">

        <!-- Favicon -->
        <link rel="icon" href="https://taclarito.cl/favicon.ico" type="image/x-icon">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
