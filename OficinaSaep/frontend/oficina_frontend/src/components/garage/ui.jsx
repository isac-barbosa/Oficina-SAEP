import { Search } from "reicon-react";

import { cn } from "@/lib/utils";
import { STATUS_LABEL, getInitials } from "@/lib/garage-data";

/* ---------------------------------- Button --------------------------------- */

const BUTTON_VARIANTS = {
    primary: "bg-burnt-red text-bone-bright hover:bg-burnt-red/85 border border-burnt-red shadow-[0_8px_22px_-10px_var(--color-burnt-red)]",
    outline: "border border-line text-bone hover:border-burnt-red hover:text-bone-bright bg-transparent",
    ghost: "text-steel hover:text-bone hover:bg-panel-2 bg-transparent",
    danger: "border border-burnt-red/60 text-burnt-red hover:bg-burnt-red hover:text-bone-bright",
    steel: "bg-panel-2 text-bone border border-line hover:border-steel",
};
const BUTTON_SIZES = { sm: "h-8 px-3.5", md: "h-10 px-5", icon: "h-9 w-9 p-0" };
const buttonVariants = ({ variant = "primary", size = "md" }) => cn(
    "inline-flex items-center justify-center gap-2 rounded-full text-xs font-semibold uppercase tracking-[0.1em] transition-[transform,background-color,border-color,color] duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
    BUTTON_VARIANTS[variant] ?? BUTTON_VARIANTS.primary,
    BUTTON_SIZES[size] ?? BUTTON_SIZES.md,
);

export function Button({
    className,
    variant,
    size,
    ...props
}) {
    return (
        <button
            className={cn(
                buttonVariants({ variant, size }),
                className
            )}
            {...props}
        />
    );
}

/* ---------------------------------- Fields --------------------------------- */

const fieldBase =
    "w-full rounded-xl border border-line bg-ink/70 px-3.5 py-2.5 text-sm text-bone placeholder:text-steel/70 transition-colors focus:border-burnt-red focus:outline-none focus:ring-2 focus:ring-burnt-red/25";

function Label({ children, htmlFor }) {
    return (
        <label
            htmlFor={htmlFor}
            className="stencil block text-steel"
        >
            {children}
        </label>
    );
}

export function Input({
    label,
    id,
    className,
    ...props
}) {
    return (
        <div className="space-y-1.5">
            {label ? (
                <Label htmlFor={id}>{label}</Label>
            ) : null}

            <input
                id={id}
                className={cn(fieldBase, className)}
                {...props}
            />
        </div>
    );
}

export function Textarea({
    label,
    id,
    className,
    ...props
}) {
    return (
        <div className="space-y-1.5">
            {label ? (
                <Label htmlFor={id}>{label}</Label>
            ) : null}

            <textarea
                id={id}
                rows={3}
                className={cn(
                    fieldBase,
                    "resize-none",
                    className
                )}
                {...props}
            />
        </div>
    );
}

export function Select({
    label,
    id,
    className,
    children,
    ...props
}) {
    return (
        <div className="space-y-1.5">
            {label ? (
                <Label htmlFor={id}>{label}</Label>
            ) : null}

            <div className="relative">
                <select
                    id={id}
                    className={cn(
                        fieldBase,
                        "appearance-none pr-10",
                        className
                    )}
                    {...props}
                >
                    {children}
                </select>

                <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel"
                >
                    <path d="M5 8l5 5 5-5" />
                </svg>
            </div>
        </div>
    );
}

export function SearchBar({
    value,
    onChange,
    placeholder,
    label,
    className,
}) {
    return (
        <label
            className={cn(
                "flex items-center gap-3 rounded-full border border-line bg-panel/80 px-4 py-2.5 transition-colors focus-within:border-burnt-red focus-within:ring-2 focus-within:ring-burnt-red/25",
                className
            )}
        >
            <Search className="h-4 w-4 shrink-0 text-steel" />

            <input
                aria-label={label}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent text-sm text-bone placeholder:text-steel/70 focus:outline-none"
            />
        </label>
    );
}

/* ----------------------------------- Card ---------------------------------- */

export function Card({
    className,
    children,
    interactive,
}) {
    return (
        <div
            className={cn(
                "relative rounded-2xl border border-line bg-panel/80",
                interactive &&
                "transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-burnt-red/70",
                className
            )}
        >
            {children}
        </div>
    );
}

export function SectionTitle({
    title,
    hint,
}) {
    return (
        <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <span className="h-5 w-1 rounded-full bg-burnt-red" />

                <h2 className="heading text-lg text-bone">
                    {title}
                </h2>
            </div>

            {hint ? (
                <span className="stencil text-steel">
                    {hint}
                </span>
            ) : null}
        </div>
    );
}

export function Avatar({ name, className }) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                "heading flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-burnt-red/50 bg-burnt-red/10 text-sm text-burnt-red",
                className
            )}
        >
            {getInitials(name)}
        </span>
    );
}

/* ---------------------------------- Badge ---------------------------------- */

export function StatusBadge({ status }) {
    const styles = {
        PENDENTE:
            "border-burnt-red/60 text-burnt-red bg-burnt-red/10",

        "EM ANDAMENTO":
            "border-bone/40 text-bone bg-bone/5",

        CONCLUIDO:
            "border-go/50 text-go bg-go/10",

        CANCELADO:
            "border-steel/40 text-steel bg-steel/10",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]",
                styles[status]
            )}
        >
            {STATUS_LABEL[status]}
        </span>
    );
}

/* ---------------------------------- Table ---------------------------------- */

export function Table({
    head,
    children,
}) {
    return (
        <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-155 border-collapse text-sm">
                <thead>
                    <tr className="border-b border-line bg-ink/60">
                        {head.map((h) => (
                            <th
                                key={h}
                                className="stencil px-4 py-3 text-left text-steel"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {children}
                </tbody>
            </table>
        </div>
    );
}

export function Row({ children }) {
    return (
        <tr className="group border-b border-line/60 transition-colors last:border-0 hover:bg-panel-2/70">
            {children}
        </tr>
    );
}

export function Cell({
    children,
    className,
}) {
    return (
        <td
            className={cn(
                "px-4 py-3 text-bone/90",
                className
            )}
        >
            {children}
        </td>
    );
}

/* -------------------------------- EmptyState ------------------------------- */

export function EmptyState({
    title,
    description,
}) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line px-6 py-14 text-center">
            <p className="heading text-lg text-bone/80">
                {title}
            </p>

            {description ? (
                <p className="max-w-sm text-sm text-steel">
                    {description}
                </p>
            ) : null}
        </div>
    );
}
