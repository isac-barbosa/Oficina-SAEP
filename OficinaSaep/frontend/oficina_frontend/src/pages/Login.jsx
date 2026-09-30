import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { EmberCanvas } from "@/components/garage/EmberCanvas";
import { BrandMark } from "@/components/garage/BrandMark";
import { Button, Input } from "@/components/garage/ui";
import { Reveal } from "@/components/garage/motion";
import { useAuth } from "@/lib/garage-store";


export default function Login() {
    const { user, ready, login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("admin@oficina.com");
    const [senha, setSenha] = useState("12345678");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (ready && user) {
            navigate("/dashboard");
        }
    }, [ready, user, navigate]);

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!email.includes("@") || senha.length < 4) {
            setErro(
                "Informe um e-mail válido e uma senha com pelo menos 4 caracteres."
            );
            return;
        }

        setErro("");
        setLoading(true);

        try {
            await login(email, senha);
            navigate("/dashboard");
        } catch (error) {
            const apiMessage = error.response?.data?.message;
            setErro(
                apiMessage ??
                    (error.code === "ERR_NETWORK"
                        ? "Nao foi possivel conectar a API. Confira se o backend esta rodando na porta 3000."
                        : "Nao foi possivel entrar. Tente novamente em instantes."),
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid min-h-screen grid-cols-1 bg-garage-black lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            {/* Coluna do formulário */}
            <div className="flex items-center justify-center px-6 py-12 sm:px-12">
                <Reveal className="w-full max-w-sm">
                    <div className="flex items-center gap-3">
                        <BrandMark className="h-11 w-11" />

                        <div className="leading-none">
                            <p className="heading text-base text-bone">
                                Vértice Auto
                            </p>

                            <p className="heading mt-1 text-[0.62rem] tracking-[0.3em] text-burnt-red">
                                Center
                            </p>
                        </div>
                    </div>

                    <p className="stencil mt-12 text-burnt-red">
                        Acesso restrito
                    </p>

                    <h1 className="heading mt-2 text-4xl text-bone">
                        Entrar no sistema
                    </h1>

                    <p className="mt-3 text-sm text-steel">
                        Use suas credenciais para acompanhar clientes, veículos e ordens de serviço.
                    </p>

                    <form onSubmit={onSubmit} className="mt-8 space-y-4">
                        <Input
                            id="email"
                            label="E-mail"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="voce@verticeauto.com"
                        />

                        <Input
                            id="senha"
                            label="Senha"
                            type="password"
                            autoComplete="current-password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="••••••••"
                        />

                        {erro ? (
                            <p
                                role="alert"
                                className="rounded-xl border border-burnt-red/40 bg-burnt-red/10 px-3 py-2 text-xs text-burnt-red"
                            >
                                {erro}
                            </p>
                        ) : null}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Ligando o motor..." : "Entrar"}
                        </Button>
                    </form>

                    <p className="stencil mt-10 text-steel/70">
                        Vértice Auto Center · Sempre em movimento.
                    </p>
                </Reveal>
            </div>

            {/* Coluna da marca */}
            <div className="login-glow relative hidden overflow-hidden border-l border-line bg-ink lg:block">
                <EmberCanvas className="pointer-events-none absolute inset-0 h-full w-full opacity-70" />

                <div className="relative z-10 flex h-full flex-col items-center justify-center px-12 text-center">
                    <BrandMark className="h-52 w-52 drop-shadow-[0_18px_40px_rgba(0,0,0,0.6)]" />

                    <h2 className="heading mt-8 text-6xl text-bone">
                        Vértice Auto
                    </h2>

                    <p className="heading text-2xl tracking-[0.35em] text-burnt-red">
                        Center
                    </p>

                    <div className="hatch my-8 h-0.75 w-24 rounded-full opacity-70" />

                    <p className="stencil text-steel">
                        Diagnóstico · Manutenção · Revisão · Performance
                    </p>
                </div>
            </div>
        </div>
    );
}
