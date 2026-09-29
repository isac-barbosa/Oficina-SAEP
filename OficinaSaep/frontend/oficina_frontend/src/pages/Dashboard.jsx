import { Car, ClipboardList, Timer, User } from "reicon-react";

import { AppLayout } from "@/components/garage/layout";
import { CountUp, Reveal } from "@/components/garage/motion";
import {
    Card,
    Cell,
    Row,
    SectionTitle,
    StatusBadge,
    Table,
} from "@/components/garage/ui";
import { formatCurrency, formatDate } from "@/lib/garage-data";
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

    return (
        <AppLayout
            title="Dashboard"
            subtitle="Painel geral da oficina"
        >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((s, i) => (
                    <Reveal
                        key={s.label}
                        delay={i * 0.08}
                    >
                        <Card interactive className="grain h-full p-5">
                            <div className="relative z-10 flex items-start justify-between">
                                <div>
                                    <p className="stencil text-steel">
                                        {s.label}
                                    </p>

                                    <p className="heading mt-2 text-4xl text-bone">
                                        <CountUp value={s.value} />
                                    </p>
                                </div>

                                <s.icon className="h-6 w-6 text-burnt-red" />
                            </div>

                            <div className="hatch relative z-10 mt-4 h-0.75 w-14 opacity-60" />
                        </Card>
                    </Reveal>
                ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
                <Reveal
                    delay={0.3}
                    className="xl:col-span-2"
                >
                    <SectionTitle
                        title="Próximos serviços"
                        hint="ordenado por data"
                    />

                    <Table
                        head={[
                            "Data",
                            "Cliente",
                            "Veículo",
                            "Serviço",
                            "Status",
                        ]}
                    >
                        {proximos.map((o) => {
                            const client = clients.find(
                                (c) => c.id === o.clientId
                            );

                            const vehicle = vehicles.find(
                                (v) => v.id === o.vehicleId
                            );

                            return (
                                <Row key={o.id}>
                                    <Cell className="font-mono text-xs text-steel">
                                        {formatDate(o.data)}
                                    </Cell>

                                    <Cell>
                                        {client?.nome ?? "—"}
                                    </Cell>

                                    <Cell className="text-bone/70">
                                        {vehicle?.modelo ?? "—"}
                                    </Cell>

                                    <Cell>{o.servico}</Cell>

                                    <Cell>
                                        <StatusBadge status={o.status} />
                                    </Cell>
                                </Row>
                            );
                        })}
                    </Table>
                </Reveal>

                <Reveal delay={0.4}>
                    <SectionTitle title="Resumo" />

                    <div className="space-y-4">
                        <Card className="grain p-5">
                            <p className="stencil relative z-10 text-steel">
                                Faturamento concluído
                            </p>

                            <p className="heading relative z-10 mt-2 text-3xl text-bone">
                                {formatCurrency(faturamento)}
                            </p>
                        </Card>

                        <Card className="p-5">
                            <p className="stencil text-steel">
                                Na bancada agora
                            </p>

                            <p className="heading mt-2 text-3xl text-burnt-red">
                                <CountUp value={emAndamento} />
                            </p>

                            <p className="mt-1 text-xs text-steel">
                                ordens em andamento
                            </p>
                        </Card>

                        <Card className="p-5">
                            <p className="stencil text-steel">
                                Ticket médio
                            </p>

                            <p className="heading mt-2 text-3xl text-bone">
                                {formatCurrency(
                                    orders.length
                                        ? orders.reduce(
                                            (s, o) => s + o.valor,
                                            0
                                        ) / orders.length
                                        : 0
                                )}
                            </p>
                        </Card>
                    </div>
                </Reveal>
            </div>
        </AppLayout>
    );
}