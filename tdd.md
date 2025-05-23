# 🛠 Technical Design Document (TDD)

## 1. Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + shadcn-ui  
- **Backend**: Supabase (PostgreSQL + Auth)  
- **CI/CD**: GitHub Actions + Lovable (Deployments)  

---


## 2. System Architecture

Grade Eleven Explorer is a single-page web application (SPA) hosted on Lovable. It communicates with Supabase using the official client SDK.

- **Frontend**: React + Vite + Tailwind
- **Backend**: Supabase for API + DB + Auth
- **Architecture Flow**:

```text
[User] ⇄ [React SPA] ⇄ [Supabase SDK] ⇄ [Supabase REST API] ⇄ [Database]

/src
  ├── components/       # Reusable UI components
  ├── pages/            # Views mapped to routes
  ├── lib/              # Supabase config and helper functions

/public                 # Static files like index.html, favicon, etc.
/supabase               # Supabase config, migrations, SQL scripts

---



## 4. API Design

- **Supabase auto-generates REST APIs**
- **Accessed through the Supabase JS SDK**

```ts
const { data, error } = await supabase
  .from('resources')
  .select('*');
