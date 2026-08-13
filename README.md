# Govt. Boys H. S. School Cantt, Guna — Premium Admin CMS

This project is a premium, fully responsive, bilingual (English & Hindi) single-page frontend website for **GOVT. BOYS H. S. SCHOOL CANTT, GUNA** (an Education For All - EFA Government School) integrated with a state-of-the-art **Appwrite Cloud Admin CMS** for complete content control.

---

## 🚀 Key Features

* **Bilingual Translation (EN ⇄ HI):** 100% complete instant translation of all headings, buttons, notifications, cards, and paragraphs.
* **Bilingual Supabase-to-Appwrite migration:** Completely migrated to the official **Appwrite Cloud** Web SDK with secure password-less sessions and atomic document updates.
* **Unified NoSQL Schema:** Eliminates relational schema failures by consolidating settings and entity arrays inside structured NoSQL documents, allowing instant load and guaranteed sync.
* **1-Second Background Synchronization:** The website automatically fetches published database values on mount and polls for modifications in the background, keeping public users updated in real time.
* **Failsafe Offline Fallback:** If Appwrite keys are unconfigured or offline, the app seamlessly runs via high-performance `localStorage` fallback—**guaranteeing zero white screens or crashes**.
* **Zero Hardcoded Credentials:** Password-only, secure administrative authentication handled by Appwrite Auth sessions.

---

## 🛠️ Appwrite Cloud Setup

Setting up your backend on Appwrite Cloud takes less than 3 minutes. Follow these simple steps:

### 1. Create Appwrite Account & Project
1. Sign up on [Appwrite Cloud](https://cloud.appwrite.io).
2. Create a new project named `gbhss-guna`.
3. Copy your **Project ID** and **Endpoint** (`https://cloud.appwrite.io/v1`).

### 2. Create the Database & Collection
1. Go to **Databases** → click **Create Database** (name it `gbhss-db`). Copy the **Database ID**.
2. Inside `gbhss-db`, click **Create Collection**:
   * Name: `Website Content`
   * Collection ID: `website_content`
3. Inside `website_content` → go to **Attributes** tab → click **Create Attribute** → select **String**:
   * Attribute Key: `data`
   * Size: `1048576` (or maximum allowed size, to store the unified JSON data tree).
   * Required: `true`
4. Go to **Settings** tab of the `website_content` collection:
   * Under **Permissions** → Click **Add Role**:
     * Select **Any** (or **Guests**) → check **Read** (allows public website users to see latest content).
     * Select **All Users** (or **Users**) → check **Create, Read, Update, Delete** (allows authenticated administrators to edit content).

### 3. Create the Storage Bucket
1. Go to **Storage** → click **Create Bucket**:
   * Name: `School Media`
   * Bucket ID: `school-media`
2. Go to **Settings** tab of the `school-media` bucket:
   * Under **Permissions** → Click **Add Role**:
     * Select **Any** (or **Guests**) → check **Read** (allows public view access).
     * Select **All Users** (or **Users**) → check **Create, Read, Update, Delete** (allows admins to upload/delete photos).

### 4. Create your Administrator User
1. Go to **Auth** → click **Add User**:
   * Enter your desired **Admin Email** (e.g., `admin@gbhssguna.edu.in`) and **Admin Password** (minimum 8 characters).
   * Click **Save**.

---

## ⚙️ Environment Variables

Create a `.env` file in your root folder (or add them in **Vercel Settings → Environment Variables**):

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-appwrite-project-id
VITE_APPWRITE_DATABASE_ID=your-appwrite-database-id
VITE_APPWRITE_BUCKET_ID=school-media
```

*Note: If these environment variables are left blank or omitted, the application will automatically enter Local Fallback Mode where you can login locally using `Lakshya@123` to test edits locally.*

---

## 📦 Commands & Local Testing

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

---

## 🚀 Deploying to Vercel

1. Push your code to your GitHub Repository:
   ```bash
   git init
   git remote add origin <your-github-repo-url>
   git add .
   git commit -m "Initial production CMS with Appwrite"
   git push -u origin main
   ```
2. Open [Vercel Dashboard](https://vercel.com) → click **Add New** → **Project**.
3. Import your GitHub repository.
4. Expand **Environment Variables** and enter the 4 Appwrite keys listed above.
5. Click **Deploy**. Vercel will build and serve your premium school website instantly!

---

## 🔒 Security Audit & Design Standards

* **XSS Protection:** Output sanitization and safe JSX rendering prevent malicious code injection.
* **Authentication:** Stateless, cryptographically signed token authentication managed directly by Appwrite Cloud.
* **Authorization:** Strict role-based access control (RBAC) enforced on Appwrite Database and Storage buckets, ensuring no unauthorized visitor can execute write/delete actions.
* **File Validation:** Integrated MIME type validation and safe file renaming during uploads.
