// src/components/Avatar/AvatarRoot.tsx
import React from "react";
import Image from "next/image";
import clsx from "clsx";

/** Tamanhos disponíveis e seus respectivos lados em px  */
const SIZE = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 64,
  xl: 96,
} as const;

export type AvatarSize = keyof typeof SIZE;

export interface AvatarRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** URL do avatar (pode ser nula) */
  src?: string | null;
  /** Texto alternativo da imagem */
  alt?: string;
  /** Tamanho pré-definido */
  size?: AvatarSize;
  /** Fonte usada caso `src` seja vazia ou ocorra erro */
  fallbackSrc?: string;
}

/**
 * Componente raiz do Avatar.
 *
 * Uso:
 * ```tsx
 * <Avatar.Root src={user.avatar_url} size="lg" />
 * ```
 */
export const AvatarRoot = React.forwardRef<HTMLDivElement, AvatarRootProps>(
  (
    {
      src,
      alt = "Avatar",
      size = "md",
      fallbackSrc = "/images/standard_icon.png",
      className,
      ...rest
    },
    ref,
  ) => {
    const dimension = SIZE[size] ?? SIZE.md;
    const [imgSrc, setImgSrc] = React.useState(src || fallbackSrc);

    return (
      <div
        ref={ref}
        className={clsx(
          "inline-block rounded-full overflow-hidden bg-[#2a2a2a]",
          className,
        )}
        style={{ width: dimension, height: dimension }}
        {...rest}
      >
        <Image
          src={imgSrc || fallbackSrc}
          alt={alt}
          width={dimension}
          height={dimension}
          className="object-cover w-full h-full"
          onError={() => setImgSrc(fallbackSrc)}
        />
      </div>
    );
  },
);

AvatarRoot.displayName = "AvatarRoot";
