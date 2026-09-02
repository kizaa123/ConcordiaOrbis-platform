"use client";

import { ImageLoader } from "@/components/LoadingPrimitives";
import { Icon } from "@/components/icons";
import { assetUrl } from "@/lib/assetUrl";

type PublicationCoverImageProps = {
  coverImage?: string | null;
  title?: string;
  className?: string;
};

export function PublicationCoverImage({
  coverImage,
  title,
  className = "",
}: PublicationCoverImageProps) {
  const src = coverImage ? assetUrl(coverImage) : null;

  return (
    <div
      className={`relative aspect-[16/9] w-full overflow-hidden bg-brand-50 ${className}`}
    >
      {src ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover blur-xl"
          />
          <ImageLoader
            src={src}
            alt={title ? `${title} cover` : "Publication cover"}
            className="relative z-10 h-full w-full"
            containerClassName="relative z-10 h-full w-full overflow-hidden bg-transparent"
            objectFit="contain"
          />
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Icon name="book" className="h-8 w-8 text-brand-200" />
        </div>
      )}
    </div>
  );
}
