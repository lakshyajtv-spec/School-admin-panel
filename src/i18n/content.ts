/**
 * Single source of truth for every visible string on the website.
 * Both locales share the exact same shape (enforced by `Content` type).
 */

export const en = {
  meta: {
    schoolName: "Govt. Boys H. S. School Cantt, Guna",
    schoolNameCaps: "GOVT. BOYS H. S. SCHOOL",
    schoolPlace: "Cantt, Guna",
    efa: "EFA Government School",
    efaFull: "Education For All (EFA) Government School",
  },
  topbar: {
    langLabel: "हिन्दी",
  },
  nav: {
    home: "Home",
    about: "About",
    facilities: "Facilities",
    campus: "Campus",
    teachers: "Teachers",
    gallery: "Gallery",
    vocational: "Vocational",
    principal: "Principal",
    menu: "Menu",
  },
  hero: {
    badge: "Government of Madhya Pradesh · District Guna",
    titleA: "Welcome to",
    titleHighlight: "Govt. Boys H. S. School",
    titleB: "Cantt, Guna",
    subtitle:
      "Empowering students through quality education, discipline and excellence. An Education For All (EFA) government school providing education from Class 1 to 12, with vocational education in IT/ITES and Electronics & Hardware from Class 9 onwards.",
    exploreBtn: "Explore Campus",
    badges: ["EFA Government School", "MPBSE Curriculum", "Class 1 – 12"],
    cardTitle: "Learning that builds skills",
    cardSub: "Academics · Vocational trades · Practical science",
    floatA: "Students",
    floatB: "Vocational Trades",
    marquee: [
      "Government Higher Secondary School · Classes 1 to 12",
      "Vocational Education from Class 9: IT / ITES",
      "Vocational Education from Class 9: Electronics & Hardware",
      "Education For All (EFA) Government School",
      "Library · Computer Lab · Science Labs",
      "Government supported learning",
    ],
  },
  about: {
    eyebrow: "Who We Are",
    title: "About Our",
    highlight: "School",
    desc: "A government higher secondary school in Guna, Madhya Pradesh, working under the Education For All (EFA) initiative to provide accessible, affordable and useful education from Class 1 to Class 12.",
    missionTag: "Our Mission",
    missionHeading:
      "Quality government education from Class 1 to 12, backed by practical skills for every student.",
    p1: "Govt. Boys H. S. School Cantt, Guna is a state government higher secondary school serving students of Guna city and nearby areas from Class 1 to Class 12. As an Education For All (EFA) school, we welcome learners from every background and follow the curriculum prescribed by the M.P. Board of Secondary Education.",
    p2: "From Class 9 onwards, the school runs vocational education in IT / ITES and Electronics & Hardware, so that students acquire job-ready skills alongside their board studies.",
    points: [
      "Government school with free textbooks as per state schemes",
      "Vocational education from Class 9 in IT/ITES and Electronics & Hardware",
      "Guidance for government scholarships and forms",
      "Safe, disciplined and inclusive learning environment",
    ],
    imgCaptionTitle: "Our Campus",
    imgCaptionSub: "Cantt area, Guna (M.P.)",
    stats: [
      { value: 700, suffix: "+", label: "Students", hint: "Class 1 to 12" },
      { value: 25, suffix: "+", label: "Teaching Staff", hint: "Government teachers" },
      { value: 15, suffix: "", label: "Classrooms", hint: "Regular sections" },
      { value: 2, suffix: "", label: "Vocational Trades", hint: "IT/ITES · Electronics" },
    ],
  },
  highlights: {
    eyebrow: "School Highlights",
    title: "What Our School",
    highlight: "Provides",
    desc: "Simple, practical facilities and support that a government school student from Class 1 to 12 actually needs.",
    items: [
      {
        title: "Government Higher Secondary School",
        desc: "State government school following the MPBSE curriculum for Class 1 to 12.",
      },
      {
        title: "Experienced Teaching Staff",
        desc: "Government-appointed teachers with long subject experience.",
      },
      {
        title: "Science Laboratories",
        desc: "Physics, Chemistry and Biology practicals as per board requirements.",
      },
      {
        title: "Computer Lab",
        desc: "Computer systems used for IT practicals and vocational classes.",
      },
      {
        title: "Library",
        desc: "Textbooks, reference books and reading material for students.",
      },
      {
        title: "Vocational Education",
        desc: "IT/ITES and Electronics & Hardware trades from Class 9 under the NSQF scheme.",
      },
      {
        title: "Playground",
        desc: "Open ground for daily assembly, sports and physical activities.",
      },
      {
        title: "Government Supported Learning",
        desc: "Scholarships, free textbooks and EFA benefits as per state rules.",
      },
    ],
  },
  facilities: {
    eyebrow: "Infrastructure",
    title: "Our School",
    highlight: "Facilities",
    desc: "Everyday facilities available on campus for academic, vocational and co-curricular activities.",
    items: [
      {
        title: "Computer Lab",
        desc: "Used for IT/ITES vocational practicals, typing practice and basic computer education.",
        meta: "Vocational Use",
      },
      {
        title: "Physics Lab",
        desc: "Apparatus for board-level practical work in mechanics, optics and electricity.",
        meta: "Senior Wing",
      },
      {
        title: "Chemistry Lab",
        desc: "Reagents, glassware and work benches for prescribed practical experiments.",
        meta: "Practical Work",
      },
      {
        title: "Biology Lab",
        desc: "Microscopes, charts and specimens for senior class biology practicals.",
        meta: "Senior Classes",
      },
      {
        title: "Electronics & Hardware Lab",
        desc: "Tool kits, components and computer hardware for the vocational trade.",
        meta: "Vocational Trade",
      },
      {
        title: "Library",
        desc: "Textbooks, reference books, competitive exam material and a reading space.",
        meta: "Reading Room",
      },
      {
        title: "Drinking Water",
        desc: "Clean drinking water arrangement available for students on campus.",
        meta: "Campus Wide",
      },
      {
        title: "Playground",
        desc: "Open ground used for morning assembly, sports periods and school events.",
        meta: "Sports & Assembly",
      },
    ],
  },
  vocational: {
    eyebrow: "NSQF Skill Education",
    title: "Vocational",
    highlight: "Education",
    desc: "Vocational education starts from Class 9. Students choose a vocational stream alongside their regular academic subjects and receive practical, skill-based training as per their class level.",
    startInfo: "Vocational Education starts from Class 9. Students who select a vocational trade study it along with their regular subjects from Class 9 through Class 12.",
    levelTitle: "Curriculum by Level",
    levels: [
      {
        range: "Class 9–10",
        name: "Foundation Level",
        desc: "At the secondary level, students learn the basics of their chosen vocational trade. The focus is on building fundamental skills, understanding tools and equipment, and gaining hands-on experience through simple projects and exercises.",
        points: [
          "Basic concepts and theory of the trade",
          "Introduction to tools and safety practices",
          "Simple hands-on projects and exercises",
          "Preparation for NSQF Level 3 or 4 assessment",
        ],
      },
      {
        range: "Class 11–12",
        name: "Advanced Level",
        desc: "At the higher secondary level, students study an advanced curriculum with deeper practical training. They learn industry-relevant skills, advanced troubleshooting, and work on real-world projects that prepare them for employment or further technical education.",
        points: [
          "Advanced theory and practical applications",
          "Industry-relevant skill development",
          "Complex projects and real-world troubleshooting",
          "Preparation for NSQF Level 5 assessment and certification",
        ],
      },
    ],
    objectivesLabel: "Objectives",
    skillsLabel: "Skills Students Learn",
    careersLabel: "Career Opportunities",
    subjects: [
      {
        name: "IT / ITES",
        tagline: "Information Technology & IT Enabled Services",
        intro:
          "The IT/ITES trade introduces students to computers, office software and basic web technology. Classes combine theory with regular hands-on practice in the computer lab so that students become comfortable with digital work from Class 9 itself.",
        objectives: [
          "Build confidence in using computers and the internet safely",
          "Develop practical office and documentation skills",
          "Prepare students for NSQF level assessment and certification",
          "Create a base for further study in IT and computer applications",
        ],
        skills: [
          "Computer fundamentals",
          "Word processing & documentation",
          "Spreadsheets & data entry",
          "Presentations",
          "Internet, email & digital safety",
          "Basic web page design (HTML/CSS)",
        ],
        careers: [
          "Data entry operator",
          "Computer operator / office assistant",
          "Customer care executive",
          "IT support assistant",
          "Further study: ITI, polytechnic, BCA and other computer courses",
        ],
      },
      {
        name: "Electronics & Hardware",
        tagline: "Electronics, Computer Hardware & Repair",
        intro:
          "The Electronics & Hardware trade teaches students how electronic components and computer systems actually work. Students learn to identify components, use basic tools safely and carry out simple assembly, installation and repair tasks.",
        objectives: [
          "Understand basic electronics components and circuits",
          "Learn safe handling of tools, wiring and equipment",
          "Practise assembly, installation and fault finding",
          "Prepare students for technician-level skill certification",
        ],
        skills: [
          "Basic electronics & components",
          "Soldering and circuit basics",
          "Computer assembly & peripherals",
          "Installation & troubleshooting",
          "Electrical safety practices",
          "Basic networking & CCTV concepts",
        ],
        careers: [
          "Computer hardware technician",
          "Field technician (computing & peripherals)",
          "Electronics repair assistant",
          "CCTV / installation helper",
          "Further study: ITI and diploma in electronics",
        ],
      },
    ],
    importanceTitle: "Importance of Vocational Education",
    importanceDesc:
      "Vocational subjects give school students a real skill along with their board studies, which is especially valuable in a government school setting.",
    importancePoints: [
      {
        title: "Skill with Study",
        desc: "Students earn a board certificate and a practical, employable skill at the same time.",
      },
      {
        title: "Better Employability",
        desc: "Trade training helps students find entry-level work locally after school.",
      },
      {
        title: "Self-Employment",
        desc: "Repair, data entry and service work can be started with a small setup.",
      },
      {
        title: "Clear Career Path",
        desc: "A strong base for ITI, polytechnic, diploma and further technical study.",
      },
    ],
    teachersTitle: "Vocational Teachers",
    teachersDesc:
      "Vocational trainers take regular theory and practical classes for each trade. Teacher details will be updated by the school office.",
    teachers: [
      {
        role: "IT / ITES Teacher",
        subject: "Information Technology & ITES",
        designation: "Vocational Trainer",
        note: "Name to be updated by school office",
      },
      {
        role: "Electronics & Hardware Teacher",
        subject: "Electronics & Hardware",
        designation: "Vocational Trainer",
        note: "Name to be updated by school office",
      },
    ],
  },
  gallery: {
    eyebrow: "Campus & Gallery",
    title: "A Glimpse of",
    highlight: "Our Campus",
    desc: "Classrooms, laboratories, library and grounds where our students study, practise and grow every day.",
    note: "Representative images",
    items: [
      { title: "School Building", caption: "Academic block of our campus in the Cantt area, Guna." },
      { title: "Classroom", caption: "Regular classroom teaching as per the MPBSE curriculum." },
      { title: "Library", caption: "Textbooks, reference books and reading material for students." },
      { title: "Chemistry Practical", caption: "Board-level practical work carried out in the lab." },
      { title: "Computer Lab", caption: "Used for IT/ITES vocational practicals and typing practice." },
      { title: "Playground", caption: "Ground used for assembly, sports periods and school events." },
      { title: "Biology Lab", caption: "Microscopes, charts and specimens for senior classes." },
      { title: "School Activities", caption: "Sports and co-curricular activities." },
    ],
  },
  principal: {
    eyebrow: "Principal's Message",
    quoteA: "Education is the strongest tool a student can carry",
    quoteB: "from school into life.",
    p1: "Dear students and parents, our school works with a simple aim — that every boy who joins us should leave with knowledge, discipline and a skill he can use. As an Education For All (EFA) government school, we welcome students from every background, from Class 1 to Class 12.",
    p2: "Along with regular studies, our vocational trades in IT/ITES and Electronics & Hardware (starting from Class 9) give students practical training for the world of work. I request all parents to stay in touch with the school and support their child's regular attendance.",
    name: "Principal",
    designation: "Govt. Boys H. S. School Cantt, Guna",
    note: "Name and photograph to be updated by school office",
  },
  teachers: {
    eyebrow: "Our Faculty",
    title: "Our Teaching",
    highlight: "Staff",
    desc: "Government-appointed subject teachers who handle regular classes, practicals and board preparation.",
    note: "Teacher names and photographs will be updated by the school office.",
    facultyLabel: "Subject Faculty",
    list: [
      { subject: "Mathematics", designation: "Subject Teacher" },
      { subject: "Physics", designation: "Subject Teacher" },
      { subject: "Chemistry", designation: "Subject Teacher" },
      { subject: "Biology", designation: "Subject Teacher" },
      { subject: "English", designation: "Subject Teacher" },
      { subject: "Hindi & Sanskrit", designation: "Subject Teacher" },
      { subject: "Social Science", designation: "Subject Teacher" },
      { subject: "Computer / IT", designation: "Vocational Trainer" },
    ],
  },
  achievements: {
    eyebrow: "School Activities",
    title: "Activities &",
    highlight: "Participation",
    desc: "Regular academic and co-curricular activities carried out in the school.",
    items: [
      {
        period: "Every Year",
        tag: "Academics",
        title: "Board Examination Preparation",
        body: "Regular tests, revision classes and extra doubt-clearing sessions for Class 10 and 12 students.",
      },
      {
        period: "Every Year",
        tag: "Vocational",
        title: "Vocational Practical Training",
        body: "Hands-on practical classes and NSQF skill assessment for IT/ITES and Electronics & Hardware students.",
      },
      {
        period: "Annual",
        tag: "Sports",
        title: "Sports Day & District Participation",
        body: "Annual sports meet on the school ground and participation in district level school competitions.",
      },
      {
        period: "Annual",
        tag: "Science",
        title: "Science Exhibition",
        body: "Students prepare working models and charts for the school and district level science exhibition.",
      },
      {
        period: "As Notified",
        tag: "Scholarships",
        title: "Government Scholarship Assistance",
        body: "Help with scholarship forms, documents and online submission as per state government schemes.",
      },
    ],
  },
  notices: {
    eyebrow: "Announcements",
    title: "School",
    highlight: "Notice Board",
    desc: "Latest information about examinations, holidays and school activities.",
    read: "Read",
    items: [
      {
        tag: "Latest Notice",
        date: "Current Session",
        title: "Parent–Teacher Meeting",
        body: "Parents are requested to visit the school as per the notified date to discuss student progress.",
      },
      {
        tag: "Exam Schedule",
        date: "Current Session",
        title: "Half-Yearly & Board Exam Timetable",
        body: "Examination timetables are displayed on the school notice board and shared with class teachers.",
      },
      {
        tag: "Holiday List",
        date: "Current Session",
        title: "Government Holiday Calendar",
        body: "The school follows the holiday calendar issued by the Madhya Pradesh School Education Department.",
      },
      {
        tag: "Vocational",
        date: "Current Session",
        title: "Vocational Trade Selection for Class 9",
        body: "Students entering Class 9 may choose between IT/ITES and Electronics & Hardware as their vocational trade.",
      },
    ],
  },
  footer: {
    about:
      "A government higher secondary school in Guna (M.P.) working under the Education For All (EFA) initiative, providing education from Class 1 to 12 with vocational education in IT/ITES and Electronics & Hardware from Class 9 onwards.",
    quickLinks: "Quick Links",
    resources: "Information",
    resourceItems: [
      "Vocational Education",
      "Examination & Results",
      "Government Scholarships",
      "Transfer Certificate",
      "EFA Information",
    ],
    rights: "All rights reserved.",
    designed: "Designed with",
    designedFor: "for",
    backToTop: "Back to Top",
    devCredit: "Website Designed & Developed by Lakshya Jatav",
  },
} as const;

