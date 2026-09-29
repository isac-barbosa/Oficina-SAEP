import { useMemo, useState } from "react";
import { Pen as Pencil, Plus, Search, Trash2 } from "reicon-react";
import { AppLayout } from "@/components/garage/layout";
import { Reveal } from "@/components/garage/motion";
import { ConfirmDialog, Modal } from "@/components/garage/overlay";
import {
    Button,
    Card,
    EmptyState,
    Input,
    SectionTitle,
    Select,
} from "@/components/garage/ui";
import { useGarage } from "@/lib/garage-store";


const empty = {
    clientId: "",
    placa: "",
    marca: "",
    modelo: "",
    ano: "",
};

export default function Vehicles() {
    const { vehicles, clients, orders, saveVehicle, removeVehicle } = useGarage();

    const [busca, setBusca] = useState("");
    const [form, setForm] = useState(null);
    const [excluir, setExcluir] = useState(null);

    const lista = useMemo(() => {
        const q = busca.trim().toLowerCase();

        if (!q) return vehicles;

        return vehicles.filter((v) =>
            [v.placa, v.marca, v.modelo].some((f) =>
                f.toLowerCase().includes(q)
            )
        );
    }, [vehicles, busca]);

    const submit = (e) => {
        e.preventDefault();

        if (!form || !form.clientId || !form.modelo.trim()) return;

        saveVehicle(form);
        setForm(null);
    };

    return (
        <AppLayout
            title="Veículos"
            subtitle={`${vehicles.length} na frota`}
            actions={
                <Button
                    onClick={() =>
                        setForm({
                            ...empty,
                            clientId: clients[0]?.id ?? "",
                        })
                    }
                >
                    <Plus className="h-4 w-4" />
                    Novo veículo
                </Button>
            }
        >
            <Reveal>
                <Card className="mb-6 flex items-center gap-3 px-4 py-3">
                    <Search className="h-4 w-4 text-steel" />

                    <input
                        aria-label="Pesquisar veículos"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Pesquisar por placa, marca ou modelo"
                        className="w-full bg-transparent text-sm text-bone placeholder:text-steel/70 focus:outline-none"
                    />
                </Card>

                <SectionTitle
                    title="Frota"
                    hint={`${lista.length} resultado(s)`}
                />

                {lista.length === 0 ? (
                    <EmptyState
                        title="Nenhum veículo encontrado"
                        description="Cadastre um veículo e vincule a um cliente."
                    />
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {lista.map((v, i) => {
                            const client = clients.find((c) => c.id === v.clientId);
                            const total = orders.filter(
                                (o) => o.vehicleId === v.id
                            ).length;

                            return (
                                <Reveal key={v.id} delay={i * 0.05}>
                                    <Card interactive className="grain h-full p-5">
                                        <div className="relative z-10">
                                            <p className="heading text-xl text-bone">
                                                {v.modelo}
                                            </p>

                                            <p className="stencil text-burnt-red">
                                                {v.marca} · {v.ano}
                                            </p>

                                            <div className="mt-4 inline-flex items-center rounded-sm border border-line bg-ink px-3 py-1 font-mono text-sm tracking-[0.2em] text-bone">
                                                {v.placa}
                                            </div>

                                            <p className="mt-4 text-sm text-steel">
                                                Cliente:{" "}
                                                <span className="text-bone/90">
                                                    {client?.nome ?? "—"}
                                                </span>
                                            </p>

                                            <p className="text-sm text-steel">
                                                Ordens:{" "}
                                                <span className="text-bone/90">
                                                    {total}
                                                </span>
                                            </p>

                                            <div className="mt-5 flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setForm(v)}
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                    Editar
                                                </Button>

                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => setExcluir(v)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Excluir
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </Reveal>
                            );
                        })}
                    </div>
                )}
            </Reveal>

            <Modal
                open={!!form}
                title={form?.id ? "Editar veículo" : "Novo veículo"}
                onClose={() => setForm(null)}
                footer={
                    <>
                        <Button
                            variant="outline"
                            onClick={() => setForm(null)}
                        >
                            Cancelar
                        </Button>

                        <Button form="vehicle-form" type="submit">
                            Salvar
                        </Button>
                    </>
                }
            >
                {form ? (
                    <form
                        id="vehicle-form"
                        onSubmit={submit}
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                    >
                        <div className="sm:col-span-2">
                            <Select
                                id="cliente"
                                label="Cliente"
                                value={form.clientId}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        clientId: e.target.value,
                                    })
                                }
                                required
                            >
                                <option value="">Selecione um cliente</option>

                                {clients.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nome}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <Input
                            id="placa"
                            label="Placa"
                            value={form.placa}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    placa: e.target.value.toUpperCase(),
                                })
                            }
                        />

                        <Input
                            id="marca"
                            label="Marca"
                            value={form.marca}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    marca: e.target.value,
                                })
                            }
                        />

                        <Input
                            id="modelo"
                            label="Modelo"
                            value={form.modelo}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    modelo: e.target.value,
                                })
                            }
                            required
                        />

                        <Input
                            id="ano"
                            label="Ano"
                            value={form.ano}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    ano: e.target.value,
                                })
                            }
                        />
                    </form>
                ) : null}
            </Modal>

            <ConfirmDialog
                open={!!excluir}
                message={`Excluir ${excluir?.modelo} (${excluir?.placa})? As ordens vinculadas também serão removidas.`}
                onCancel={() => setExcluir(null)}
                onConfirm={() => {
                    if (excluir) {
                        removeVehicle(excluir.id);
                    }

                    setExcluir(null);
                }}
            />
        </AppLayout>
    );
}
