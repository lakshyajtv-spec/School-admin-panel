import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { GALLERY_MEDIA } from "@/data/site";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/utils/cn";

export default function CampusGallery() {
  const { t, cms } = useLanguage();
  const [index, setIndex] = useState<number | null>(null);
  const count = GALLERY_MEDIA.length;

  /** Gallery image URLs from CMS — admin editable */
  const gallerySrc = (i: number) => cms.gallery[i]?.image_url ?? "";

  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % count)),
    [count],
  );
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + count) % count)),
    [count],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, next, prev]);

  const activeText = index === null ? null : t.gallery.items[index];

  return (
    <section
      id="campus"
      className="relative section-pad overflow-hidden bg-royal-950"
    >
      {/* Secondary anchor for Gallery nav */}
      <div id="gallery" className="absolute top-0 left-0 h-0 w-0 pointer-events-none" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-[0.08]" />
      <div className="pointer-events-none absolute -top-32 right-0 h-[26rem] w-[26rem] rounded-full bg-royal-600/30 blur-[130px]" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-[24rem] w-[24rem] rounded-full bg-gold-500/15 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <SectionHeading
          light
          eyebrow={t.gallery.eyebrow}
          title={t.gallery.title}
          highlight={t.gallery.highlight}
          description={t.gallery.desc}
        />

        <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[190px] sm:gap-4 md:auto-rows-[200px] md:grid-cols-4">
          {GALLERY_MEDIA.map((media, i) => {
            const text = t.gallery.items[i];
            return (
              <Reveal
                key={text.title}
                delay={(i % 4) * 0.06}
                className={cn("h-full", media.span)}
              >
                <button
                  onClick={() => setIndex(i)}
                  aria-label={text.title}
                  className="group relative h-full w-full overflow-hidden rounded-[1.25rem] border border-white/10 text-left sm:rounded-[1.6rem]"
                >
                  <img
                    src={gallerySrc(i)}
                    alt={text.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.12]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-950/90 via-royal-950/25 to-transparent opacity-85 transition-opacity duration-500 group-hover:opacity-95" />
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5">
                    <p className="font-heading text-sm font-semibold text-white sm:text-base">
                      {text.title}
                    </p>
                    <p className="mt-1 hidden max-h-0 overflow-hidden font-body text-xs text-royal-100/80 opacity-0 transition-all duration-500 group-hover:max-h-16 group-hover:opacity-100 sm:block">
                      {text.caption}
                    </p>
                  </div>
                  <div className="absolute top-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:top-4 sm:right-4 sm:h-10 sm:w-10">
                    <Expand className="h-4 w-4" />
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-6 text-center font-body text-xs text-royal-100/50">
          {t.gallery.note}
        </p>
      </div>

      <AnimatePresence>
        {activeText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={activeText.title}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-royal-950/85 p-4 backdrop-blur-xl sm:p-8"
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous"
              className="absolute left-2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 sm:left-8 sm:h-12 sm:w-12"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next"
              className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 sm:right-8 sm:h-12 sm:w-12"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <motion.figure
              key={activeText.title}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/5 sm:rounded-[1.75rem]"
            >
              <img
                src={gallerySrc(index ?? 0)}
                alt={activeText.title}
                className="max-h-[62vh] w-full object-cover"
              />
              <figcaption className="p-5 sm:p-6">
                <p className="font-display text-lg text-white sm:text-xl">
                  {activeText.title}
                </p>
                <p className="mt-1 font-body text-sm text-royal-100/75">
                  {activeText.caption}
                </p>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
