require("dotenv").config({ path: ".env.setup" });

const sdk = require("node-appwrite");

/*
========================================================
 APPWRITE CONFIG
========================================================
*/

const ENDPOINT = process.env.APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const API_KEY = process.env.APPWRITE_API_KEY;

if (!ENDPOINT || !PROJECT_ID || !DATABASE_ID || !API_KEY) {
  console.error("");
  console.error("❌ Missing Appwrite configuration.");
  console.error("");
  console.error("Check .env.setup:");
  console.error("APPWRITE_ENDPOINT=");
  console.error("APPWRITE_PROJECT_ID=");
  console.error("APPWRITE_DATABASE_ID=");
  console.error("APPWRITE_API_KEY=");
  console.error("");
  process.exit(1);
}

const client = new sdk.Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const tablesDB = new sdk.TablesDB(client);

const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/*
========================================================
 DATABASE SCHEMA
========================================================
*/

const schema = {
  website_settings: {
    name: "Website Settings",
    columns: [
      ["school_name", "string", 255],
      ["school_name_caps", "string", 255],
      ["school_place", "string", 255],
      ["logo_url", "string", 2048],
      ["address", "text"],
      ["phone", "string", 50],
      ["email", "email"],
      ["map_embed", "text"],
      ["footer_about", "text"],
      ["footer_dev_credit", "string", 255],
    ],
  },

  social_links: {
    name: "Social Links",
    columns: [
      ["platform", "string", 100],
      ["url", "string", 2048],
      ["position", "integer"],
    ],
  },

  hero_section: {
    name: "Hero Section",
    columns: [
      ["badge_text", "string", 255],
      ["title_a", "string", 255],
      ["title_highlight", "string", 255],
      ["title_b", "string", 255],
      ["subtitle", "text"],
      ["explore_btn", "string", 100],
      ["card_title", "string", 255],
      ["card_subtitle", "text"],
      ["float_label_a", "string", 100],
      ["float_label_b", "string", 100],
      ["badge1", "string", 255],
      ["badge2", "string", 255],
      ["badge3", "string", 255],
      ["bg_image_url", "string", 2048],
      ["card_image_url", "string", 2048],
    ],
  },

  hero_marquee: {
    name: "Hero Marquee",
    columns: [
      ["text", "string", 500],
      ["position", "integer"],
    ],
  },

  principal: {
    name: "Principal",
    columns: [
      ["name", "string", 255],
      ["designation", "string", 255],
      ["quote_a", "text"],
      ["quote_b", "text"],
      ["paragraph1", "text"],
      ["paragraph2", "text"],
      ["photo_url", "string", 2048],
      ["note", "text"],
    ],
  },

  teachers: {
    name: "Teachers",
    columns: [
      ["name", "string", 255],
      ["photo", "string", 2048],
      ["subject", "string", 255],
      ["designation", "string", 255],
      ["qualification", "string", 255],
      ["experience", "string", 100],
      ["display_order", "integer"],
    ],
  },

  gallery: {
    name: "Gallery",
    columns: [
      ["image_url", "string", 2048],
      ["category", "string", 100],
      ["title", "string", 255],
      ["caption", "text"],
      ["display_order", "integer"],
    ],
  },

  notices: {
    name: "Notices",
    columns: [
      ["tag", "string", 100],
      ["notice_date", "string", 100],
      ["title", "string", 255],
      ["body", "text"],
      ["pinned", "boolean"],
      ["important", "boolean"],
      ["published", "boolean"],
    ],
  },

  facilities: {
    name: "Facilities",
    columns: [
      ["icon_name", "string", 100],
      ["title", "string", 255],
      ["description", "text"],
      ["meta_badge", "string", 100],
      ["display_order", "integer"],
    ],
  },

  achievements: {
    name: "Achievements",
    columns: [
      ["period", "string", 100],
      ["tag", "string", 100],
      ["title", "string", 255],
      ["body", "text"],
      ["display_order", "integer"],
    ],
  },

  vocational_section: {
    name: "Vocational Section",
    columns: [
      ["eyebrow", "string", 255],
      ["title", "string", 255],
      ["highlight", "string", 255],
      ["description", "text"],
    ],
  },

  vocational_courses: {
    name: "Vocational Courses",
    columns: [
      ["name", "string", 255],
      ["tagline", "string", 255],
      ["intro", "text"],
      ["eligibility", "string", 255],
      ["duration", "string", 100],
      ["display_order", "integer"],
    ],
  },

  vocational_subjects: {
    name: "Vocational Subjects",
    columns: [
      ["course_id", "string", 64],
      ["subject", "string", 255],
    ],
  },

  vocational_certificates: {
    name: "Vocational Certificates",
    columns: [
      ["course_id", "string", 64],
      ["certificate", "string", 255],
    ],
  },

  vocational_skills: {
    name: "Vocational Skills",
    columns: [
      ["course_id", "string", 64],
      ["skill", "string", 255],
    ],
  },

  vocational_careers: {
    name: "Vocational Careers",
    columns: [
      ["course_id", "string", 64],
      ["career", "string", 255],
    ],
  },
};

/*
========================================================
 CHECK TABLE
========================================================
*/

async function tableExists(tableId) {
  try {
    await tablesDB.getTable({
      databaseId: DATABASE_ID,
      tableId: tableId,
    });

    return true;
  } catch (error) {
    return false;
  }
}

/*
========================================================
 CREATE TABLE
========================================================
*/

