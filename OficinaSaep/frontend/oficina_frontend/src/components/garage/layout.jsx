import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Car,
    ClipboardList,
    Gauge,
    Logout,
    Settings2,
    User,
} from "reicon-react";

import { BrandMark } from "./BrandMark";
import { Avatar } from "./ui";
import { cn } from "@/lib/utils";
import { useGarage } from "@/lib/garage-store";

const NAV = [
    {
        to: "/dashboard",
        label: "Dashboard",
        short: "Início",
        icon: Gauge,
    },
    {
        to: "/clientes",
        label: "Clientes",
        short: "Clientes",
        icon: User,
    },
    {
        to: "/veiculos",
        label: "Veículos",
        short: "Veículos",
        icon: Car,
    },
    {
        to: "/ordens-servico",
        label: "Ordens de Serviço",
        short: "Ordens",
        icon: ClipboardList,
    },
];

export function Brand({ compact = false }) {
    return (
        <div className="flex items-center gap-3">
            <BrandMark className="h-10 w-10 shrink-0" />

            {!compact && (
                <div className="leading-none">
                    <p className="heading text-base text-bone">
                        Vértice Auto
                    </p>

                    <p className="heading mt-1 text-[0.62rem] tracking-[0.3em] text-burnt-red">
                        Center
                    </p>
                </div>
            )}
        </div>
    );
}

/** Barra superior fixa: marca, navegação em "pílula" e conta do usuário. */
function TopBar() {
    const { user, logout } = useGarage();
    const navigate = useNavigate();
    const pathname = useLocation().pathname;

    return (
        <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <Link to="/dashboard" aria-label="Ir para o dashboard">
                    <Brand />
                </Link>

                <nav
                    aria-label="Navegação principal"
                    className="hidden items-center gap-1 rounded-full border border-line bg-panel/80 p-1 lg:flex"
                >
                    {NAV.map(({ to, label, icon: Icon }) => {
                        const active = pathname === to;

                        return (
                            <Link
                                key={to}
                                to={to}
                                className={cn(
                                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors",

                                    active
                                        ? "bg-burnt-red text-bone-bright"
                                        : "text-steel hover:text-bone"
                                )}
                            >
                                <Icon className="h-4 w-4" />

                                {label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-2">
                    <Link
                        to="/profile"
                        aria-label="Abrir perfil"
                        className={cn(
                            "flex items-center gap-3 rounded-full border py-1 pl-1 pr-1 transition-colors sm:pr-4",

                            pathname === "/profile"
                                ? "border-burnt-red bg-panel-2"
                                : "border-line hover:border-steel"
                        )}
                    >
                        <Avatar
                            name={user?.nome}
                            className="h-8 w-8 text-xs"
                        />

                        <span className="hidden text-left leading-tight sm:block">
                            <span className="block text-sm text-bone">
                                {user?.nome ?? "Visitante"}
                            </span>

                            <span className="stencil block text-[0.6rem] text-steel">
                                {user?.cargo ?? "—"}
                            </span>
                        </span>
                    </Link>

                    <button
                        type="button"
                        aria-label="Sair"
                        title="Sair"
                        onClick={() => {
                            logout();
                            navigate("/");
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-steel transition-colors hover:border-burnt-red hover:text-burnt-red"
                    >
                        <Logout className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </header>
    );
}

/** Navegação inferior, exibida somente em telas pequenas. */
function BottomNav() {
    const pathname = useLocation().pathname;

    const items = [
        ...NAV,
        {
            to: "/profile",
            label: "Perfil",
            short: "Perfil",
            icon: Settings2,
        },
    ];

    return (
        <nav
            aria-label="Navegação principal"
            className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
        >
            <ul className="mx-auto grid max-w-lg grid-cols-5">
                {items.map(({ to, short, icon: Icon }) => {
                    const active = pathname === to;

                    return (
                        <li key={to}>
                            <Link
                                to={to}
                                className={cn(
                                    "flex flex-col items-center gap-1 px-1 py-2.5 text-[0.62rem] font-semibold uppercase tracking-wider transition-colors",

                                    active
                                        ? "text-burnt-red"
                                        : "text-steel hover:text-bone"
                                )}
                            >
                                <Icon className="h-5 w-5" />

                                {short}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

export function AppLayout({
    title,
    subtitle,
    actions,
    children,
}) {
    return (
        <div className="relative min-h-screen overflow-x-clip bg-garage-black pb-24 lg:pb-0">
            <div
                aria-hidden="true"
                className="shell-glow pointer-events-none absolute inset-x-0 top-0 h-96"
            />

            <TopBar />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Cabeçalho da página */}
                <div className="flex flex-col gap-5 pb-5 pt-8 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="stencil text-burnt-red">
                            Vértice Auto Center
                        </p>

                        <h1 className="heading mt-2 text-3xl text-bone sm:text-4xl">
                            {title}
                        </h1>

                        {subtitle && (
                            <p className="mt-2 text-sm text-steel">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {actions ? (
                        <div className="flex flex-wrap items-center gap-3">
                            {actions}
                        </div>
                    ) : null}
                </div>

                <div className="hatch mb-8 h-0.75 w-24 rounded-full opacity-70" />

                {/* Conteúdo das páginas */}
                <main className="pb-12">
                    {children}
                </main>
            </div>

            <BottomNav />
        </div>
    );
}
