import { useNavigate } from "react-router-dom";
import { AppLayout, Brand } from "@/components/garage/layout";
import { Reveal } from "@/components/garage/motion";
import { Button, Card, SectionTitle } from "@/components/garage/ui";
import { useGarage } from "@/lib/garage-store";


export default function Profile() {
    const { user, logout, clients, vehicles, orders } = useGarage();
    const navigate = useNavigate();

    return (
        <AppLayout title="Perfil" subtitle="Conta e configurações">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Reveal className="lg:col-span-2">
                    <SectionTitle title="Dados da conta" />
                    <Card className="grain p-6">
                        <div className="relative z-10 space-y-4">
                            <Info label="Nome" value={user?.nome ?? "—"} />
                            <Info label="E-mail" value={user?.email ?? "—"} />
                            <Info label="Cargo" value={user?.cargo ?? "—"} />
                            <Info
                                label="Operação"
                                value={`${clients.length} clientes · ${vehicles.length} veículos · ${orders.length} ordens`}
                            />

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

                <Reveal delay={0.12}>
                    <SectionTitle title="A oficina" />
                    <Card className="grain p-6">
                        <div className="relative z-10">
                            <Brand />

                            <p className="mt-5 text-sm text-steel">
                                Custom · Repair · Performance · Detailing. Oficina old school
                                desde 1998, especialista em muscle cars, hot rods e projetos
                                de motor.
                            </p>

                            <p className="heading mt-6 text-xl text-burnt-red">
                                Keep it hot.
                            </p>
                        </div>
                    </Card>
                </Reveal>
            </div>
        </AppLayout>
    );
}

function Info({ label, value }) {
    return (
        <div className="border-b border-line/60 pb-3">
            <p className="stencil text-steel">{label}</p>
            <p className="mt-1 text-bone">{value}</p>
        </div>
    );
}