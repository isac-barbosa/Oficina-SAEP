import { useEffect, useRef } from "react";

/** Campo muito leve de fagulhas douradas para o fundo do login. */
export function EmberCanvas({ className }) {
    const ref = useRef(null);

    useEffect(() => {
        const canvas = ref.current;

        if (!canvas) return;

        if (
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            return;
        }

        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        let raf = 0;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const resize = () => {
            canvas.width = canvas.offsetWidth * dpr;
            canvas.height = canvas.offsetHeight * dpr;
        };

        resize();

        window.addEventListener("resize", resize);

        const embers = Array.from({ length: 48 }, () => ({
            x: Math.random(),
            y: Math.random(),
            r: Math.random() * 1.6 + 0.4,
            s: Math.random() * 0.00035 + 0.00008,
            d: Math.random() * 0.0004 - 0.0002,
            a: Math.random() * 0.5 + 0.15,
        }));

        const draw = () => {
            const { width: w, height: h } = canvas;

            ctx.clearRect(0, 0, w, h);

            for (const e of embers) {
                e.y -= e.s;
                e.x += e.d;

                if (e.y < -0.02) {
                    e.y = 1.02;
                    e.x = Math.random();
                }

                ctx.beginPath();

                ctx.arc(
                    e.x * w,
                    e.y * h,
                    e.r * dpr,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle = `rgba(217, 119, 6, ${e.a})`;

                ctx.fill();
            }

            raf = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={ref}
            aria-hidden="true"
            className={className}
        />
    );
}