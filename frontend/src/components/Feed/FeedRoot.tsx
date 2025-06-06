// src/components/Feed/FeedRoot.tsx
import React from "react";
import clsx from "clsx";

/* ---------- tipos de refs ------------------------------------------------ */
export type FeedRef     = React.RefObject<HTMLDivElement>;
export type SentinelRef = React.RefObject<HTMLDivElement>;

export interface FeedRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Ref do contêiner que rola (usada como root do observer) */
  feedRef?: FeedRef;
  /** Ref do “sentinela” lá embaixo (alvo do observer) */
  sentinelRef?: SentinelRef;
}

/* ---------- componente --------------------------------------------------- */
export const FeedRoot: React.FC<FeedRootProps> = ({
  feedRef,
  sentinelRef,             // 👈 agora realmente recebido
  className,
  children,
  ...rest
}) => (
  <main
    ref={feedRef}
    className={clsx(
      "flex-1 h-full overflow-y-auto px-4 py-6 space-y-6",
      "scrollbar-thin scrollbar-thumb-[#5c64f4]/40",
      className,
    )}
    {...rest}
  >
    {children}

    {/* div sentinela observada pelo IntersectionObserver */}
    <div ref={sentinelRef} className="h-px w-full" />
  </main>
);

FeedRoot.displayName = "FeedRoot";
