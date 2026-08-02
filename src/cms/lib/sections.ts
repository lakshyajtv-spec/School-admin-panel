/**
 * Section schema — describes every editable content section of the website.
 * The schema-driven editor renders these definitions for both languages.
 */
import type { LucideIcon } from "lucide-react";
import {
  Award,
  Bell,
  Building2,
  FileText,
  Home,
  Images,
  Info,
  Navigation,
  Settings2,
  Star,
  UserRound,
  UsersRound,
  Wrench,
} from "lucide-react";

export type FieldDef =
  | { type: "text"; path: string; label: string }
  | { type: "textarea"; path: string; label: string }
  | { type: "stringList"; path: string; label: string }
  | {
      type: "objectList";
      path: string;
      label: string;
      itemLabel: string;
      defaults: Record<string, unknown>;
      fields: FieldDef[];
    };

export interface SectionDef {
  key: string;
  label: string;
  icon: LucideIcon;
  description: string;
  fields: FieldDef[];
}

const list = (
  path: string,
  label: string,
  itemLabel: string,
  defaults: Record<string, unknown>,
  fields: FieldDef[],
): FieldDef => ({ type: "objectList", path, label, itemLabel, defaults, fields });

export const SECTIONS: SectionDef[] = [
  {
    key: "meta",
    label: "General / Identity",
    icon: Settings2,
    description: "School name, place and EFA identity (English & Hindi).",
    fields: [
      { type: "text", path: "schoolName", label: "School Name" },
      { type: "text", path: "schoolNameCaps", label: "School Name (Short / Caps)" },
      { type: "text", path: "schoolPlace", label: "Place (Cantt, Guna)" },
      { type: "text", path: "efa", label: "EFA Short Label" },
      { type: "text", path: "efaFull", label: "EFA Full Name" },
    ],
  },
  {
    key: "nav",
    label: "Navigation",
    icon: Navigation,
    description: "Menu labels shown in the navbar.",
    fields: [
      { type: "text", path: "home", label: "Home" },
      { type: "text", path: "about", label: "About" },
      { type: "text", path: "facilities", label: "Facilities" },
      { type: "text", path: "campus", label: "Campus" },
      { type: "text", path: "teachers", label: "Teachers" },
      { type: "text", path: "gallery", label: "Gallery" },
      { type: "text", path: "vocational", label: "Vocational" },
      { type: "text", path: "principal", label: "Principal" },
      { type: "text", path: "menu", label: "Menu (mobile button)" },
    ],
  },
  {
    key: "hero",
    label: "Home / Hero",
    icon: Home,
    description: "Hero heading, subtitle, buttons, badges and marquee.",
    fields: [
      { type: "text", path: "badge", label: "Top Badge" },
      { type: "text", path: "titleA", label: "Title (Part 1)" },
      { type: "text", path: "titleHighlight", label: "Title (Highlight)" },
      { type: "text", path: "titleB", label: "Title (Part 2)" },
      { type: "textarea", path: "subtitle", label: "Subtitle" },
      { type: "text", path: "exploreBtn", label: "Explore Button Label" },
      { type: "text", path: "cardTitle", label: "Image Card Title" },
      { type: "text", path: "cardSub", label: "Image Card Subtitle" },
      { type: "text", path: "floatA", label: "Floating Card 1 Label" },
      { type: "text", path: "floatB", label: "Floating Card 2 Label" },
      { type: "stringList", path: "badges", label: "Badges" },
      { type: "stringList", path: "marquee", label: "Marquee Items" },
    ],
  },
  {
    key: "about",
    label: "About School",
    icon: Info,
    description: "Mission, paragraphs, checklist and statistics.",
    fields: [
      { type: "text", path: "eyebrow", label: "Eyebrow Label" },
      { type: "text", path: "title", label: "Heading (Part 1)" },
      { type: "text", path: "highlight", label: "Heading (Highlight)" },
      { type: "textarea", path: "desc", label: "Section Description" },
      { type: "text", path: "missionTag", label: "Mission Tag" },
      { type: "textarea", path: "missionHeading", label: "Mission Heading" },
      { type: "textarea", path: "p1", label: "Paragraph 1" },
      { type: "textarea", path: "p2", label: "Paragraph 2" },
      { type: "text", path: "imgCaptionTitle", label: "Image Caption Title" },
      { type: "text", path: "imgCaptionSub", label: "Image Caption Subtitle" },
      { type: "stringList", path: "points", label: "Mission Points" },
      list("stats", "Statistics Cards", "Statistic", { value: 0, suffix: "+", label: "", hint: "" }, [
        { type: "text", path: "value", label: "Number" },
        { type: "text", path: "suffix", label: "Suffix (+, %)" },
        { type: "text", path: "label", label: "Label" },
        { type: "text", path: "hint", label: "Hint" },
      ]),
    ],
  },
  {
    key: "highlights",
    label: "Highlights",
    icon: Star,
    description: "Highlight feature cards.",
    fields: [
      { type: "text", path: "eyebrow", label: "Eyebrow Label" },
      { type: "text", path: "title", label: "Heading (Part 1)" },
      { type: "text", path: "highlight", label: "Heading (Highlight)" },
      { type: "textarea", path: "desc", label: "Section Description" },
      list("items", "Highlight Cards", "Card", { title: "", desc: "" }, [
        { type: "text", path: "title", label: "Title" },
        { type: "textarea", path: "desc", label: "Description" },
      ]),
    ],
  },
  {
    key: "facilities",
    label: "Facilities",
    icon: Building2,
    description: "Facility cards (title, meta badge, description).",
    fields: [
      { type: "text", path: "eyebrow", label: "Eyebrow Label" },
      { type: "text", path: "title", label: "Heading (Part 1)" },
      { type: "text", path: "highlight", label: "Heading (Highlight)" },
      { type: "textarea", path: "desc", label: "Section Description" },
      list("items", "Facility Cards", "Facility", { title: "", desc: "", meta: "" }, [
        { type: "text", path: "title", label: "Title" },
        { type: "text", path: "meta", label: "Meta Badge" },
        { type: "textarea", path: "desc", label: "Description" },
      ]),
    ],
  },
  {
    key: "principal",
    label: "Principal Message",
    icon: UserRound,
    description: "Quote, message paragraphs, name and designation.",
    fields: [
      { type: "text", path: "eyebrow", label: "Eyebrow Label" },
      { type: "text", path: "quoteA", label: "Quote (Part 1)" },
      { type: "text", path: "quoteB", label: "Quote (Part 2)" },
      { type: "textarea", path: "p1", label: "Paragraph 1" },
      { type: "textarea", path: "p2", label: "Paragraph 2" },
      { type: "text", path: "name", label: "Name / Title" },
      { type: "text", path: "designation", label: "Designation Line" },
      { type: "text", path: "note", label: "Note (photo update)" },
    ],
  },
  {
    key: "teachers",
    label: "Teachers (Headings)",
    icon: UsersRound,
    description: "Section headings for the teachers grid. Teacher cards are managed in the Teachers module.",
    fields: [
      { type: "text", path: "eyebrow", label: "Eyebrow Label" },
      { type: "text", path: "title", label: "Heading (Part 1)" },
      { type: "text", path: "highlight", label: "Heading (Highlight)" },
      { type: "textarea", path: "desc", label: "Section Description" },
      { type: "textarea", path: "note", label: "Note" },
      { type: "text", path: "facultyLabel", label: "Faculty Label" },
    ],
  },
  {
    key: "vocational",
    label: "Vocational Education",
    icon: Wrench,
    description: "Trades, curriculum levels, importance and vocational teachers.",
    fields: [
      { type: "text", path: "eyebrow", label: "Eyebrow Label" },
      { type: "text", path: "title", label: "Heading (Part 1)" },
      { type: "text", path: "highlight", label: "Heading (Highlight)" },
      { type: "textarea", path: "desc", label: "Section Description" },
      { type: "textarea", path: "startInfo", label: "Starts-from-Class-9 Banner" },
      { type: "text", path: "levelTitle", label: "Curriculum Levels Heading" },
      { type: "text", path: "objectivesLabel", label: "Objectives Label" },
      { type: "text", path: "skillsLabel", label: "Skills Label" },
      { type: "text", path: "careersLabel", label: "Careers Label" },
      list("levels", "Curriculum Levels", "Level", { range: "", name: "", desc: "", points: [] }, [
        { type: "text", path: "range", label: "Class Range" },
        { type: "text", path: "name", label: "Level Name" },
        { type: "textarea", path: "desc", label: "Description" },
        { type: "stringList", path: "points", label: "Key Points" },
      ]),
      list("subjects", "Trades", "Trade", { name: "", tagline: "", intro: "", objectives: [], skills: [], careers: [] }, [
        { type: "text", path: "name", label: "Trade Name" },
        { type: "text", path: "tagline", label: "Tagline" },
        { type: "textarea", path: "intro", label: "Introduction" },
        { type: "stringList", path: "objectives", label: "Objectives" },
        { type: "stringList", path: "skills", label: "Skills" },
        { type: "stringList", path: "careers", label: "Careers" },
      ]),
      { type: "text", path: "importanceTitle", label: "Importance Title" },
      { type: "textarea", path: "importanceDesc", label: "Importance Description" },
      list("importancePoints", "Importance Cards", "Point", { title: "", desc: "" }, [
        { type: "text", path: "title", label: "Title" },
        { type: "textarea", path: "desc", label: "Description" },
      ]),
      { type: "text", path: "teachersTitle", label: "Vocational Teachers Heading" },
      { type: "textarea", path: "teachersDesc", label: "Vocational Teachers Description" },
      list("teachers", "Vocational Teachers", "Teacher", { role: "", subject: "", designation: "", note: "" }, [
        { type: "text", path: "role", label: "Role" },
        { type: "text", path: "subject", label: "Subject" },
        { type: "text", path: "designation", label: "Designation" },
        { type: "text", path: "note", label: "Note" },
      ]),
    ],
  },
  {
    key: "achievements",
    label: "Achievements",
    icon: Award,
    description: "Activities & participation timeline.",
    fields: [
      { type: "text", path: "eyebrow", label: "Eyebrow Label" },
      { type: "text", path: "title", label: "Heading (Part 1)" },
      { type: "text", path: "highlight", label: "Heading (Highlight)" },
      { type: "textarea", path: "desc", label: "Section Description" },
      list("items", "Timeline Items", "Item", { period: "", tag: "", title: "", body: "" }, [
        { type: "text", path: "period", label: "Period" },
        { type: "text", path: "tag", label: "Tag" },
        { type: "text", path: "title", label: "Title" },
        { type: "textarea", path: "body", label: "Description" },
      ]),
    ],
  },
  {
    key: "gallery",
    label: "Gallery (Headings)",
    icon: Images,
    description: "Section headings + captions. Images are managed in the Gallery module.",
    fields: [
      { type: "text", path: "eyebrow", label: "Eyebrow Label" },
      { type: "text", path: "title", label: "Heading (Part 1)" },
      { type: "text", path: "highlight", label: "Heading (Highlight)" },
      { type: "textarea", path: "desc", label: "Section Description" },
      { type: "text", path: "note", label: "Footnote" },
    ],
  },
  {
    key: "notices",
    label: "Notice Board (Headings)",
    icon: Bell,
    description: "Section headings. Notice cards are managed in the Notices module.",
    fields: [
      { type: "text", path: "eyebrow", label: "Eyebrow Label" },
      { type: "text", path: "title", label: "Heading (Part 1)" },
      { type: "text", path: "highlight", label: "Heading (Highlight)" },
      { type: "textarea", path: "desc", label: "Section Description" },
      { type: "text", path: "read", label: "'Read' Link Text" },
    ],
  },
  {
    key: "footer",
    label: "Footer",
    icon: FileText,
    description: "Footer about text, links, credits.",
    fields: [
      { type: "textarea", path: "about", label: "About Text" },
      { type: "stringList", path: "resourceItems", label: "Information Links" },
      { type: "text", path: "rights", label: "Rights Text" },
      { type: "text", path: "designed", label: "Designed Label" },
      { type: "text", path: "designedFor", label: "For Label" },
      { type: "text", path: "backToTop", label: "Back to Top Label" },
      { type: "text", path: "devCredit", label: "Developer Credit" },
    ],
  },
];

export const SECTION_BY_KEY = new Map(SECTIONS.map((s) => [s.key, s]));