async function ensureTable(tableId, tableName) {
  const exists = await tableExists(tableId);

  if (exists) {
    console.log("✓ Table already exists:", tableId);
    return;
  }

  try {
    await tablesDB.createTable({
      databaseId: DATABASE_ID,
      tableId: tableId,
      name: tableName,
      permissions: [
        sdk.Permission.read(sdk.Role.any()),
      ],
      rowSecurity: false,
      enabled: true,
    });

    console.log("✓ Created table:", tableId);
  } catch (error) {
    console.error("❌ Failed to create table:", tableId);
    console.error(error.message);
  }

  await wait(700);
}

/*
========================================================
 CHECK COLUMN
========================================================
*/

async function columnExists(tableId, columnKey) {
  try {
    const result = await tablesDB.listColumns({
      databaseId: DATABASE_ID,
      tableId: tableId,
      queries: [],
      total: false,
    });

    return result.columns.some(
      (column) => column.key === columnKey
    );
  } catch (error) {
    return false;
  }
}

/*
========================================================
 CREATE COLUMN
========================================================
*/

async function ensureColumn(
  tableId,
  columnKey,
  type,
  size
) {
  const exists = await columnExists(
    tableId,
    columnKey
  );

  if (exists) {
    console.log("   ✓ Column already exists:", columnKey);
    return;
  }

  try {
    if (type === "string") {
      await tablesDB.createStringColumn({
        databaseId: DATABASE_ID,
        tableId: tableId,
        key: columnKey,
        size: size || 255,
        required: false,
        array: false,
        encrypt: false,
      });
    }

    else if (type === "text") {
      await tablesDB.createTextColumn({
        databaseId: DATABASE_ID,
        tableId: tableId,
        key: columnKey,
        required: false,
        array: false,
        encrypt: false,
      });
    }

    else if (type === "integer") {
      await tablesDB.createIntegerColumn({
        databaseId: DATABASE_ID,
        tableId: tableId,
        key: columnKey,
        required: false,
        array: false,
      });
    }

    else if (type === "boolean") {
      await tablesDB.createBooleanColumn({
        databaseId: DATABASE_ID,
        tableId: tableId,
        key: columnKey,
        required: false,
        array: false,
      });
    }

    else if (type === "email") {
      await tablesDB.createEmailColumn({
        databaseId: DATABASE_ID,
        tableId: tableId,
        key: columnKey,
        required: false,
        array: false,
      });
    }

    else {
      console.error(
        "   ❌ Unknown column type:",
        type
      );
      return;
    }

    console.log("   + Created column:", columnKey);
  } catch (error) {
    console.error(
      "   ❌ Failed column:",
      columnKey
    );

    console.error(
      "      ",
      error.message
    );
  }

  await wait(500);
}

/*
========================================================
 MAIN SETUP
========================================================
*/

async function main() {
  console.log("");
  console.log("==============================================");
  console.log(" SCHOOL WEBSITE");
  console.log(" APPWRITE DATABASE SCHEMA SETUP");
  console.log("==============================================");
  console.log("");

  console.log("Endpoint   :", ENDPOINT);
  console.log("Project ID :", PROJECT_ID);
  console.log("Database ID:", DATABASE_ID);
  console.log("");

  console.log("Testing Appwrite connection...");
  console.log("");

  /*
  ------------------------------------------------------
  Verify database access
  ------------------------------------------------------
  */

  try {
    await tablesDB.listTables({
      databaseId: DATABASE_ID,
      queries: [],
      total: false,
    });

    console.log("✓ Appwrite connection successful.");
  } catch (error) {
    console.error("");
    console.error("❌ Cannot access Appwrite database.");
    console.error("");
    console.error(error.message);
    console.error("");
    console.error(
      "Check:"
    );
    console.error(
      "1. Project ID"
    );
    console.error(
      "2. Database ID"
    );
    console.error(
      "3. API Key permissions"
    );
    console.error(
      "4. Appwrite endpoint"
    );
    console.error("");

    process.exit(1);
  }

  console.log("");

  /*
  ------------------------------------------------------
  Create every table and column
  ------------------------------------------------------
  */

  for (const [tableId, table] of Object.entries(schema)) {
    console.log("----------------------------------------------");
    console.log("TABLE:", tableId);
    console.log("----------------------------------------------");

    await ensureTable(
      tableId,
      table.name
    );

    for (const column of table.columns) {
      const columnKey = column[0];
      const type = column[1];
      const size = column[2];

      await ensureColumn(
        tableId,
        columnKey,
        type,
        size
      );
    }

    console.log("");
  }

  console.log("==============================================");
  console.log(" ✅ APPWRITE SCHEMA SETUP COMPLETED");
  console.log("==============================================");
  console.log("");

  console.log("Created / verified:");
  console.log("- Website settings");
  console.log("- Social links");
  console.log("- Hero section");
  console.log("- Hero marquee");
  console.log("- Principal");
  console.log("- Teachers");
  console.log("- Gallery");
  console.log("- Notices");
  console.log("- Facilities");
  console.log("- Achievements");
  console.log("- Vocational section");
  console.log("- Vocational courses");
  console.log("- Vocational subjects");
  console.log("- Vocational certificates");
  console.log("- Vocational skills");
  console.log("- Vocational careers");
  console.log("");

  console.log("Next step:");
  console.log("Configure Appwrite Storage bucket");
  console.log("and connect the React application.");
  console.log("");
}

/*
========================================================
 RUN
========================================================
*/

main().catch((error) => {
  console.error("");
  console.error("==============================================");
  console.error(" ❌ FATAL ERROR");
  console.error("==============================================");
  console.error("");
  console.error(error);
  console.error("");

  process.exit(1);
});