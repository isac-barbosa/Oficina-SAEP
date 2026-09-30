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
    SectionTitle,
    Select,
    StatusBadge,
    Textarea,
} from "@/components/garage/ui";
import {
    STATUS_LABEL,
    dateParts,
    formatCurrency,
    formatDate,
} from "@/lib/garage-data";
import { useGarage } from "@/lib/garage-store";


const STATUSES = [
    "PENDENTE",
    "EM ANDAMENTO",
    "CONCLUIDO",
    "CANCELADO",
];

const empty = {
    data: new Date().toISOString().slice(0, 10),
    clientId: "",
    vehicleId: "",
    servico: "",
    descricao: "",
    valor: 0,
    status: "PENDENTE",
};

export default function Orders() {
    const {
        orders,
        clients,
        vehicles,
        saveOrder,
        removeOrder,
    } = useGarage();

    const [filtro, setFiltro] = useState("TODOS");
    const [form, setForm] = useState(null);
    const [excluir, setExcluir] = useState(null);

    const lista = useMemo(() => {
        const base = [...orders].sort((a, b) =>
            a.data.localeCompare(b.data)
        );

        return filtro === "TODOS"
            ? base
            : base.filter((o) => o.status === filtro);
    }, [orders, filtro]);

    const veiculosDoCliente = form
        ? vehicles.filter((v) => v.clientId === form.clientId)
        : [];

    const submit = (e) => {
        e.preventDefault();

        if (
            !form ||
            !form.clientId ||
            !form.vehicleId ||
            !form.servico.trim()
        ) {
            return;
        }

        saveOrder(form);
        setForm(null);
    };

    return (
        <AppLayout
            title="Ordens de Serviço"
            subtitle={`${orders.length} ordens registradas`}
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
                    Nova ordem
                </Button>
            }
        >
            <Reveal>
                <div className="mb-6 flex flex-wrap gap-2">
                    {["TODOS", ...STATUSES].map((s) => (
                        <Button
                            key={s}
                            size="sm"
                            variant={filtro === s ? "primary" : "outline"}
                            onClick={() => setFiltro(s)}
                        >
                            {s === "TODOS" ? "Todas" : STATUS_LABEL[s]}
                        </Button>
                    ))}
                </div>

                <SectionTitle
                    title="Agenda de serviços"
                    hint="ordenado por data de agendamento"
                />

                {lista.length === 0 ? (
                    <EmptyState
                        title="Nenhuma ordem nesse filtro"
                        description="Crie uma nova ordem de serviço."
                    />
                ) : (
                    <ul className="space-y-3">
                        {lista.map((o) => {
                            const client = clients.find(
                                (c) => c.id === o.clientId
                            );

                            const vehicle = vehicles.find(
                                (v) => v.id === o.vehicleId
                            );

                            const { day, month } = dateParts(o.data);

                            return (
                                <li key={o.id}>
                                    <Card interactive className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
                                        <div
                                            className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-line bg-ink"
                                            title={formatDate(o.data)}
                                        >
                                            <span className="heading text-xl text-bone">
                                                {day}
                                            </span>

                                            <span className="stencil text-[0.62rem] text-burnt-red">
                                                {month}
                                            </span>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-bone">
                                                {o.servico}
                                            </p>

                                            {o.descricao ? (
                                                <p className="mt-0.5 text-xs text-steel">
                                                    {o.descricao}
                                                </p>
                                            ) : null}

                                            <p className="mt-2 text-xs text-bone/70">
                                                {client?.nome ?? "—"}
                                                {" · "}
                                                {vehicle
                                                    ? `${vehicle.modelo} · ${vehicle.placa}`
                                                    : "—"}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center sm:gap-2">
                                            <span className="heading text-lg text-bone">
                                                {formatCurrency(o.valor)}
                                            </span>

                                            <StatusBadge status={o.status} />
                                        </div>

                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                aria-label="Editar"
                                                onClick={() => setForm(o)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                aria-label="Excluir"
                                                onClick={() => setExcluir(o)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </Card>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </Reveal>

            <Modal
                open={!!form}
                title={
                    form?.id
                        ? "Editar ordem"
                        : "Nova ordem de serviço"
                }
                onClose={() => setForm(null)}
                footer={
                    <>
                        <Button
                            variant="outline"
                            onClick={() => setForm(null)}
                        >
                            Cancelar
                        </Button>

                        <Button
                            form="order-form"
                            type="submit"
                        >
                            Salvar
                        </Button>
                    </>
                }
            >
                {form ? (
                    <form
                        id="order-form"
                        onSubmit={submit}
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                    >
                        <Input
                            id="data"
                            label="Data do agendamento"
                            type="date"
                            value={form.data}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    data: e.target.value,
                                })
                            }
                        />

                        <Select
                            id="status"
                            label="Status"
                            value={form.status}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    status: e.target.value,
                                })
                            }
                        >
                            {STATUSES.map((s) => (
                                <option key={s} value={s}>
                                    {STATUS_LABEL[s]}
                                </option>
                            ))}
                        </Select>

                        <Select
                            id="cliente"
                            label="Cliente"
                            value={form.clientId}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    clientId: e.target.value,
                                    vehicleId: "",
                                })
                            }
                            required
                        >
                            <option value="">Selecione</option>

                            {clients.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.nome}
                                </option>
                            ))}
                        </Select>

                        <Select
                            id="veiculo"
                            label="Veículo"
                            value={form.vehicleId}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    vehicleId: e.target.value,
                                })
                            }
                            required
                        >
                            <option value="">Selecione</option>

                            {veiculosDoCliente.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.modelo} — {v.placa}
                                </option>
                            ))}
                        </Select>

                        <Input
                            id="servico"
                            label="Serviço"
                            value={form.servico}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    servico: e.target.value,
                                })
                            }
                            required
                        />

                        <Input
                            id="valor"
                            label="Valor (R$)"
                            type="number"
                            min={0}
                            step="0.01"
                            value={form.valor}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    valor: Number(e.target.value),
                                })
                            }
                        />

                        <div className="sm:col-span-2">
                            <Textarea
                                id="descricao"
                                label="Descrição"
                                value={form.descricao}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        descricao: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </form>
                ) : null}
            </Modal>

            <ConfirmDialog
                open={!!excluir}
                message={`Excluir a ordem "${excluir?.servico}"?`}
                onCancel={() => setExcluir(null)}
                onConfirm={() => {
                    if (excluir) {
                        removeOrder(excluir.id);
                    }

                    setExcluir(null);
                }}
            />
        </AppLayout>
    );
}
