import logo from '@assets/logo/isologoA.png';
import { Box, Building2, Cog } from 'lucide-react';

const HomePage = () => {
    return (
            <main className="relative overflow-hidden min-h-dvh flex flex-col bg-background text-foreground">
                {/* Fondo decorativo */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                    {/* Blobs de color */}
                    <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-primary/25 blur-3xl animate-pulse" />
                    <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-green/30 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" style={{animationDelay:'1.5s'}} />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-radial from-primary/10 via-background to-background opacity-70" />

                    {/* Íconos decorativos animados */}
                    <div className="absolute inset-0">
                        {/* Grid dispersa de íconos pequeños */}
                            {[
                                { Icon: Box, className: 'top-20 left-6 md:left-24 animate-combo-drift-1', size: 28, color: 'text-primary/70' },
                                { Icon: Building2, className: 'top-48 left-1/5 animate-combo-drift-2', size: 26, color: 'text-secondary/70' },
                                { Icon: Cog, className: 'top-16 right-1/4 animate-combo-float-arc', size: 30, color: 'text-primary/60' },
                                { Icon: Box, className: 'bottom-40 left-10 animate-combo-drift-2', size: 24, color: 'text-secondary/60' },
                                { Icon: Building2, className: 'bottom-28 right-10 animate-combo-drift-1', size: 28, color: 'text-primary/65' },
                                { Icon: Cog, className: 'top-1/2 left-1/3 animate-combo-float-arc', size: 34, color: 'text-secondary/55' },
                                { Icon: Box, className: 'top-1/3 right-8 animate-combo-drift-2', size: 22, color: 'text-primary/55 hidden md:block' },
                                { Icon: Building2, className: 'bottom-1/3 left-1/2 animate-combo-drift-1', size: 24, color: 'text-secondary/65 hidden md:block' },
                                { Icon: Cog, className: 'bottom-16 left-1/3 animate-combo-spin', size: 26, color: 'text-primary/50 hidden md:block' },
                                { Icon: Box, className: 'top-56 right-1/3 animate-combo-drift-1', size: 20, color: 'text-secondary/60 hidden md:block' },
                                { Icon: Building2, className: 'top-10 right-12 animate-combo-drift-2', size: 23, color: 'text-primary/55 hidden md:block' },
                                { Icon: Cog, className: 'bottom-8 right-1/4 animate-combo-float-arc', size: 32, color: 'text-secondary/60 hidden md:block' },
                                { Icon: Box, className: 'top-2/3 left-8 animate-combo-drift-2', size: 18, color: 'text-primary/50 hidden md:block' },
                                { Icon: Building2, className: 'top-1/4 right-1/5 animate-combo-drift-1', size: 21, color: 'text-secondary/55 hidden md:block' },
                            ].map(({ Icon, className, size, color }, idx) => (
                                <div
                                    key={idx}
                                    className={`absolute ${className} opacity-35 md:opacity-45 pointer-events-none`}
                                    style={{ animationDelay: `${(idx % 7) * 0.9}s` }}
                                >
                                    <Icon size={size} className={`${color} [stroke-width:1.25] drop-shadow-sm`} />
                                </div>
                            ))}
                    </div>
                </div>
                {/* Header (más compacto) */}
                <header className="w-full py-2 md:py-3 flex items-center justify-center border-b border-border/70 bg-card/70 backdrop-blur-sm supports-[backdrop-filter]:bg-card/50">
                    <img src={logo} alt="Logo" className="h-8 md:h-10 w-auto drop-shadow-sm" loading="lazy" />
            </header>

            {/* Hero */}
            <section className="relative flex flex-1 items-center justify-center px-6">
                <div className="max-w-2xl mx-auto text-center space-y-8 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                        Sistema de <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Venexporta</span>
                    </h1>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        La Agencia de Promoción de Exportaciones es la iniciativa estratégica del Gobierno de Venezuela para diversificar la economía nacional a través del fortalecimiento y promoción de exportaciones no petroleras.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/login"
                            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-8 py-3 text-sm font-medium shadow hover:opacity-90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring order-1"
                        >
                            Iniciar sesión
                        </a>
                        <a
                            href="/register"
                            className="inline-flex items-center justify-center rounded-md bg-green text-primary px-8 py-3 text-sm font-medium shadow hover:opacity-90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring order-2"
                        >
                            Crear cuenta
                        </a>
                    </div>
                </div>
            </section>

            {/* Sección de features eliminada a solicitud del usuario */}

            {/* Footer */}
            <footer className="w-full py-3 text-center border-t border-border bg-card/50 backdrop-blur-sm">
                <p className="text-muted-foreground/80 text-[11px] md:text-xs font-normal tracking-tight">
                    &copy; {new Date().getFullYear()} Hecho en Venezuela. Todos los derechos reservados.
                </p>
            </footer>
        </main>
    );
};

export default HomePage;