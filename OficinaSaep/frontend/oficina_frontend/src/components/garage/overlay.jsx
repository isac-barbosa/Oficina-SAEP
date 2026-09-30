import { useEffect } from "react";
import { Trash2, X } from "reicon-react";
import { Button } from "./ui";

/** Fecha com ESC e trava a rolagem da página enquanto o painel está aberto. */
function useOverlay(open, onClose) {
    useEffect(() => {
        if (!open) return;

        const onKey = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        const previousOverflow = document.body.style.overflow;

        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = previousOverflow;
        };
    }, [open, onClose]);
}

/** Painel lateral (drawer) que desliza da direita. */
export function Modal({
    open,
    title,
    onClose,
    children,
    footer,
}) {
    useOverlay(open, onClose);

    if (!open) return null;

    return (
        <div
            className="anim-fade fixed inset-0 z-50 flex justify-end bg-garage-black/70 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onMouseDown={(e) =>
                e.target === e.currentTarget && onClose()
            }
        >
            <aside className="anim-drawer flex h-full w-full max-w-lg flex-col border-l border-line bg-panel shadow-2xl">
                <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-5">
                    <div className="min-w-0">
                        <p className="stencil text-burnt-red">
                            Vértice Auto Center
                        </p>

                        <h3 className="heading mt-1 truncate text-xl text-bone">
                            {title}
                        </h3>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
                    {children}
                </div>

                {footer ? (
                    <div className="flex justify-end gap-2 border-t border-line bg-ink/40 px-6 py-4">
                        {footer}
                    </div>
                ) : null}
            </aside>
        </div>
    );
}

/** Diálogo de confirmação centralizado. */
export function ConfirmDialog({
    open,
    title = "Confirmar exclusão",
    message,
    onCancel,
    onConfirm,
}) {
    useOverlay(open, onCancel);

    if (!open) return null;

    return (
        <div
            className="anim-fade fixed inset-0 z-50 flex items-center justify-center bg-garage-black/70 p-4 backdrop-blur-sm"
            role="alertdialog"
            aria-modal="true"
            aria-label={title}
            onMouseDown={(e) =>
                e.target === e.currentTarget && onCancel()
            }
        >
            <div className="anim-pop w-full max-w-sm rounded-2xl border border-line bg-panel p-6 text-center shadow-2xl">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-burnt-red/50 bg-burnt-red/10 text-burnt-red">
                    <Trash2 className="h-5 w-5" />
                </span>

                <h3 className="heading mt-4 text-lg text-bone">
                    {title}
                </h3>

                <p className="mt-2 text-sm text-steel">
                    {message}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={onCancel}>
                        Cancelar
                    </Button>

                    <Button variant="primary" onClick={onConfirm}>
                        Excluir
                    </Button>
                </div>
            </div>
        </div>
    );
}
