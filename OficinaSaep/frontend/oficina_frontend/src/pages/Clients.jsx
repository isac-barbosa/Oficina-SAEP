import { useMemo, useState } from "react";
import { Eye, Pen as Pencil, Plus, Search, Trash2 } from "reicon-react";

import { AppLayout } from "@/components/garage/layout";
import { Reveal } from "@/components/garage/motion";
import { ConfirmDialog, Modal } from "@/components/garage/overlay";
import {
    Button,
    Card,
    Cell,
    EmptyState,
    Input,
    Row,
    SectionTitle,
    Table,
} from "@/components/garage/ui";
import { maskCpf } from "@/lib/garage-data";
import { useGarage } from "@/lib/garage-store";


const empty = {
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    endereco: "",
};

export default function Clients() {
    const { clients, vehicles, saveClient, removeClient } = useGarage();

    const [busca, setBusca] = useState("");
    const [form, setForm] = useState(null);
    const [detalhe, setDetalhe] = useState(null);
    const [excluir, setExcluir] = useState(null);

    const lista = useMemo(() => {
        const q = busca.trim().toLowerCase();

        if (!q) return clients;

        return clients.filter((c) =>
            [c.nome, c.email, c.telefone].some((f) =>
                f.toLowerCase().includes(q)
            )
        );
    }, [clients, busca]);

    const submit = (e) => {
        e.preventDefault();

        if (!form || !form.nome.trim()) return;

        saveClient(form);
        setForm(null);
    };

    return (
        <AppLayout
            title="Clientes"
            subtitle={`${clients.length} cadastrados`}
            actions={
                <Button onClick={() => setForm({ ...empty })}>
                    <Plus className="h-4 w-4" />
                    Novo cliente
                </Button>
            }
        >
            <Reveal>
                <Card className="mb-6 flex items-center gap-3 px-4 py-3">
                    <Search className="h-4 w-4 text-steel" />

                    <input
                        aria-label="Pesquisar clientes"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Pesquisar por nome, e-mail ou telefone"
                        className="w-full bg-transparent text-sm text-bone placeholder:text-steel/70 focus:outline-none"
                    />
                </Card>

                <SectionTitle
                    title="Lista de clientes"
                    hint={`${lista.length} resultado(s)`}
                />

                {lista.length === 0 ? (
                    <EmptyState
                        title="Nenhum cliente encontrado"
                        description="Ajuste a busca ou cadastre um novo cliente."
                    />
                ) : (
                    <Table head={["Nome", "CPF", "Telefone", "E-mail", "Veículos", ""]}>
                        {lista.map((c) => (
                            <Row key={c.id}>
                                <Cell className="font-medium">{c.nome}</Cell>

                                <Cell className="font-mono text-xs text-steel">
                                    {maskCpf(c.cpf)}
                                </Cell>

                                <Cell className="text-bone/80">{c.telefone}</Cell>

                                <Cell className="text-bone/80">{c.email}</Cell>

                                <Cell className="text-bone/80">
                                    {vehicles.filter((v) => v.clientId === c.id).length}
                                </Cell>

                                <Cell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label="Ver detalhes"
                                            onClick={() => setDetalhe(c)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label="Editar"
                                            onClick={() => setForm(c)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label="Excluir"
                                            onClick={() => setExcluir(c)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </Cell>
                            </Row>
                        ))}
                    </Table>
                )}
            </Reveal>

            <Modal
                open={!!form}
                title={form?.id ? "Editar cliente" : "Novo cliente"}
                onClose={() => setForm(null)}
                footer={
                    <>
                        <Button variant="outline" onClick={() => setForm(null)}>
                            Cancelar
                        </Button>

                        <Button form="client-form" type="submit">
                            Salvar
                        </Button>
                    </>
                }
            >
                {form ? (
                    <form
                        id="client-form"
                        onSubmit={submit}
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                    >
                        <Input
                            id="nome"
                            label="Nome"
                            value={form.nome}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    nome: e.target.value,
                                })
                            }
                            required
                        />

                        <Input
                            id="cpf"
                            label="CPF"
                            value={form.cpf}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    cpf: e.target.value,
                                })
                            }
                            placeholder="apenas números"
                        />

                        <Input
                            id="telefone"
                            label="Telefone"
                            value={form.telefone}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    telefone: e.target.value,
                                })
                            }
                        />

                        <Input
                            id="email"
                            label="E-mail"
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    email: e.target.value,
                                })
                            }
                        />

                        <div className="sm:col-span-2">
                            <Input
                                id="endereco"
                                label="Endereço"
                                value={form.endereco}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        endereco: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </form>
                ) : null}
            </Modal>

            <Modal
                open={!!detalhe}
                title={detalhe?.nome ?? ""}
                onClose={() => setDetalhe(null)}
            >
                {detalhe ? (
                    <div className="space-y-3 text-sm">
                        <Field label="CPF" value={maskCpf(detalhe.cpf)} />
                        <Field label="Telefone" value={detalhe.telefone} />
                        <Field label="E-mail" value={detalhe.email} />
                        <Field label="Endereço" value={detalhe.endereco} />

                        <Field
                            label="Veículos"
                            value={
                                vehicles
                                    .filter((v) => v.clientId === detalhe.id)
                                    .map((v) => `${v.modelo} (${v.placa})`)
                                    .join(", ") || "Nenhum veículo cadastrado"
                            }
                        />
                    </div>
                ) : null}
            </Modal>

            <ConfirmDialog
                open={!!excluir}
                message={`Excluir ${excluir?.nome}? Os veículos e ordens vinculados também serão removidos.`}
                onCancel={() => setExcluir(null)}
                onConfirm={() => {
                    if (excluir) {
                        removeClient(excluir.id);
                    }

                    setExcluir(null);
                }}
            />
        </AppLayout>
    );
}

function Field({ label, value }) {
    return (
        <div className="border-b border-line/60 pb-2">
            <p className="stencil text-steel">{label}</p>
            <p className="mt-1 text-bone">{value}</p>
        </div>
    );
}
