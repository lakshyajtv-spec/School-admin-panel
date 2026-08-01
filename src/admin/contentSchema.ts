/**
 * Admin schema — describes every editable field in the content tree.
 * Paths are dot-notation into the `en` / `hi` content objects.
 */

export type ScalarKind = "text" | "textarea" | "number";

export type Field =
  | { kind: "scalar"; path: string; label: string; type?: ScalarKind }
  | { kind: "stringList"; path: string; label: string }
  | {
      kind: "list";
      path: string;
      label: string;
      itemLabel: string;
      empty: () => Record<string, unknown>;
      fields: Field[];
    };

export interface Group {
  id: string;
  title: string;
  icon: string;
  /** "lang" groups are edited per language; "single" (images) once */
  mode: "lang" | "single";
  fields: Field[];
}

const emptyItem = (v: Record<string, unknown>) => () => v;

export const GROUPS: Group[] = [
  {
    id: "general",
    title: "General",
    icon: "school",
    mode: "lang",
    fields: [
      { kind: "scalar", path: "meta.schoolName", label: "School Name" },
      { kind: "scalar", path: "meta.schoolNameCaps", label: "School Name (Caps / Short)" },
      { kind: "scalar", path: "meta.schoolPlace", label: "Place (Cantt, Guna)" },
      { kind: "scalar", path: "meta.efaFull", label: "EFA Full Name" },
      { kind: "scalar", path: "hero.badge", label: "Hero Top Badge" },
    ],
  },
  {
    id: "hero",
    title: "Hero Section",
    icon: "home",
    mode: "lang",
    fields: [
      { kind: "scalar", path: "hero.titleA", label: "Title (Part 1)" },
      { kind: "scalar", path: "hero.titleHighlight", label: "Title (Highlight)" },
      { kind: "scalar", path: "hero.titleB", label: "Title (Part 2)" },
      { kind: "scalar", path: "hero.subtitle", label: "Subtitle", type: "textarea" },
      { kind: "scalar", path: "hero.exploreBtn", label: "Explore Button Text" },
      { kind: "scalar", path: "hero.cardTitle", label: "Image Card Title" },
      { kind: "scalar", path: "hero.cardSub", label: "Image Card Subtitle" },
      { kind: "scalar", path: "hero.floatA", label: "Floating Card 1 Label" },
      { kind: "scalar", path: "hero.floatB", label: "Floating Card 2 Label" },
      { kind: "stringList", path: "hero.badges", label: "Badges (below buttons)" },
      { kind: "stringList", path: "hero.marquee", label: "Scrolling Marquee Items" },
    ],
  },
  {
    id: "about",
    title: "About Section",
    icon: "info",
    mode: "lang",
    fields: [
      { kind: "scalar", path: "about.eyebrow", label: "Eyebrow Label" },
      { kind: "scalar", path: "about.title", label: "Heading (Part 1)" },
      { kind: "scalar", path: "about.highlight", label: "Heading (Highlight)" },
      { kind: "scalar", path: "about.desc", label: "Section Description", type: "textarea" },
      { kind: "scalar", path: "about.missionTag", label: "Mission Tag" },
      { kind: "scalar", path: "about.missionHeading", label: "Mission Heading", type: "textarea" },
      { kind: "scalar", path: "about.p1", label: "Paragraph 1", type: "textarea" },
      { kind: "scalar", path: "about.p2", label: "Paragraph 2", type: "textarea" },
      { kind: "scalar", path: "about.imgCaptionTitle", label: "Image Caption Title" },
      { kind: "scalar", path: "about.imgCaptionSub", label: "Image Caption Subtitle" },
      { kind: "stringList", path: "about.points", label: "Mission Points (bullet list)" },
      {
        kind: "list",
        path: "about.stats",
        label: "Statistics Cards",
        itemLabel: "Statistic",
        empty: emptyItem({ value: 0, suffix: "+", label: "", hint: "" }),
        fields: [
          { kind: "scalar", path: "value", label: "Number", type: "number" },
          { kind: "scalar", path: "suffix", label: "Suffix (+, %, etc.)" },
          { kind: "scalar", path: "label", label: "Label" },
          { kind: "scalar", path: "hint", label: "Hint / Sub-label" },
        ],
      },
    ],
  },
  {
    id: "highlights",
    title: "Highlights",
    icon: "star",
    mode: "lang",
    fields: [
      { kind: "scalar", path: "highlights.eyebrow", label: "Eyebrow Label" },
      { kind: "scalar", path: "highlights.title", label: "Heading (Part 1)" },
      { kind: "scalar", path: "highlights.highlight", label: "Heading (Highlight)" },
      { kind: "scalar", path: "highlights.desc", label: "Section Description", type: "textarea" },
      {
        kind: "list",
        path: "highlights.items",
        label: "Highlight Cards",
        itemLabel: "Card",
        empty: emptyItem({ title: "", desc: "" }),
        fields: [
          { kind: "scalar", path: "title", label: "Title" },
          { kind: "scalar", path: "desc", label: "Description", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: "facilities",
    title: "Facilities",
    icon: "building",
    mode: "lang",
    fields: [
      { kind: "scalar", path: "facilities.eyebrow", label: "Eyebrow Label" },
      { kind: "scalar", path: "facilities.title", label: "Heading (Part 1)" },
      { kind: "scalar", path: "facilities.highlight", label: "Heading (Highlight)" },
      { kind: "scalar", path: "facilities.desc", label: "Section Description", type: "textarea" },
      {
        kind: "list",
        path: "facilities.items",
        label: "Facility Cards",
        itemLabel: "Facility",
        empty: emptyItem({ title: "", desc: "", meta: "" }),
        fields: [
          { kind: "scalar", path: "title", label: "Title" },
          { kind: "scalar", path: "desc", label: "Description", type: "textarea" },
          { kind: "scalar", path: "meta", label: "Meta Badge (short)" },
        ],
      },
    ],
  },
  {
    id: "principal",
    title: "Principal's Message",
    icon: "user",
    mode: "lang",
    fields: [
      { kind: "scalar", path: "principal.eyebrow", label: "Eyebrow Label" },
      { kind: "scalar", path: "principal.quoteA", label: "Quote (Part 1)" },
      { kind: "scalar", path: "principal.quoteB", label: "Quote (Part 2)" },
      { kind: "scalar", path: "principal.p1", label: "Paragraph 1", type: "textarea" },
      { kind: "scalar", path: "principal.p2", label: "Paragraph 2", type: "textarea" },
      { kind: "scalar", path: "principal.name", label: "Principal Name / Title" },
      { kind: "scalar", path: "principal.designation", label: "Designation Line" },
      { kind: "scalar", path: "principal.note", label: "Note (photo update)" },
    ],
  },
  {
    id: "teachers",
    title: "Teachers",
    icon: "users",
    mode: "lang",
    fields: [
      { kind: "scalar", path: "teachers.eyebrow", label: "Eyebrow Label" },
      { kind: "scalar", path: "teachers.title", label: "Heading (Part 1)" },
      { kind: "scalar", path: "teachers.highlight", label: "Heading (Highlight)" },
      { kind: "scalar", path: "teachers.desc", label: "Section Description", type: "textarea" },
      { kind: "scalar", path: "teachers.note", label: "Note (names update)" },
      { kind: "scalar", path: "teachers.facultyLabel", label: "Faculty Label" },
      {
        kind: "list",
        path: "teachers.list",
        label: "Teacher Cards",
        itemLabel: "Teacher",
        empty: emptyItem({ subject: "", designation: "" }),
        fields: [
          { kind: "scalar", path: "subject", label: "Subject" },
          { kind: "scalar", path: "designation", label: "Designation" },
        ],
      },
    ],
  },
  {
    id: "vocational",
    title: "Vocational Education",
    icon: "wrench",
    mode: "lang",
    fields: [
      { kind: "scalar", path: "vocational.eyebrow", label: "Eyebrow Label" },
      { kind: "scalar", path: "vocational.title", label: "Heading (Part 1)" },
      { kind: "scalar", path: "vocational.highlight", label: "Heading (Highlight)" },
      { kind: "scalar", path: "vocational.desc", label: "Section Description", type: "textarea" },
      { kind: "scalar", path: "vocational.startInfo", label: "Starts-from-Class-9 Banner", type: "textarea" },
      { kind: "scalar", path: "vocational.levelTitle", label: "Levels Heading" },
      {
        kind: "list",
        path: "vocational.levels",
        label: "Curriculum Levels (9–10 / 11–12)",
        itemLabel: "Level",
        empty: emptyItem({ range: "", name: "", desc: "", points: [] }),
        fields: [
          { kind: "scalar", path: "range", label: "Class Range (e.g. Class 9–10)" },
          { kind: "scalar", path: "name", label: "Level Name" },
          { kind: "scalar", path: "desc", label: "Description", type: "textarea" },
          { kind: "stringList", path: "points", label: "Key Points" },
        ],
      },
      {
        kind: "list",
        path: "vocational.subjects",
        label: "Vocational Subjects (Trades)",
        itemLabel: "Trade",
        empty: emptyItem({ name: "", tagline: "", intro: "", objectives: [], skills: [], careers: [] }),
        fields: [
          { kind: "scalar", path: "name", label: "Trade Name" },
          { kind: "scalar", path: "tagline", label: "Tagline" },
          { kind: "scalar", path: "intro", label: "Introduction", type: "textarea" },
          { kind: "stringList", path: "objectives", label: "Objectives" },
          { kind: "stringList", path: "skills", label: "Skills Students Learn" },
          { kind: "stringList", path: "careers", label: "Career Opportunities" },
        ],
      },
      { kind: "scalar", path: "vocational.importanceTitle", label: "Importance Title" },
      { kind: "scalar", path: "vocational.importanceDesc", label: "Importance Description", type: "textarea" },
      {
        kind: "list",
        path: "vocational.importancePoints",
        label: "Importance Cards",
        itemLabel: "Point",
        empty: emptyItem({ title: "", desc: "" }),
        fields: [
          { kind: "scalar", path: "title", label: "Title" },
          { kind: "scalar", path: "desc", label: "Description", type: "textarea" },
        ],
      },
      { kind: "scalar", path: "vocational.teachersTitle", label: "Vocational Teachers Heading" },
      { kind: "scalar", path: "vocational.teachersDesc", label: "Vocational Teachers Description", type: "textarea" },
      {
        kind: "list",
        path: "vocational.teachers",
        label: "Vocational Teacher Cards",
        itemLabel: "Teacher",
        empty: emptyItem({ role: "", subject: "", designation: "", note: "" }),
        fields: [
          { kind: "scalar", path: "role", label: "Role (e.g. IT/ITES Teacher)" },
          { kind: "scalar", path: "subject", label: "Subject" },
          { kind: "scalar", path: "designation", label: "Designation" },
          { kind: "scalar", path: "note", label: "Note" },
        ],
      },
    ],
  },
  {
    id: "gallery",
    title: "Gallery",
    icon: "images",
    mode: "lang",
    fields: [
      { kind: "scalar", path: "gallery.eyebrow", label: "Eyebrow Label" },
      { kind: "scalar", path: "gallery.title", label: "Heading (Part 1)" },
      { kind: "scalar", path: "gallery.highlight", label: "Heading (Highlight)" },
      { kind: "scalar", path: "gallery.desc", label: "Section Description", type: "textarea" },
      { kind: "scalar", path: "gallery.note", label: "Footnote (e.g. Representative images)" },
      {
        kind: "list",
        path: "gallery.items",
        label: "Gallery Captions",
        itemLabel: "Item",
        empty: emptyItem({ title: "", caption: "" }),
        fields: [
          { kind: "scalar", path: "title", label: "Title" },
          { kind: "scalar", path: "caption", label: "Caption", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: "achievements",
    title: "Activities & Achievements",
    icon: "trophy",
    mode: "lang",
    fields: [
      { kind: "scalar", path: "achievements.eyebrow", label: "Eyebrow Label" },
      { kind: "scalar", path: "achievements.title", label: "Heading (Part 1)" },
      { kind: "scalar", path: "achievements.highlight", label: "Heading (Highlight)" },
      { kind: "scalar", path: "achievements.desc", label: "Section Description", type: "textarea" },
      {
        kind: "list",
        path: "achievements.items",
        label: "Timeline Items",
        itemLabel: "Item",
        empty: emptyItem({ period: "", tag: "", title: "", body: "" }),
        fields: [
          { kind: "scalar", path: "period", label: "Period (e.g. Annual)" },
          { kind: "scalar", path: "tag", label: "Tag (e.g. Sports)" },
          { kind: "scalar", path: "title", label: "Title" },
          { kind: "scalar", path: "body", label: "Description", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: "notices",
    title: "Notice Board",
    icon: "bell",
    mode: "lang",
    fields: [
      { kind: "scalar", path: "notices.eyebrow", label: "Eyebrow Label" },
      { kind: "scalar", path: "notices.title", label: "Heading (Part 1)" },
      { kind: "scalar", path: "notices.highlight", label: "Heading (Highlight)" },
      { kind: "scalar", path: "notices.desc", label: "Section Description", type: "textarea" },
      { kind: "scalar", path: "notices.read", label: "'Read' Link Text" },
      {
        kind: "list",
        path: "notices.items",
        label: "Notice Cards",
        itemLabel: "Notice",
        empty: emptyItem({ tag: "", date: "", title: "", body: "" }),
        fields: [
          { kind: "scalar", path: "tag", label: "Tag (e.g. Latest Notice)" },
          { kind: "scalar", path: "date", label: "Date / Session" },
          { kind: "scalar", path: "title", label: "Title" },
          { kind: "scalar", path: "body", label: "Body", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: "footer",
    title: "Footer",
    icon: "file",
    mode: "lang",
    fields: [
      { kind: "scalar", path: "footer.about", label: "About Text", type: "textarea" },
      { kind: "scalar", path: "footer.devCredit", label: "Developer Credit" },
      { kind: "stringList", path: "footer.resourceItems", label: "Information Links" },
    ],
  },
  {
    id: "images",
    title: "Images",
    icon: "palette",
    mode: "single",
    fields: [
      { kind: "scalar", path: "hero", label: "Hero Background" },
      { kind: "scalar", path: "heroCard", label: "Hero Illustration Card" },
      { kind: "scalar", path: "aboutA", label: "About Main Image" },
      { kind: "scalar", path: "aboutB", label: "About Floating Image" },
      { kind: "stringList", path: "gallery", label: "Gallery Images (8)" },
    ],
  },
];

export const DEFAULT_GROUP = GROUPS[0].id;
