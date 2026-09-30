import { useMemo, useState } from "react";
import { Pen as Pencil, Plus, Trash2 } from "reicon-react";
import { AppLayout } from "@/components/garage/layout";
import { Reveal } from "@/components/garage/motion";
import { ConfirmDialog, Modal } from "@/components/garage/overlay";
import {
    Button,
    Card,
    EmptyState,
    Input,
    SearchBar,
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
                <SearchBar
                    className="mb-8 max-w-xl"
                    label="Pesquisar veículos"
                    value={busca}
                    onChange={setBusca}
                    placeholder="Pesquisar por placa, marca ou modelo"
                />

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
                    <ul className="space-y-3">
                        {lista.map((v, i) => {
                            const client = clients.find((c) => c.id === v.clientId);
                            const total = orders.filter(
                                (o) => o.vehicleId === v.id
                            ).length;

                            return (
                                <Reveal as="li" key={v.id} delay={i * 0.04}>
                                    <Card interactive className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
                                        <div className="inline-flex w-fit items-center rounded-lg border-2 border-bone/70 bg-ink px-4 py-2 font-mono text-base tracking-[0.25em] text-bone">
                                            {v.placa}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="heading text-lg text-bone">
                                                {v.modelo}
                                            </p>

                                            <p className="stencil text-burnt-red">
                                                {v.marca} · {v.ano}
                                            </p>
                                        </div>

                                        <div className="text-sm text-steel sm:text-right">
                                            <p>
                                                Cliente:{" "}
                                                <span className="text-bone/90">
                                                    {client?.nome ?? "—"}
                                                </span>
                                            </p>

                                            <p>
                                                Ordens:{" "}
                                                <span className="text-bone/90">
                                                    {total}
                                                </span>
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
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
                                    </Card>
                                </Reveal>
                            );
                        })}
                    </ul>
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
