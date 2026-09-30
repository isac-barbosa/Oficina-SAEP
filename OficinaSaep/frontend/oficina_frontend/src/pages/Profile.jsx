import { useNavigate } from "react-router-dom";
import { AppLayout, Brand } from "@/components/garage/layout";
import { Reveal } from "@/components/garage/motion";
import { Avatar, Button, Card, SectionTitle } from "@/components/garage/ui";
import { useGarage } from "@/lib/garage-store";


export default function Profile() {
    const { user, logout, clients, vehicles, orders } = useGarage();
    const navigate = useNavigate();

    const resumo = [
        { label: "Clientes", value: clients.length },
        { label: "Veículos", value: vehicles.length },
        { label: "Ordens", value: orders.length },
    ];

    return (
        <AppLayout title="Perfil" subtitle="Conta e configurações">
            <Reveal>
                <Card className="grain p-6 sm:p-8">
                    <div className="relative z-10 flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
                        <Avatar
                            name={user?.nome}
                            className="h-24 w-24 text-3xl"
                        />

                        <div className="min-w-0 flex-1">
                            <p className="stencil text-burnt-red">
                                {user?.cargo ?? "—"}
                            </p>

                            <h2 className="heading mt-1 text-3xl text-bone">
                                {user?.nome ?? "—"}
                            </h2>

                            <p className="mt-1 text-sm text-steel">
                                {user?.email ?? "—"}
                            </p>
                        </div>

                        <Button
                            variant="danger"
                            onClick={() => {
                                logout();
                                navigate("/");
                            }}
                        >
                            Encerrar sessão
                        </Button>
                    </div>
                </Card>
            </Reveal>

            <Reveal delay={0.1} className="mt-6">
                <div className="grid grid-cols-3 gap-4">
                    {resumo.map((r) => (
                        <Card key={r.label} className="p-4 text-center sm:p-5">
                            <p className="heading text-3xl text-bone">
                                {r.value}
                            </p>

                            <p className="stencil mt-1 text-steel">
                                {r.label}
                            </p>
                        </Card>
                    ))}
                </div>
            </Reveal>

            <Reveal delay={0.2} className="mt-10">
                <SectionTitle title="Dados da conta" />

                <Card className="divide-y divide-line/60">
                    <Info label="Nome" value={user?.nome ?? "—"} />
                    <Info label="E-mail" value={user?.email ?? "—"} />
                    <Info label="Cargo" value={user?.cargo ?? "—"} />
                    <Info
                        label="Operação"
                        value={`${clients.length} clientes · ${vehicles.length} veículos · ${orders.length} ordens`}
                    />
                </Card>
            </Reveal>

            <Reveal delay={0.3} className="mt-10">
                <SectionTitle title="A oficina" />

                <Card className="p-6">
                    <Brand />

                    <p className="mt-5 max-w-2xl text-sm text-steel">
                        Custom · Repair · Performance · Detailing. Oficina old school
                        desde 1998, especialista em muscle cars, hot rods e projetos
                        de motor.
                    </p>

                    <p className="heading mt-6 text-xl text-burnt-red">
                        Keep it hot.
                    </p>
                </Card>
            </Reveal>
        </AppLayout>
    );
}

function Info({ label, value }) {
    return (
        <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="stencil text-steel">{label}</p>
            <p className="text-bone">{value}</p>
        </div>
    );
}
