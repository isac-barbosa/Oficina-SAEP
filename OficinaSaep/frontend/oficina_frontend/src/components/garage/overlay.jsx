import { useEffect } from "react";
import { X } from "reicon-react";
import { Button } from "./ui";

export function Modal({
    open,
    title,
    onClose,
    children,
    footer,
}) {
    useEffect(() => {
        if (!open) return;

        const onKey = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", onKey);

        return () => {
            window.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/80 p-4 py-10 backdrop-blur-[2px]"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onMouseDown={(e) =>
                e.target === e.currentTarget && onClose()
            }
        >
            <div className="grain w-full max-w-xl animate-in fade-in slide-in-from-bottom-2 rounded-sm border border-line bg-panel duration-200">
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                    <h3 className="heading text-lg text-bone">
                        {title}
                    </h3>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="relative z-10 space-y-4 px-5 py-5">
                    {children}
                </div>

                {footer ? (
                    <div className="flex justify-end gap-2 border-t border-line px-5 py-4">
                        {footer}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export function ConfirmDialog({
    open,
    title = "Confirmar exclusão",
    message,
    onCancel,
    onConfirm,
}) {
    return (
        <Modal
            open={open}
            title={title}
            onClose={onCancel}
            footer={
                <>
                    <Button variant="outline" onClick={onCancel}>
                        Cancelar
                    </Button>

                    <Button variant="primary" onClick={onConfirm}>
                        Excluir
                    </Button>
                </>
            }
        >
            <p className="text-sm text-bone/80">
                {message}
            </p>
        </Modal>
    );
}