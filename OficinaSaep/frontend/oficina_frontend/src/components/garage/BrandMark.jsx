/**
 * Marca da Vértice Auto Center: uma engrenagem estilizada dentro de um
 * badge arredondado. Usa var(--color-*) do tema, então segue qualquer
 * futura troca de paleta automaticamente, sem precisar editar imagem.
 */
export function BrandMark({ className = "h-10 w-10" }) {
    const dentes = [0, 45, 90, 135, 180, 225, 270, 315];

    return (
        <svg
            viewBox="0 0 64 64"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <rect
                x="2"
                y="2"
                width="60"
                height="60"
                rx="16"
                fill="var(--color-panel-2)"
                stroke="var(--color-burnt-red)"
                strokeWidth="2"
            />

            {dentes.map((deg) => (
                <rect
                    key={deg}
                    x="29.5"
                    y="10"
                    width="5"
                    height="9"
                    rx="1.5"
                    fill="var(--color-burnt-red)"
                    transform={`rotate(${deg} 32 32)`}
                />
            ))}

            <circle
                cx="32"
                cy="32"
                r="13"
                fill="none"
                stroke="var(--color-burnt-red)"
                strokeWidth="5"
            />

            <circle cx="32" cy="32" r="4.5" fill="var(--color-burnt-red)" />
        </svg>
    );
}