export type Content = typeof en;

type Writable<T> = T extends readonly (infer U)[]
  ? Writable<U>[]
  : T extends object
    ? { -readonly [K in keyof T]: Writable<T[K]> }
    : T extends string
      ? string
      : T;

export const hi: Writable<Content> = {
  meta: {
    schoolName: "शा. बालक उ. मा. विद्यालय कैंट, गुना",
    schoolNameCaps: "शा. बालक उ. मा. विद्यालय",
    schoolPlace: "कैंट, गुना",
    efa: "ई.एफ.ए. शासकीय विद्यालय",
    efaFull: "सर्व शिक्षा (EFA) शासकीय विद्यालय",
  },
  topbar: {
    langLabel: "English",
  },
  nav: {
    home: "मुख्य पृष्ठ",
    about: "परिचय",
    facilities: "सुविधाएँ",
    campus: "परिसर",
    teachers: "शिक्षकगण",
    gallery: "चित्र दीर्घा",
    vocational: "व्यावसायिक",
    principal: "प्राचार्य",
    menu: "मेन्यू",
  },
  hero: {
    badge: "मध्यप्रदेश शासन · जिला गुना",
    titleA: "आपका स्वागत है",
    titleHighlight: "शा. बालक उ. मा. विद्यालय",
    titleB: "कैंट, गुना",
    subtitle:
      "गुणवत्तापूर्ण शिक्षा, अनुशासन एवं उत्कृष्टता के माध्यम से विद्यार्थियों का सशक्तिकरण। यह एक सर्व शिक्षा (EFA) शासकीय विद्यालय है, जहाँ कक्षा 1 से 12 तक शिक्षा दी जाती है तथा कक्षा 9 से आई.टी./आई.टी.ई.एस. एवं इलेक्ट्रॉनिक्स व हार्डवेयर की व्यावसायिक शिक्षा उपलब्ध है।",
    exploreBtn: "परिसर देखें",
    badges: ["ई.एफ.ए. शासकीय विद्यालय", "एम.पी. बोर्ड पाठ्यक्रम", "कक्षा 1 – 12"],
    cardTitle: "ऐसी शिक्षा जो कौशल भी दे",
    cardSub: "शैक्षणिक विषय · व्यावसायिक ट्रेड · प्रायोगिक विज्ञान",
    floatA: "विद्यार्थी",
    floatB: "व्यावसायिक ट्रेड",
    marquee: [
      "शासकीय उच्चतर माध्यमिक विद्यालय · कक्षा 1 से 12",
      "कक्षा 9 से व्यावसायिक शिक्षा: आई.टी. / आई.टी.ई.एस.",
      "कक्षा 9 से व्यावसायिक शिक्षा: इलेक्ट्रॉनिक्स एवं हार्डवेयर",
      "सर्व शिक्षा (EFA) शासकीय विद्यालय",
      "पुस्तकालय · कंप्यूटर लैब · विज्ञान प्रयोगशालाएँ",
      "शासन द्वारा समर्थित शिक्षा",
    ],
  },
  about: {
    eyebrow: "हमारा परिचय",
    title: "हमारे विद्यालय के",
    highlight: "बारे में",
    desc: "गुना, मध्यप्रदेश में स्थित एक शासकीय उच्चतर माध्यमिक विद्यालय, जो सर्व शिक्षा (EFA) पहल के अंतर्गत कक्षा 1 से कक्षा 12 तक प्रत्येक विद्यार्थी को सुलभ एवं उपयोगी शिक्षा उपलब्ध कराने हेतु कार्यरत है।",
    missionTag: "हमारा उद्देश्य",
    missionHeading:
      "कक्षा 1 से 12 तक गुणवत्तापूर्ण शासकीय शिक्षा, साथ में हर विद्यार्थी के लिए व्यावहारिक कौशल।",
    p1: "शा. बालक उ. मा. विद्यालय कैंट, गुना एक राज्य शासकीय उच्चतर माध्यमिक विद्यालय है, जो गुना शहर एवं आसपास के क्षेत्रों के विद्यार्थियों को कक्षा 1 से कक्षा 12 तक शिक्षा प्रदान करता है। सर्व शिक्षा (EFA) विद्यालय होने के नाते यहाँ प्रत्येक वर्ग के विद्यार्थियों का स्वागत है तथा माध्यमिक शिक्षा मण्डल, म.प्र. द्वारा निर्धारित पाठ्यक्रम का पालन किया जाता है।",
    p2: "कक्षा 9 से विद्यालय में आई.टी./आई.टी.ई.एस. तथा इलेक्ट्रॉनिक्स एवं हार्डवेयर की व्यावसायिक शिक्षा भी संचालित है, जिससे विद्यार्थी बोर्ड की पढ़ाई के साथ रोजगारपरक कौशल भी प्राप्त करते हैं।",
    points: [
      "शासकीय विद्यालय एवं राज्य योजनाओं अनुसार निःशुल्क पाठ्यपुस्तकें",
      "कक्षा 9 से आई.टी./आई.टी.ई.एस. एवं इलेक्ट्रॉनिक्स व हार्डवेयर में व्यावसायिक शिक्षा",
      "शासकीय छात्रवृत्ति एवं आवेदन प्रक्रिया हेतु मार्गदर्शन",
      "सुरक्षित, अनुशासित एवं समावेशी शैक्षणिक वातावरण",
    ],
    imgCaptionTitle: "हमारा परिसर",
    imgCaptionSub: "कैंट क्षेत्र, गुना (म.प्र.)",
    stats: [
      { value: 700, suffix: "+", label: "विद्यार्थी", hint: "कक्षा 1 से 12" },
      { value: 25, suffix: "+", label: "शिक्षक स्टाफ", hint: "शासकीय शिक्षक" },
      { value: 15, suffix: "", label: "कक्षा-कक्ष", hint: "नियमित सेक्शन" },
      { value: 2, suffix: "", label: "व्यावसायिक ट्रेड", hint: "आई.टी.ई.एस. · इलेक्ट्रॉनिक्स" },
    ],
  },
  highlights: {
    eyebrow: "विद्यालय की विशेषताएँ",
    title: "हमारा विद्यालय क्या",
    highlight: "उपलब्ध कराता है",
    desc: "कक्षा 1 से 12 तक के विद्यार्थी के लिए आवश्यक सरल एवं व्यावहारिक सुविधाएँ।",
    items: [
      {
        title: "शासकीय उच्चतर माध्यमिक विद्यालय",
        desc: "कक्षा 1 से 12 तक एम.पी. बोर्ड पाठ्यक्रम पर आधारित राज्य शासकीय विद्यालय।",
      },
      {
        title: "अनुभवी शिक्षक स्टाफ",
        desc: "विषयों में लंबे अनुभव वाले शासन द्वारा नियुक्त शिक्षक।",
      },
      {
        title: "विज्ञान प्रयोगशालाएँ",
        desc: "बोर्ड आवश्यकताओं अनुसार भौतिकी, रसायन एवं जीव विज्ञान के प्रायोगिक कार्य।",
      },
      {
        title: "कंप्यूटर लैब",
        desc: "आई.टी. प्रायोगिक कार्य एवं व्यावसायिक कक्षाओं हेतु कंप्यूटर सिस्टम।",
      },
      {
        title: "पुस्तकालय",
        desc: "विद्यार्थियों हेतु पाठ्यपुस्तकें, संदर्भ पुस्तकें एवं अध्ययन सामग्री।",
      },
      {
        title: "व्यावसायिक शिक्षा",
        desc: "कक्षा 9 से एन.एस.क्यू.एफ. योजना अंतर्गत आई.टी.ई.एस. एवं इलेक्ट्रॉनिक्स ट्रेड।",
      },
      {
        title: "खेल मैदान",
        desc: "दैनिक प्रार्थना सभा, खेल एवं शारीरिक गतिविधियों हेतु खुला मैदान।",
      },
      {
        title: "शासन समर्थित शिक्षा",
        desc: "राज्य नियमों अनुसार छात्रवृत्ति, निःशुल्क पुस्तकें एवं ई.एफ.ए. लाभ।",
      },
    ],
  },
  facilities: {
    eyebrow: "आधारभूत संरचना",
    title: "हमारे विद्यालय की",
    highlight: "सुविधाएँ",
    desc: "शैक्षणिक, व्यावसायिक एवं सह-शैक्षणिक गतिविधियों हेतु परिसर में उपलब्ध दैनिक सुविधाएँ।",
    items: [
      {
        title: "कंप्यूटर लैब",
        desc: "आई.टी.ई.एस. व्यावसायिक प्रायोगिक कार्य, टाइपिंग अभ्यास एवं बुनियादी कंप्यूटर शिक्षा हेतु।",
        meta: "व्यावसायिक उपयोग",
      },
      {
        title: "भौतिकी प्रयोगशाला",
        desc: "यांत्रिकी, प्रकाशिकी एवं विद्युत के बोर्ड स्तरीय प्रायोगिक कार्य हेतु उपकरण।",
        meta: "वरिष्ठ कक्षाएँ",
      },
      {
        title: "रसायन प्रयोगशाला",
        desc: "निर्धारित प्रायोगिक कार्यों हेतु रसायन, काँच उपकरण एवं कार्य टेबल।",
        meta: "प्रायोगिक कार्य",
      },
      {
        title: "जीव विज्ञान प्रयोगशाला",
        desc: "वरिष्ठ कक्षाओं के प्रायोगिक कार्य हेतु सूक्ष्मदर्शी, चार्ट एवं नमूने।",
        meta: "वरिष्ठ कक्षाएँ",
      },
      {
        title: "इलेक्ट्रॉनिक्स एवं हार्डवेयर लैब",
        desc: "व्यावसायिक ट्रेड हेतु टूल किट, इलेक्ट्रॉनिक पुर्जे एवं कंप्यूटर हार्डवेयर।",
        meta: "व्यावसायिक ट्रेड",
      },
      {
        title: "पुस्तकालय",
        desc: "पाठ्यपुस्तकें, संदर्भ पुस्तकें, प्रतियोगी परीक्षा सामग्री एवं अध्ययन स्थान।",
        meta: "वाचनालय",
      },
      {
        title: "पेयजल व्यवस्था",
        desc: "परिसर में विद्यार्थियों हेतु स्वच्छ पेयजल की व्यवस्था उपलब्ध।",
        meta: "पूरे परिसर में",
      },
      {
        title: "खेल मैदान",
        desc: "प्रार्थना सभा, खेल कालांश एवं विद्यालयीन कार्यक्रमों हेतु खुला मैदान।",
        meta: "खेल एवं सभा",
      },
    ],
  },
  vocational: {
    eyebrow: "एन.एस.क्यू.एफ. कौशल शिक्षा",
    title: "व्यावसायिक",
    highlight: "शिक्षा",
    desc: "कक्षा 9 से व्यावसायिक शिक्षा प्रारंभ होती है। विद्यार्थी कक्षा 9 से ही एक व्यावसायिक ट्रेड चुनते हैं और अपने स्तर के अनुसार व्यावहारिक कौशल प्रशिक्षण प्राप्त करते हैं।",
    startInfo: "कक्षा 9 से व्यावसायिक शिक्षा शुरू होती है। विद्यार्थी जो व्यावसायिक ट्रेड चुनते हैं, उन्हें कक्षा 9 से 12 तक नियमित विषयों के साथ पढ़ाया जाता है।",
    levelTitle: "स्तर अनुसार पाठ्यक्रम",
    levels: [
      {
        range: "कक्षा 9–10",
        name: "बुनियादी स्तर",
        desc: "माध्यमिक स्तर पर, विद्यार्थी अपने चुने हुए व्यावसायिक ट्रेड की बुनियादी जानकारी प्राप्त करते हैं। इसमें उपकरणों का परिचय, सुरक्षा नियम और सरल प्रैक्टिकल प्रोजेक्ट्स पर ध्यान दिया जाता है।",
        points: [
          "ट्रेड की बुनियादी अवधारणा एवं सिद्धांत",
          "उपकरणों का परिचय एवं सुरक्षा नियम",
          "सरल हस्तकला प्रोजेक्ट एवं अभ्यास",
          "एन.एस.क्यू.एफ. स्तर 3 या 4 मूल्यांकन हेतु तैयारी",
        ],
      },
      {
        range: "कक्षा 11–12",
        name: "उन्नत स्तर",
        desc: "उच्चतर माध्यमिक स्तर पर, विद्यार्थी गहन व्यावहारिक प्रशिक्षण प्राप्त करते हैं। वे उद्योग-स्तरीय कौशल, उन्नत खराबी सुधार और वास्तविक प्रोजेक्ट्स पर कार्य करते हैं जो उन्हें रोजगार या आगे की तकनीकी शिक्षा हेतु तैयार करते हैं।",
        points: [
          "उन्नत सिद्धांत एवं व्यावहारिक अनुप्रयोग",
          "उद्योग-स्तरीय कौशल विकास",
          "जटिल प्रोजेक्ट एवं वास्तविक खराबी सुधार",
          "एन.एस.क्यू.एफ. स्तर 5 मूल्यांकन एवं प्रमाणन हेतु तैयारी",
        ],
      },
    ],
    objectivesLabel: "उद्देश्य",
    skillsLabel: "विद्यार्थी क्या सीखते हैं",
    careersLabel: "रोजगार के अवसर",
    subjects: [
      {
        name: "आई.टी. / आई.टी.ई.एस.",
        tagline: "सूचना प्रौद्योगिकी एवं आई.टी. आधारित सेवाएँ",
        intro:
          "आई.टी./आई.टी.ई.एस. ट्रेड में विद्यार्थियों को कंप्यूटर, ऑफिस सॉफ्टवेयर एवं बुनियादी वेब तकनीक की जानकारी दी जाती है। कक्षाओं में सिद्धांत के साथ कंप्यूटर लैब में नियमित अभ्यास कराया जाता है, जिससे विद्यार्थी कक्षा 9 से ही डिजिटल कार्य में दक्ष बनें।",
        objectives: [
          "कंप्यूटर एवं इंटरनेट के सुरक्षित उपयोग में आत्मविश्वास विकसित करना",
          "व्यावहारिक ऑफिस एवं दस्तावेज़ीकरण कौशल विकसित करना",
          "एन.एस.क्यू.एफ. स्तरीय मूल्यांकन एवं प्रमाणन हेतु तैयार करना",
          "आई.टी. एवं कंप्यूटर अनुप्रयोगों में आगे की पढ़ाई हेतु आधार बनाना",
        ],
        skills: [
          "कंप्यूटर की बुनियादी जानकारी",
          "वर्ड प्रोसेसिंग एवं दस्तावेज़ीकरण",
          "स्प्रेडशीट एवं डेटा एंट्री",
          "प्रेजेंटेशन निर्माण",
          "इंटरनेट, ईमेल एवं डिजिटल सुरक्षा",
          "बुनियादी वेब पेज डिज़ाइन (HTML/CSS)",
        ],
        careers: [
          "डेटा एंट्री ऑपरेटर",
          "कंप्यूटर ऑपरेटर / ऑफिस सहायक",
          "कस्टमर केयर एक्जीक्यूटिव",
          "आई.टी. सपोर्ट सहायक",
          "आगे की पढ़ाई: आई.टी.आई., पॉलिटेक्निक, बी.सी.ए. एवं अन्य कंप्यूटर पाठ्यक्रम",
        ],
      },
      {
        name: "इलेक्ट्रॉनिक्स एवं हार्डवेयर",
        tagline: "इलेक्ट्रॉनिक्स, कंप्यूटर हार्डवेयर एवं मरम्मत",
        intro:
          "इलेक्ट्रॉनिक्स एवं हार्डवेयर ट्रेड में विद्यार्थी सीखते हैं कि इलेक्ट्रॉनिक पुर्जे एवं कंप्यूटर सिस्टम वास्तव में कैसे कार्य करते हैं। विद्यार्थी पुर्जों की पहचान, औजारों का सुरक्षित उपयोग तथा असेंबली, इंस्टॉलेशन एवं साधारण मरम्मत का अभ्यास करते हैं।",
        objectives: [
          "बुनियादी इलेक्ट्रॉनिक पुर्जों एवं परिपथों को समझना",
          "औजार, वायरिंग एवं उपकरणों का सुरक्षित उपयोग सीखना",
          "असेंबली, इंस्टॉलेशन एवं खराबी पहचानने का अभ्यास करना",
          "तकनीशियन स्तर के कौशल प्रमाणन हेतु तैयार करना",
        ],
        skills: [
          "बुनियादी इलेक्ट्रॉनिक्स एवं पुर्जे",
          "सोल्डरिंग एवं परिपथ की बुनियादी जानकारी",
          "कंप्यूटर असेंबली एवं पेरिफेरल्स",
          "इंस्टॉलेशन एवं खराबी सुधार",
          "विद्युत सुरक्षा नियम",
          "बुनियादी नेटवर्किंग एवं सी.सी.टी.वी. की जानकारी",
        ],
        careers: [
          "कंप्यूटर हार्डवेयर तकनीशियन",
          "फील्ड तकनीशियन (कंप्यूटिंग एवं पेरिफेरल्स)",
          "इलेक्ट्रॉनिक्स मरम्मत सहायक",
          "सी.सी.टी.वी. / इंस्टॉलेशन सहायक",
          "आगे की पढ़ाई: आई.टी.आई. एवं इलेक्ट्रॉनिक्स डिप्लोमा",
        ],
      },
    ],
    importanceTitle: "व्यावसायिक शिक्षा का महत्व",
    importanceDesc:
      "व्यावसायिक विषय विद्यार्थियों को बोर्ड की पढ़ाई के साथ एक वास्तविक कौशल भी देते हैं, जो शासकीय विद्यालय के विद्यार्थियों के लिए विशेष रूप से उपयोगी है।",
    importancePoints: [
      {
        title: "पढ़ाई के साथ कौशल",
        desc: "विद्यार्थी बोर्ड प्रमाणपत्र के साथ रोजगारपरक व्यावहारिक कौशल भी प्राप्त करते हैं।",
      },
      {
        title: "बेहतर रोजगार क्षमता",
        desc: "ट्रेड प्रशिक्षण से विद्यार्थियों को स्थानीय स्तर पर प्रारंभिक कार्य मिलने में सहायता मिलती है।",
      },
      {
        title: "स्वरोजगार",
        desc: "मरम्मत, डेटा एंट्री एवं सेवा कार्य छोटे स्तर पर स्वयं भी प्रारंभ किए जा सकते हैं।",
      },
      {
        title: "स्पष्ट कैरियर मार्ग",
        desc: "आई.टी.आई., पॉलिटेक्निक, डिप्लोमा एवं आगे की तकनीकी पढ़ाई हेतु मजबूत आधार।",
      },
    ],
    teachersTitle: "व्यावसायिक शिक्षक",
    teachersDesc:
      "प्रत्येक ट्रेड हेतु व्यावसायिक प्रशिक्षक नियमित सैद्धांतिक एवं प्रायोगिक कक्षाएँ संचालित करते हैं। शिक्षक संबंधी विवरण विद्यालय कार्यालय द्वारा अद्यतन किया जाएगा।",
    teachers: [
      {
        role: "आई.टी. / आई.टी.ई.एस. शिक्षक",
        subject: "सूचना प्रौद्योगिकी एवं आई.टी.ई.एस.",
        designation: "व्यावसायिक प्रशिक्षक",
        note: "नाम विद्यालय कार्यालय द्वारा अद्यतन किया जाएगा",
      },
      {
        role: "इलेक्ट्रॉनिक्स एवं हार्डवेयर शिक्षक",
        subject: "इलेक्ट्रॉनिक्स एवं हार्डवेयर",
        designation: "व्यावसायिक प्रशिक्षक",
        note: "नाम विद्यालय कार्यालय द्वारा अद्यतन किया जाएगा",
      },
    ],
  },
  gallery: {
    eyebrow: "परिसर एवं चित्र दीर्घा",
    title: "एक झलक",
    highlight: "हमारे परिसर की",
    desc: "कक्षा-कक्ष, प्रयोगशालाएँ, पुस्तकालय एवं मैदान, जहाँ हमारे विद्यार्थी प्रतिदिन अध्ययन एवं अभ्यास करते हैं।",
    note: "प्रतीकात्मक चित्र",
    items: [
      { title: "विद्यालय भवन", caption: "कैंट क्षेत्र, गुना स्थित हमारे परिसर का शैक्षणिक भवन।" },
      { title: "कक्षा-कक्ष", caption: "एम.पी. बोर्ड पाठ्यक्रम अनुसार नियमित कक्षा अध्यापन।" },
      { title: "पुस्तकालय", caption: "विद्यार्थियों हेतु पाठ्यपुस्तकें एवं संदर्भ सामग्री।" },
      { title: "रसायन प्रायोगिक कार्य", caption: "प्रयोगशाला में बोर्ड स्तरीय प्रायोगिक कार्य।" },
      { title: "कंप्यूटर लैब", caption: "आई.टी.ई.एस. प्रायोगिक कार्य एवं टाइपिंग अभ्यास हेतु।" },
      { title: "खेल मैदान", caption: "प्रार्थना सभा, खेल कालांश एवं कार्यक्रमों हेतु मैदान।" },
      { title: "जीव विज्ञान प्रयोगशाला", caption: "वरिष्ठ कक्षाओं हेतु सूक्ष्मदर्शी, चार्ट एवं नमूने।" },
      { title: "विद्यालयीन गतिविधियाँ", caption: "खेल एवं सह-शैक्षणिक गतिविधियाँ।" },
    ],
  },
  principal: {
    eyebrow: "प्राचार्य का संदेश",
    quoteA: "शिक्षा वह सबसे मजबूत साधन है जिसे विद्यार्थी",
    quoteB: "विद्यालय से जीवन तक साथ ले जाता है।",
    p1: "प्रिय विद्यार्थियों एवं अभिभावकों, हमारे विद्यालय का उद्देश्य सरल है — यहाँ आने वाला प्रत्येक विद्यार्थी ज्ञान, अनुशासन एवं एक उपयोगी कौशल लेकर जाए। सर्व शिक्षा (EFA) शासकीय विद्यालय होने के नाते यहाँ कक्षा 1 से कक्षा 12 तक प्रत्येक वर्ग के विद्यार्थियों का स्वागत है।",
    p2: "नियमित पढ़ाई के साथ कक्षा 9 से शुरू होने वाले आई.टी./आई.टी.ई.एस. एवं इलेक्ट्रॉनिक्स व हार्डवेयर के व्यावसायिक ट्रेड विद्यार्थियों को कार्यक्षेत्र हेतु व्यावहारिक प्रशिक्षण देते हैं। सभी अभिभावकों से निवेदन है कि विद्यालय से संपर्क बनाए रखें एवं बच्चों की नियमित उपस्थिति सुनिश्चित करें।",
    name: "प्राचार्य",
    designation: "शा. बालक उ. मा. विद्यालय कैंट, गुना",
    note: "नाम एवं छायाचित्र विद्यालय कार्यालय द्वारा अद्यतन किया जाएगा",
  },
  teachers: {
    eyebrow: "हमारे शिक्षक",
    title: "हमारा शिक्षक",
    highlight: "स्टाफ",
    desc: "शासन द्वारा नियुक्त विषय शिक्षक, जो नियमित कक्षाएँ, प्रायोगिक कार्य एवं बोर्ड तैयारी कराते हैं।",
    note: "शिक्षकों के नाम एवं छायाचित्र विद्यालय कार्यालय द्वारा अद्यतन किए जाएंगे।",
    facultyLabel: "विषय शिक्षक",
    list: [
      { subject: "गणित", designation: "विषय शिक्षक" },
      { subject: "भौतिक विज्ञान", designation: "विषय शिक्षक" },
      { subject: "रसायन विज्ञान", designation: "विषय शिक्षक" },
      { subject: "जीव विज्ञान", designation: "विषय शिक्षक" },
      { subject: "अंग्रेज़ी", designation: "विषय शिक्षक" },
      { subject: "हिन्दी एवं संस्कृत", designation: "विषय शिक्षक" },
      { subject: "सामाजिक विज्ञान", designation: "विषय शिक्षक" },
      { subject: "कंप्यूटर / आई.टी.", designation: "व्यावसायिक प्रशिक्षक" },
    ],
  },
  achievements: {
    eyebrow: "विद्यालयीन गतिविधियाँ",
    title: "गतिविधियाँ एवं",
    highlight: "सहभागिता",
    desc: "विद्यालय में संचालित नियमित शैक्षणिक एवं सह-शैक्षणिक गतिविधियाँ।",
    items: [
      {
        period: "प्रत्येक वर्ष",
        tag: "शैक्षणिक",
        title: "बोर्ड परीक्षा की तैयारी",
        body: "कक्षा 10 एवं 12 के विद्यार्थियों हेतु नियमित परीक्षण, पुनरावृत्ति कक्षाएँ एवं शंका समाधान।",
      },
      {
        period: "प्रत्येक वर्ष",
        tag: "व्यावसायिक",
        title: "व्यावसायिक प्रायोगिक प्रशिक्षण",
        body: "आई.टी.ई.एस. एवं इलेक्ट्रॉनिक्स ट्रेड हेतु प्रायोगिक कक्षाएँ तथा एन.एस.क्यू.एफ. कौशल मूल्यांकन।",
      },
      {
        period: "वार्षिक",
        tag: "खेल",
        title: "खेल दिवस एवं जिला स्तरीय सहभागिता",
        body: "विद्यालय मैदान पर वार्षिक खेल आयोजन एवं जिला स्तरीय विद्यालयीन प्रतियोगिताओं में सहभागिता।",
      },
      {
        period: "वार्षिक",
        tag: "विज्ञान",
        title: "विज्ञान प्रदर्शनी",
        body: "विद्यालय एवं जिला स्तरीय विज्ञान प्रदर्शनी हेतु विद्यार्थियों द्वारा मॉडल एवं चार्ट निर्माण।",
      },
      {
        period: "सूचना अनुसार",
        tag: "छात्रवृत्ति",
        title: "शासकीय छात्रवृत्ति सहायता",
        body: "राज्य शासन की योजनाओं अनुसार छात्रवृत्ति आवेदन, दस्तावेज़ एवं ऑनलाइन प्रक्रिया में सहायता।",
      },
    ],
  },
  notices: {
    eyebrow: "सूचनाएँ",
    title: "विद्यालय",
    highlight: "सूचना पटल",
    desc: "परीक्षा, अवकाश एवं विद्यालयीन गतिविधियों से संबंधित नवीनतम जानकारी।",
    read: "देखें",
    items: [
      {
        tag: "नवीन सूचना",
        date: "वर्तमान सत्र",
        title: "अभिभावक–शिक्षक बैठक",
        body: "अभिभावकों से निवेदन है कि निर्धारित तिथि पर विद्यालय आकर विद्यार्थी की प्रगति पर चर्चा करें।",
      },
      {
        tag: "परीक्षा कार्यक्रम",
        date: "वर्तमान सत्र",
        title: "अर्धवार्षिक एवं बोर्ड परीक्षा समय-सारणी",
        body: "परीक्षा समय-सारणी विद्यालय सूचना पटल पर प्रदर्शित एवं कक्षा शिक्षकों को उपलब्ध कराई जाती है।",
      },
      {
        tag: "अवकाश सूची",
        date: "वर्तमान सत्र",
        title: "शासकीय अवकाश कैलेंडर",
        body: "विद्यालय म.प्र. स्कूल शिक्षा विभाग द्वारा जारी अवकाश कैलेंडर का पालन करता है।",
      },
      {
        tag: "व्यावसायिक",
        date: "वर्तमान सत्र",
        title: "कक्षा 9 के लिए व्यावसायिक ट्रेड चयन",
        body: "कक्षा 9 में प्रवेश लेने वाले विद्यार्थी आई.टी./आई.टी.ई.एस. अथवा इलेक्ट्रॉनिक्स एवं हार्डवेयर में से अपनी व्यावसायिक शाखा चुन सकते हैं।",
      },
    ],
  },
  footer: {
    about:
      "गुना (म.प्र.) स्थित एक शासकीय उच्चतर माध्यमिक विद्यालय, जो सर्व शिक्षा (EFA) पहल के अंतर्गत कक्षा 1 से 12 तक शिक्षा और कक्षा 9 से आई.टी./आई.टी.ई.एस. एवं इलेक्ट्रॉनिक्स व हार्डवेयर की व्यावसायिक शिक्षा उपलब्ध कराता है।",
    quickLinks: "त्वरित लिंक",
    resources: "जानकारी",
    resourceItems: [
      "व्यावसायिक शिक्षा",
      "परीक्षा एवं परिणाम",
      "शासकीय छात्रवृत्ति",
      "स्थानांतरण प्रमाणपत्र",
      "ई.एफ.ए. जानकारी",
    ],
    rights: "सर्वाधिकार सुरक्षित।",
    designed: "सादर निर्मित",
    designedFor: "हेतु",
    backToTop: "ऊपर जाएँ",
    devCredit: "वेबसाइट डिज़ाइन एवं विकास: लक्ष्य जाटव",
  },
};

export const dictionaries = { en, hi };
export type Lang = keyof typeof dictionaries;
