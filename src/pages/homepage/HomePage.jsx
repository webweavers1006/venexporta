import logo from '@assets/logo/isologoA.png';
import mask3 from '@assets/logo/mask3.png';
import { ArrowRight, LogIn, UserPlus } from 'lucide-react';
import useSEO from '@hooks/use-seo.js';
import { SEO_CONFIG } from '@config/seo.js';

const HomePage = () => {
    useSEO({
        title: SEO_CONFIG.defaults.title,
        description: SEO_CONFIG.defaults.description,
        canonical: SEO_CONFIG.domain,
        og: {
            type: 'website',
            title: SEO_CONFIG.defaults.title,
            description: 'Registro simplificado, acceso a eventos y ruedas de negocios globales, y soporte integral para exportadores.',
            url: SEO_CONFIG.domain,
            image: SEO_CONFIG.media.ogImage,
            width: '1200',
            height: '630',
            site_name: SEO_CONFIG.siteName,
            locale: SEO_CONFIG.locale,
            imageAlt: SEO_CONFIG.media.ogImageAlt,
        },
        twitter: {
            card: 'summary_large_image',
            title: SEO_CONFIG.defaults.title,
            description: 'Impulsa tus exportaciones con registro simplificado, eventos y soporte integral.',
            image: SEO_CONFIG.media.ogImage,
            site: SEO_CONFIG.twitterSite || undefined,
        },
        jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: SEO_CONFIG.organization.name,
            url: SEO_CONFIG.domain,
            logo: SEO_CONFIG.organization.logo,
            sameAs: SEO_CONFIG.organization.sameAs,
        },
        jsonLdId: 'org-jsonld'
    });

    return (
        <main
            className="relative overflow-hidden min-h-dvh flex flex-col bg-background text-foreground bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url(${SEO_CONFIG.media.bgHero})` }}
        >
                        {/* SEO handled via useSEO hook */}
            {/* Fondo con superposición para legibilidad */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                {/* Scrim oscuro para mejorar contraste en modo claro (y sutil en dark) */}
                <div className="absolute inset-0 bg-black/40 dark:bg-black/20" />
                {/* Película superior con degradado de primary a green */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/25 via-primary/10 to-green/25" />
                {/* Degradado vertical suave para reforzar contraste en la parte inferior */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/65 dark:from-background/10 dark:via-transparent dark:to-background/55" />
            </div>

            {/* Hero */}
                <section className="relative flex flex-1 flex-col items-stretch px-6 pt-4 md:pt-6">
                <div className="max-w-6xl mx-auto w-full relative z-10">
                    {/* Logo centrado sobre ambas columnas */}
                        <div className="w-full flex justify-center mb-6 md:mb-8 lg:mb-10">
                        <img
                            src={mask3}
                            alt="Logo Venexporta"
                            className=" mask mask-squircle size-25 md:h-20 w-auto mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                            loading="lazy"
                        />
                    </div>
                </div>

                {/* Contenedor que centra verticalmente la sección principal bajo el logo */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="max-w-6xl mx-auto w-full relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            {/* Columna izquierda: contenido */}
                            <div className="text-center md:text-left space-y-8">
                                {/* Brand pill con logo y acento bg-green */}
                                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border border-border/70 bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-sm">
                                    <span className="relative inline-flex items-center justify-center h-6 w-6 rounded-full ring-1 ring-border/60 bg-green/15">
                                        <img src={logo} alt="Logo" className="h-4 w-4 object-contain" loading="lazy" />
                                    </span>
                                    <span className="h-2 w-2 rounded-full bg-green" />
                                    <span>Plataforma de gestión y promoción exportadora</span>
                                </div>

                                <h1 className="text-white text-4xl md:text-5xl font-semibold tracking-tight drop-shadow-[0_3px_12px_rgba(0,0,0,0.55)]">
                                    Sistema de Venexporta
                                </h1>
                                <p className="text-white text-lg leading-relaxed md:max-w-[46ch] md:mx-0 mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">
                                    La Agencia de Promoción de Exportaciones es la iniciativa estratégica del Gobierno de Venezuela para diversificar la economía nacional a través del fortalecimiento y promoción de exportaciones no petroleras.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                    {/* Botón 1: Iniciar sesión (ahora con estilo verde del segundo botón) */}
                                    <a
                                        href="/login"
                                        className="group inline-flex items-center justify-center rounded-lg bg-green bg-gradient-to-r from-green to-[color-mix(in_oklab,hsl(var(--green))_85%,black)] text-foreground dark:text-primary-foreground px-8 py-3 text-sm font-semibold shadow-lg shadow-green/20 hover:shadow-green/30 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green/40 order-1"
                                    >
                                        <LogIn size={18} className="mr-2 opacity-90" />
                                        Iniciar sesión
                                        <ArrowRight size={18} className="ml-2 translate-x-0 group-hover:translate-x-0.5 transition-transform" />
                                    </a>

                                    {/* Botón 2: Crear cuenta (ahora con estilo primary del primer botón) */}
                                    <a
                                        href="/register"
                                        className="group inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-8 py-3 text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 order-2"
                                    >
                                        <UserPlus size={18} className="mr-2 opacity-90" />
                                        Crear cuenta
                                        <ArrowRight size={18} className="ml-2 translate-x-0 group-hover:translate-x-0.5 transition-transform" />
                                    </a>
                                </div>
                            </div>

                            {/* Columna derecha: Imagen solicitada */}
                            <div className="hidden md:flex items-center justify-center w-full bg-black p-4 rounded-2xl">
                                <iframe
                                    src="https://player.vimeo.com/video/1122700078?autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0"
                                    title="Vimeo video player"
                                    frameBorder="0"
                                    className="w-full aspect-[16/9] object-cover rounded-2xl shadow-lg"
                                    style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
                                    allow="autoplay; fullscreen; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features debajo de las secciones */}
                <div className="max-w-6xl mx-auto w-full relative z-10 mb-6">
                    <div className="mt-8 md:mt-10 lg:mt-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {/* Card 1 */}
                            <div className="group rounded-2xl bg-white/10 supports-[backdrop-filter]:bg-white/10 dark:bg-white/5 backdrop-blur-md shadow-lg shadow-black/10 p-6 transition-colors hover:bg-white/15 supports-[backdrop-filter]:hover:bg-white/15">
                                <div className="w-full flex justify-center mb-4">
                                    <span className="relative inline-flex items-center justify-center h-10 w-10 rounded-full bg-secondary/15">
                                        <span className="h-3 w-3 rounded-full bg-secondary animate-pulse-dot" />
                                    </span>
                                </div>
                                <h3 className="text-center text-base font-semibold text-white">Registro Simplificado</h3>
                                <p className="text-center text-sm text-white mt-1">Proceso ágil y digital</p>
                            </div>

                            {/* Card 2 */}
                            <div className="group rounded-2xl bg-white/10 supports-[backdrop-filter]:bg-white/10 dark:bg-white/5 backdrop-blur-md shadow-lg shadow-black/10 p-6 transition-colors hover:bg-white/15 supports-[backdrop-filter]:hover:bg-white/15">
                                <div className="w-full flex justify-center mb-4">
                                    <span className="relative inline-flex items-center justify-center h-10 w-10 rounded-full bg-green/15">
                                        <span className="h-3 w-3 rounded-full bg-green animate-pulse-dot" />
                                    </span>
                                </div>
                                <h3 className="text-center text-base font-semibold text-white">Acceso a eventos</h3>
                                <p className="text-center text-sm text-white mt-1">y ruedas de negocios globales</p>
                            </div>

                            {/* Card 3 */}
                            <div className="group rounded-2xl bg-white/10 supports-[backdrop-filter]:bg-white/10 dark:bg-white/5 backdrop-blur-md shadow-lg shadow-black/10 p-6 transition-colors hover:bg-white/15 supports-[backdrop-filter]:hover:bg-white/15">
                                <div className="w-full flex justify-center mb-4">
                                    <span className="relative inline-flex items-center justify-center h-10 w-10 rounded-full bg-secondary/15">
                                        <span className="h-3 w-3 rounded-full bg-secondary animate-pulse-dot" />
                                    </span>
                                </div>
                                <h3 className="text-center text-base font-semibold text-white">Soporte Integral</h3>
                                <p className="text-center text-sm text-white mt-1">Acompañamiento completo</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
           {/*  <footer className="relative z-20 w-full border-t border-border/70 bg-gradient-to-b from-background/60 via-background/70 to-background/90 backdrop-blur px-6 py-4">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-muted-foreground/90 text-[12px] md:text-sm font-normal">
                        &copy; {new Date().getFullYear()} Hecho en Venezuela. Todos los derechos reservados.
                    </p>
                </div>
            </footer> */}
        </main>
    );
};

export default HomePage;