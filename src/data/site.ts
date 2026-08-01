/**
 * Structural / non-translatable data only.
 * Every user-visible string lives in `src/i18n/content.ts`.
 */

export const NAV_LINKS = [
  { key: "home", href: "#home" },
  { key: "about", href: "#about" },
  { key: "facilities", href: "#facilities" },
  { key: "campus", href: "#campus" },
  { key: "teachers", href: "#teachers" },
  { key: "gallery", href: "#gallery" },
  { key: "vocational", href: "#vocational" },
  { key: "principal", href: "#principal" },
] as const;

export type NavKey = (typeof NAV_LINKS)[number]["key"];

export const IMAGES = {
  hero: "https://images.pexels.com/photos/8926848/pexels-photo-8926848.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600",
  heroCard:
    "https://images.pexels.com/photos/35551059/pexels-photo-35551059.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=760&w=900",
  aboutA:
    "https://images.pexels.com/photos/35550999/pexels-photo-35550999.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=760&w=900",
  aboutB:
    "https://images.pexels.com/photos/2982449/pexels-photo-2982449.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=800",
};

/** Gallery images — captions/titles come from the content dictionary by index. */
export const GALLERY_MEDIA = [
  {
    src: "https://images.pexels.com/photos/2982449/pexels-photo-2982449.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    src: "https://images.pexels.com/photos/35551059/pexels-photo-35551059.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=550&w=800",
    span: "",
  },
  {
    src: "https://images.pexels.com/photos/35550999/pexels-photo-35550999.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=550&w=800",
    span: "",
  },
  {
    src: "https://images.pexels.com/photos/8472004/pexels-photo-8472004.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=550&w=800",
    span: "md:col-span-2",
  },
  {
    src: "https://images.pexels.com/photos/5530438/pexels-photo-5530438.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=550&w=800",
    span: "",
  },
  {
    src: "https://images.pexels.com/photos/8927020/pexels-photo-8927020.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=550&w=800",
    span: "",
  },
  {
    src: "https://images.pexels.com/photos/35551044/pexels-photo-35551044.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=550&w=800",
    span: "",
  },
  {
    src: "https://images.pexels.com/photos/13812360/pexels-photo-13812360.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=550&w=800",
    span: "md:col-span-2",
  },
];
