import { Car, ClipboardList, Timer, User } from "reicon-react";

import { AppLayout } from "@/components/garage/layout";
import { CountUp, Reveal } from "@/components/garage/motion";
import {
    Card,
    EmptyState,
    SectionTitle,
    StatusBadge,
} from "@/components/garage/ui";
import { dateParts, formatCurrency } from "@/lib/garage-data";
import { useGarage } from "@/lib/garage-store";


export default function Dashboard() {
    const { clients, vehicles, orders } = useGarage();

    const pendentes = orders.filter((o) => o.status === "PENDENTE");

    const proximos = [...orders]
        .filter(
            (o) =>
                o.status !== "CANCELADO" &&
                o.status !== "CONCLUIDO"
        )
        .sort((a, b) => a.data.localeCompare(b.data))
        .slice(0, 6);

    const stats = [
        {
            label: "Clientes",
            value: clients.length,
            icon: User,
        },
        {
            label: "Veículos",
            value: vehicles.length,
            icon: Car,
        },
        {
            label: "Ordens de Serviço",
            value: orders.length,
            icon: ClipboardList,
        },
        {
            label: "Serviços Pendentes",
            value: pendentes.length,
            icon: Timer,
        },
    ];

    const faturamento = orders
        .filter((o) => o.status === "CONCLUIDO")
        .reduce((sum, o) => sum + o.valor, 0);

    const emAndamento = orders.filter(
        (o) => o.status === "EM ANDAMENTO"
    ).length;

    const ticketMedio = orders.length
        ? orders.reduce((s, o) => s + o.valor, 0) / orders.length
        : 0;

    return (
        <AppLayout
            title="Dashboard"
            subtitle="Painel geral da oficina"
        >
            {/* Destaque: faturamento e ordens na bancada */}
            <Reveal>
                <Card className="grain overflow-hidden p-6 sm:p-8">
                    <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="md:col-span-2">
                            <p className="stencil text-steel">
                                Faturamento concluído
                            </p>

                            <p className="heading mt-3 text-4xl text-bone sm:text-6xl">
                                {formatCurrency(faturamento)}
                            </p>

                            <p className="mt-3 text-sm text-steel">
                                Ticket médio por ordem:{" "}
                                <span className="text-bone">
                                    {formatCurrency(ticketMedio)}
                                </span>
                            </p>
                        </div>

                        <div className="rounded-2xl border border-burnt-red/40 bg-burnt-red/10 p-5">
                            <p className="stencil text-burnt-red">
                                Na bancada agora
                            </p>

                            <p className="heading mt-2 text-5xl text-bone">
                                <CountUp value={emAndamento} />
                            </p>

                            <p className="mt-1 text-xs text-steel">
                                ordens em andamento
                            </p>
                        </div>
                    </div>
                </Card>
            </Reveal>

            {/* Indicadores */}
            <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
                {stats.map((s, i) => (
                    <Reveal
                        key={s.label}
                        delay={0.1 + i * 0.07}
                    >
                        <Card interactive className="h-full p-4 sm:p-5">
                            <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-burnt-red/10 text-burnt-red">
                                    <s.icon className="h-5 w-5" />
                                </span>

                                <p className="stencil text-steel">
                                    {s.label}
                                </p>
                            </div>

                            <p className="heading mt-4 text-4xl text-bone">
                                <CountUp value={s.value} />
                            </p>
                        </Card>
                    </Reveal>
                ))}
            </div>

            {/* Linha do tempo dos próximos serviços */}
            <Reveal delay={0.4} className="mt-10">
                <SectionTitle
                    title="Próximos serviços"
                    hint="ordenado por data"
                />

                {proximos.length === 0 ? (
                    <EmptyState
                        title="Nenhum serviço agendado"
                        description="Quando houver ordens pendentes ou em andamento, elas aparecem aqui."
                    />
                ) : (
                    <ol className="space-y-3">
                        {proximos.map((o) => {
                            const client = clients.find(
                                (c) => c.id === o.clientId
                            );

                            const vehicle = vehicles.find(
                                (v) => v.id === o.vehicleId
                            );

                            const { day, month } = dateParts(o.data);

                            return (
                                <li key={o.id}>
                                    <Card className="flex items-center gap-4 p-4 sm:gap-5">
                                        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-line bg-ink">
                                            <span className="heading text-lg text-bone">
                                                {day}
                                            </span>

                                            <span className="stencil text-[0.6rem] text-burnt-red">
                                                {month}
                                            </span>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-bone">
                                                {o.servico}
                                            </p>

                                            <p className="truncate text-xs text-steel">
                                                {client?.nome ?? "—"} · {vehicle?.modelo ?? "—"}
                                            </p>
                                        </div>

                                        <StatusBadge status={o.status} />
                                    </Card>
                                </li>
                            );
                        })}
                    </ol>
                )}
            </Reveal>
        </AppLayout>
    );
}
