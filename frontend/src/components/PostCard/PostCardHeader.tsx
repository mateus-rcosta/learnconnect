// src/components/PostCard/PostCardHeader.tsx
import React from "react";
import Image from "next/image";
import clsx from "clsx";
import { Avatar } from "@/components/Avatar";
import { StatusChip } from "@/components/StatusChip";

// logo depois dos imports (ou dentro do componente, se preferir)
const CATEGORY_ICON: Record<string, string> = {
  Cibersegurança: "/images/segurancatag.png",
  Dados:          "/images/dadostag.png",
  Programação:    "/images/programacaotag.png",
  Design:         "/images/designtag.png",
};


export interface PostCardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  flag: boolean; // true = Verificado, false = Em Análise
  category: string;
  title: string;
  authorAvatar?: string | null;
  authorUsername: string;
  createdAt: string | Date;
  thumbnailUrl?: string | null;
}

export const PostCardHeader = React.forwardRef<
  HTMLDivElement,
  PostCardHeaderProps
>(
  (
    {
      flag,
      category,
      title,
      authorAvatar,
      authorUsername,
      createdAt,
      thumbnailUrl,
      className,
      ...rest
    },
    ref,
  ) => {
    const statusText = flag ? "Revisado/Verificado" : "Em Análise";
    const statusIcon = flag
      ? "/images/verificadotag.png"
      : "/images/emanalisetag.png";

    return (
      <div
        ref={ref}
        className={clsx("flex justify-between gap-4", className)}
        {...rest}
      >
        {/* Lado esquerdo */}
        <div className="flex-1">
          {/* TAGS ================================================= */} 
          <div className="flex items-center mb-2 gap-4 flex-wrap"> 
            {/* Status chip (stroke) */} 
            <StatusChip status={flag ? "verified" : "analysis"} /> 
 
            {/* Categoria */} 
                        <div className="inline-flex items-center gap-1 border border-[#5c64f4] rounded-full px-3 py-[5px] text-xs"> 
              <Image 
                src={CATEGORY_ICON[category] ?? "/images/segurancatag.png"} 
                alt={category} 
                width={14} 
                height={14} 
              /> 
              {category} 
            </div>
          </div>

          {/* Título */}
          <h3 className="text-lg font-bold text-[#bfbfbf] mb-1">{title}</h3>

          {/* Autor / data */}
          <p className="text-sm text-gray-400 flex items-center gap-1">
            <Avatar.Root src={authorAvatar || undefined} size="xs" />
            @{authorUsername} •{" "}
            {new Date(createdAt).toLocaleDateString("pt-BR")}
          </p>
        </div>

        {/* Thumbnail (se houver) */}
        {thumbnailUrl && (
          <Image
            src={thumbnailUrl}
            alt="Thumbnail"
            width={96}
            height={96}
            className="w-24 h-24 object-cover rounded"
          />
        )}
      </div>
    );
  },
);

PostCardHeader.displayName = "PostCardHeader";
