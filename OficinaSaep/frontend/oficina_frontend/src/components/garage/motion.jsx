
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const reduced = () => {
    return (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
};

/**
 * Fade + pequeno translateY na entrada,
 * com delay para criar efeito stagger.
 */
export function Reveal({
    children,
    delay = 0,
    className,
}) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;

        if (!el) return;

        if (reduced()) {
            el.style.opacity = "1";
            el.style.transform = "none";
            return;
        }

        const animation = el.animate(
            [
                { opacity: 0, transform: "translateY(14px)" },
                { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 500, delay: delay * 1000, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "both" },
        );

        return () => animation.cancel();
    }, [delay]);

    return (
        <div
            ref={ref}
            className={cn("opacity-0", className)}
        >
            {children}
        </div>
    );
}

/**
 * Número animado com efeito de contagem.
 */
export function CountUp({
    value,
    className,
}) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (reduced()) {
            setDisplay(value);
            return;
        }

        let frame = 0;

        const start = performance.now();
        const duration = 900;

        const tick = (now) => {
            const t = Math.min(
                1,
                (now - start) / duration
            );

            const eased = 1 - Math.pow(1 - t, 3);

            setDisplay(
                Math.round(value * eased)
            );

            if (t < 1) {
                frame = requestAnimationFrame(tick);
            }
        };

        frame = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frame);
        };
    }, [value]);

    return (
        <span className={className}>
            {String(display).padStart(2, "0")}
        </span>
    );
}

/**
 * Loader inspirado em pistões.
 */
export function GarageLoader({
    label = "Aquecendo o motor",
}) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-16">

            {/* Pistões */}
            <div className="flex h-10 items-end gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                    <span
                        key={i}
                        className="w-2 origin-bottom animate-[piston_0.7s_ease-in-out_infinite] bg-burnt-red"
                        style={{
                            height: "100%",
                            animationDelay: `${i * 0.1}s`,
                        }}
                    />
                ))}
            </div>

            {/* Texto */}
            <p className="stencil text-steel">
                {label}
            </p>

            {/* Animação dos pistões */}
            <style>{`
        @keyframes piston {
          0%, 100% {
            transform: scaleY(0.35);
          }

          50% {
            transform: scaleY(1);
          }
        }
      `}</style>
        </div>
    );
}

