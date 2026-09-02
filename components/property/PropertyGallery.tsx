"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { IconCamera, IconChevronLeft, IconChevronRight, IconClose } from "@/components/icons";

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

export function PropertyGallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const next = useCallback(
    () => setLightbox((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length],
  );
  const prev = useCallback(
    () => setLightbox((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, close, next, prev]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-[var(--radius-lg)] bg-surface-sunken text-sm text-ink-subtle">
        Für dieses Objekt liegen noch keine Bilder vor.
      </div>
    );
  }

  const [cover, ...rest] = images;
  const thumbs = rest.slice(0, 4);

  return (
    <>
      <div className="grid gap-2.5 sm:grid-cols-[2fr_1fr] sm:gap-3 sm:[grid-template-rows:auto]">
        <button
          type="button"
          onClick={() => setLightbox(0)}
          className="group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-surface-sunken sm:aspect-[16/11]"
          aria-label="Bildergalerie öffnen"
        >
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover transition-transform duration-700 [transition-timing-function:var(--ease-out-quint)] group-hover:scale-[1.03]"
          />
          <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-primary-950/75 px-3.5 py-2 text-[0.8125rem] font-medium text-white backdrop-blur-sm">
            <IconCamera size={16} />
            {images.length} Bilder ansehen
          </span>
        </button>

        {thumbs.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-1 sm:grid-rows-2 sm:gap-3">
            {thumbs.slice(0, 2).map((image, i) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setLightbox(i + 1)}
                className="group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] bg-surface-sunken sm:aspect-auto sm:h-full sm:min-h-0"
                aria-label={`Bild ${i + 2} öffnen`}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                {i === 1 && images.length > 3 ? (
                  <span className="absolute inset-0 flex items-center justify-center bg-primary-950/55 text-[0.9375rem] font-medium text-white backdrop-blur-[1px]">
                    +{images.length - 3} weitere
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {lightbox !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Bildergalerie: ${title}`}
          className="fixed inset-0 z-200 flex flex-col bg-primary-950/96 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between px-5 py-4 text-white/75">
            <span className="text-[0.875rem] tabular-nums">
              {lightbox + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Galerie schließen"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white/10 hover:text-white"
            >
              <IconClose size={19} />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-4 pb-4">
            <Image
              key={images[lightbox].id}
              src={images[lightbox].url}
              alt={images[lightbox].alt}
              width={1600}
              height={1067}
              sizes="100vw"
              className="max-h-full w-auto max-w-full rounded-[var(--radius-md)] object-contain"
            />
            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Vorheriges Bild"
                  className="absolute left-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:left-8"
                >
                  <IconChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Nächstes Bild"
                  className="absolute right-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:right-8"
                >
                  <IconChevronRight size={22} />
                </button>
              </>
            ) : null}
          </div>

          <div className="hide-scrollbar flex gap-2 overflow-x-auto px-5 pb-6">
            {images.map((image, i) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setLightbox(i)}
                aria-label={`Bild ${i + 1}`}
                className={cn(
                  "relative h-16 w-24 shrink-0 overflow-hidden rounded-[var(--radius-sm)] transition-all",
                  i === lightbox ? "ring-2 ring-accent-400" : "opacity-50 hover:opacity-90",
                )}
              >
                <Image src={image.url} alt="" fill sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
