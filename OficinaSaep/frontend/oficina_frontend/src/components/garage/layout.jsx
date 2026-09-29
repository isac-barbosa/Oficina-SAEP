import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    Car,
    ClipboardList,
    Gauge,
    Logout,
    Menu,
    Settings2,
    User,
    X,
} from "reicon-react";

import { BrandMark } from "./BrandMark";
import { cn } from "@/lib/utils";
import { useGarage } from "@/lib/garage-store";
import { Button } from "./ui";

const NAV = [
    {
        to: "/dashboard",
        label: "Dashboard",
        icon: Gauge,
    },
    {
        to: "/clientes",
        label: "Clientes",
        icon: User,
    },
    {
        to: "/veiculos",
        label: "Veículos",
        icon: Car,
    },
    {
        to: "/ordens-servico",
        label: "Ordens de Serviço",
        icon: ClipboardList,
    },
];

export function Brand({ compact = false }) {
    return (
        <div className="flex items-center gap-3">
            <BrandMark className="h-10 w-10 shrink-0" />

            {!compact && (
                <div className="leading-none">
                    <p className="heading text-lg text-bone">
                        Vértice Auto
                    </p>

                    <p className="heading text-[0.7rem] tracking-[0.3em] text-burnt-red">
                        Center
                    </p>
                </div>
            )}
        </div>
    );
}

function NavItems({ onNavigate }) {
    const pathname = useLocation().pathname;

    return (
        <nav className="relative z-10 flex flex-col gap-1 px-3">
            {NAV.map(({ to, label, icon: Icon }) => {
                const active = pathname === to;

                return (
                    <Link
                        key={to}
                        to={to}
                        onClick={onNavigate}
                        className={cn(
                            "group relative flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors",

                            active
                                ? "bg-panel-2 text-bone"
                                : "text-steel hover:bg-panel-2/60 hover:text-bone"
                        )}
                    >
                        <span
                            className={cn(
                                "absolute left-0 top-1/2 h-6 w-0.75 -translate-y-1/2 bg-burnt-red transition-transform duration-200",

                                active
                                    ? "scale-y-100"
                                    : "scale-y-0 group-hover:scale-y-100"
                            )}
                        />

                        <Icon
                            className={cn(
                                "h-4 w-4 transition-colors",

                                active
                                    ? "text-burnt-red"
                                    : "text-steel group-hover:text-bone"
                            )}
                        />

                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}

function SidebarContent({ onNavigate }) {
    const { logout } = useGarage();
    const navigate = useNavigate();

    return (
        <div className="grain flex h-full flex-col border-r border-line bg-ink">

            {/* Logo */}
            <div className="relative z-10 border-b border-line px-5 py-5">
                <Brand />
            </div>

            {/* Navegação */}
            <div className="relative z-10 flex-1 overflow-y-auto py-5">
                <NavItems onNavigate={onNavigate} />
            </div>

            {/* Área inferior */}
            <div className="relative z-10 space-y-1 border-t border-line px-3 py-4">

                <Link
                    to="/profile"
                    onClick={onNavigate}
                    className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-steel transition-colors hover:bg-panel-2/60 hover:text-bone"
                >
                    <Settings2 className="h-4 w-4" />
                    Configurações
                </Link>

                <button
                    onClick={() => {
                        logout();
                        navigate("/");
                    }}
                    className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-steel transition-colors hover:bg-burnt-red/10 hover:text-burnt-red"
                >
                    <Logout className="h-4 w-4" />
                    Sair
                </button>

                <p className="stencil px-3 pt-3 text-steel/60">
                    Precisão em cada serviço.
                </p>
            </div>
        </div>
    );
}

export function AppLayout({
    title,
    subtitle,
    actions,
    children,
}) {
    const { user } = useGarage();
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-garage-black">

            {/* Sidebar desktop */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
                <SidebarContent />
            </aside>

            {/* Sidebar mobile */}
            {open && (
                <div className="fixed inset-0 z-50 lg:hidden">

                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-ink/80"
                        onClick={() => setOpen(false)}
                    />

                    {/* Menu */}
                    <div className="absolute inset-y-0 left-0 w-64 animate-in slide-in-from-left duration-200">
                        <SidebarContent
                            onNavigate={() => setOpen(false)}
                        />
                    </div>
                </div>
            )}

            {/* Conteúdo principal */}
            <div className="lg:pl-64">

                {/* Header */}
                <header className="grain sticky top-0 z-30 border-b border-line bg-ink/95 backdrop-blur">

                    <div className="relative z-10 flex items-center justify-between gap-4 px-4 py-4 sm:px-6">

                        {/* Título */}
                        <div className="flex items-center gap-3">

                            {/* Menu mobile */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                aria-label={
                                    open
                                        ? "Fechar menu"
                                        : "Abrir menu"
                                }
                                onClick={() => setOpen((value) => !value)}
                            >
                                {open ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </Button>

                            <div>
                                <h1 className="heading text-2xl text-bone">
                                    {title}
                                </h1>

                                {subtitle && (
                                    <p className="text-xs text-steel">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Usuário / ações */}
                        <div className="flex items-center gap-4">

                            {actions}

                            <div className="hidden text-right sm:block">

                                <p className="text-sm text-bone">
                                    Olá, {user?.nome ?? "Visitante"}
                                </p>

                                <p className="stencil text-steel">
                                    {user?.cargo ?? "—"}
                                </p>

                            </div>
                        </div>
                    </div>

                    {/* Linha decorativa */}
                    <div className="hatch h-0.75 w-full opacity-40" />
                </header>

                {/* Conteúdo das páginas */}
                <main className="px-4 py-6 sm:px-6 lg:px-8">
                    {children}
                </main>

            </div>
        </div>
    );
}
