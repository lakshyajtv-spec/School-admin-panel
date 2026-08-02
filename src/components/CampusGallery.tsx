import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { GALLERY_MEDIA } from "@/data/site";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/utils/cn";

interface GalleryItem {
  id: string;
  src: string;
  title: string;
  caption: string;
  category: string;
}

export default function CampusGallery() {
  const { t, siteData } = useLanguage();
  const [index, setIndex] = useState<number | null>(null);
  const [cat, setCat] = useState("all");

  // Admin-managed gallery records take priority; fallback to content defaults
  const fallback: GalleryItem[] = siteData.images.gallery.map((src, i) => ({
    id: `fb-${i}`,
    src,
    title: t.gallery.items[i]?.title ?? "",
    caption: t.gallery.items[i]?.caption ?? "",
    category: "",
  }));
  const records: GalleryItem[] =
    siteData.gallery.length > 0 ? siteData.gallery : fallback;

  const categories = Array.from(
    new Set(records.map((g) => g.category).filter(Boolean)),
  );
  const items =
    cat === "all" ? records : records.filter((g) => g.category === cat);
  const count = items.length;

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

  const active = index === null ? null : items[index];

  return (
    <section
      id="campus"
      className="relative section-pad overflow-hidden bg-royal-950"
    >
      {/* Secondary anchor for Gallery nav */}
      <div id="gallery" className="pointer-events-none absolute top-0 left-0 h-0 w-0" aria-hidden="true" />
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

        {/* Category filters (only when admin added categories) */}
        {categories.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {["all", ...categories].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCat(c);
                  setIndex(null);
                }}
                className={cn(
                  "rounded-full px-4 py-1.5 font-heading text-xs font-semibold transition-all duration-300",
                  cat === c
                    ? "bg-gradient-to-r from-gold-400 to-gold-300 text-royal-900 shadow-[0_10px_24px_-12px_rgba(212,175,55,.9)]"
                    : "border border-white/15 bg-white/5 text-royal-100/70 hover:bg-white/10",
                )}
              >
                {c === "all" ? (t.gallery.items.length ? "All" : "All") : c}
              </button>
            ))}
          </div>
        )}

        <div className="mt-10 grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[190px] sm:gap-4 md:auto-rows-[200px] md:grid-cols-4">
          {items.map((item, i) => {
            const span = GALLERY_MEDIA[i % GALLERY_MEDIA.length]?.span ?? "";
            return (
              <Reveal
                key={item.id}
                delay={(i % 4) * 0.06}
                className={cn("h-full", span)}
              >
                <button
                  onClick={() => setIndex(i)}
                  aria-label={item.title}
                  className="group relative h-full w-full overflow-hidden rounded-[1.25rem] border border-white/10 text-left sm:rounded-[1.6rem]"
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.12]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-950/90 via-royal-950/25 to-transparent opacity-85 transition-opacity duration-500 group-hover:opacity-95" />
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5">
                    <p className="font-heading text-sm font-semibold text-white sm:text-base">
                      {item.title}
                    </p>
                    <p className="mt-1 hidden max-h-0 overflow-hidden font-body text-xs text-royal-100/80 opacity-0 transition-all duration-500 group-hover:max-h-16 group-hover:opacity-100 sm:block">
                      {item.caption}
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
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
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
              key={active.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/5 sm:rounded-[1.75rem]"
            >
              <img
                src={active.src}
                alt={active.title}
                className="max-h-[62vh] w-full object-cover"
              />
              <figcaption className="p-5 sm:p-6">
                <p className="font-display text-lg text-white sm:text-xl">
                  {active.title}
                </p>
                <p className="mt-1 font-body text-sm text-royal-100/75">
                  {active.caption}
                </p>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
