# Prayukti Technical Briefing: Deep Analysis

**Date:** 2026-03-13  
**Status:** Deep Audit Complete  

---

## 1. PROJECT OVERVIEW
- **What is Prayukti?** A scalable virtual laboratory (vLAB) ecosystem designed for engineering students, specifically tailored for Madan Mohan Malaviya University of Technology (MMMUT). It provides interactive simulations for subjects like Digital Logic Design (DLD), Computer Networks (CN), and Data Structures.
- **Core Features:**
    - **Authentication:** Domain-restricted login (`@mmmut.ac.in`) with OTP verification.
    - **Subject Dashboards:** Specialized views for DAA, OOPS, DLD, MPMC, DBMS, and CN.
    - **Simulation Engines:** 
        - **DLD:** Drag-and-drop circuit simulator with real-time logic evaluation (Truth Tables).
        - **Coding Labs:** Integrated Monaco Editor with execution support for C, C++, Java, and Python.
    - **AI Lab Assistant:** Context-aware chatbot powered by Groq (Llama 3.3).
    - **Certificate Generation:** Automated PDF certificate issuance upon lab completion.
- **Tech Stack Summary:**
    - **Frontend:** Next.js 15.1 (App Router), React 19, Tailwind CSS, Shadcn UI, Zustand, Framer Motion, @xyflow/react (React Flow).
    - **Backend:** Express.js 4.19, Node.js (v18+), Mongoose 8.3.
    - **Database:** MongoDB Atlas.
    - **Execution:** Judge0 API (Code Execution).
- **Structure:** Monorepo managed by **Turborepo**.

---

## 2. ARCHITECTURE & SYSTEM DESIGN
- **High-Level Design:** The system follows a decoupled Monorepo architecture.
    - **Frontend:** Client-heavy application handling complex UI states (Circuit Graphs, Code Editing).
    - **Backend:** REST API handling persistence, authentication, and acting as a gateway to external execution services.
- **Interaction Flow:**
    1. User interacts with Dashboard (Next.js).
    2. Requests flow to the Express.js Backend (`/api/...`).
    3. Backend communicates with MongoDB Atlas for persistent data.
    4. Code execution requests are proxied from Backend to Judge0.
    5. AI Chat requests flow from Frontend via Next.js API Routes to Groq API.
- **Design Patterns:** 
    - **Iterative Logic Evaluation:** Used in the DLD engine to propagate signals through gates.
    - **Role-Based Guards:** Frontend and Backend both implement role-based access control (Student, Teacher, Admin).

---

## 3. DIRECTORY STRUCTURE & CODE ORGANIZATION
- **Root:**
    - `frontend/`: Next.js application.
    - `backend/`: Express.js API.
    - `packages/ui/`: Internal shared component library (Button, Card, Code).
- **Backend structure (`/backend`):**
    - `controllers/`: Core business logic (e.g., `codeController.js`, `authController.js`).
    - `models/`: Mongoose schemas (User, Subject, Experiment).
    - `routes/`: API endpoint definitions.
    - `config/`: DB connection logic.
- **Frontend structure (`/frontend`):**
    - `app/`: Next.js App Router (Pages and API Routes).
    - `components/`: UI components (separated by features: `lab`, `simulation`, `dashboard`).
    - `lib/`: Shared utilities (`circuit-engine.ts`, `certificate.ts`).
- **Configs:** Environment variables managed via `.env` in both folders, with `BACKEND_` / `FRONTEND_` prefixes for deployment mapping.

---

## 4. FRONTEND
- **Framework:** Next.js 15 (App Router).
- **Routing:** File-based routing in `frontend/app/`. Use of groups like `(roles)` and `(use-cases)` to organize protected routes.
- **State Management:** **Zustand** is utilized for simulation state and user progress.
- **Communication:** Standard **Axios** for backend REST API calls. Next.js `fetch` is used in API routes for server-side external calls.
- **Build Tool:** Turborepo handles the pipeline; standard `next build` for the frontend.

---

## 5. BACKEND / API LAYER
- **Framework:** Express.js using `node-nodemon` for development.
- **Routes:**
    - `/api/auth`: Login, Register, OTP.
    - `/api/subjects`: Subject listing.
    - `/api/experiments`: Lab details and seeding.
    - `/api/code`: Python/C++/Java execution via Judge0.
    - `/api/users`: Metadata management.
- **Authentication:** **JWT** (JSON Web Tokens) stored in `process.env.JWT_SECRET`.
- **Middleware:** `cors` (configured for credentials), `express.json()`.
- **Background Jobs:** Not implemented; execution is synchronous-wait (via Judge0 `wait=true`).

---

## 6. DATABASE & DATA LAYER
- **Database:** MongoDB Atlas (Cloud).
- **ORM:** Mongoose.
- **Core Collections:**
    - `User`: Handles RBAC, verification status, and roll numbers.
    - `Subject`: Categorizes labs (e.g., Computer Networks, Digital Logic).
    - `Experiment`: Contains theory, algorithm, and `codeTemplate`.
- **Migrations:** No formal migration system (e.g., Prisma); rely on `init_db.js` and `sync_experiments.js` for data population.

---

## 7. INFRASTRUCTURE & DEPLOYMENT
- **Environment Variables:**
    - **Backend:** `MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`.
    - **Frontend:** `NEXT_PUBLIC_API_URL`, `GROQ_API_KEY`.
- **DNS Override:** `backend/server.js` (lines 15-21) overrides local DNS to `8.8.8.8` to fix Atlas SRV resolution issues—a critical custom fix.
- **Docker:** No Dockerfiles found in the source tree.

---

## 8. THIRD-PARTY INTEGRATIONS
- **Judge0:** (https://ce.judge0.com) Used in `backend/controllers/codeController.js` for remote code execution.
- **Groq AI:** Used in `frontend/app/api/chat/route.ts` for the Lab Assistant chatbot.
- **Nodemailer:** Used in `backend/controllers/authController.js` for sending OTPs via Gmail.
- **Spline:** Used in `frontend/app/page.tsx` for 3D hero animations.

---

## 9. TESTING
- **Status:** **CRITICAL GAP.**
- **Details:** No test suites (Jest/Cypress/Playwright) were found in the source directory (ignoring `node_modules`). `find` returned 0 results for `*.test.*`.

---

## 10. WHAT IS WORKING ✅
- **Authentication:** Full flow with domain restrictions and OTP.
- **Subject Discovery:** Dynamic loading of subjects and experiments from MongoDB.
- **DLD Simulation:** High-detail circuit editor with basic MSI component logic (Mux/Decoder).
- **Code Execution:** Functional execution and complexity analysis for common languages.
- **AI Chatbot:** Context-aware assistant with safety filtering for off-topic questions.

---

## 11. WHAT IS BROKEN OR INCOMPLETE ❌
- **Simulation Engine:** `frontend/lib/circuit-engine.ts` (lines 114-119) notes that Demux outputs/handles are not yet fully implemented in the iterative loop.
- **Testing:** Entirely missing.
- **Seeding:** `backend/controllers/experimentController.js` overwrites the entire collection on seed (`Experiment.deleteMany({})`), which is destructive.
- **Mobile UI:** The complexity of the React Flow canvas suggests potential issues on small mobile touchscreens.

---

## 12. TECHNICAL DEBT & CODE QUALITY
- **Duplicate Logic:** `circuit-engine.ts` contains an older simple evaluator and a newer handle-aware evaluator in the same file.
- **Hardcoding:** Judge0 languages are hardcoded into `languageMap` in `codeController.js`.
- **Security:** `BACKEND_` vars are stripped globally in `server.js`, which could lead to accidental overrides if not strictly managed.
- **Error Handling:** Many controllers use catch-all logs (`console.error(err)`) without structured error reporting or retry logic for external APIs.

---

## 13. PERFORMANCE CONSIDERATIONS
- **N+1 Avoidance:** Basic use of `.find({ subjectId })` is efficient, but as student progress grows, missing indexes on `subjectId` or `email` could hurt.
- **Execution Latency:** Dependent on Judge0 public tier; analysis of large codebases may time out.

---

## 14. DEVELOPER EXPERIENCE & SETUP
- **Entry Point:** Root `package.json` contains `npm run dev`, which uses Turborepo to start both layers.
- **Setup:** Requires local `.env` setup. The `backend/server.js` auto-seeds a `test.student@mmmut.ac.in` user, facilitating immediate testing.

---

## 15. SUGGESTIONS & RECOMMENDATIONS 💡

### 🔴 Critical
1. **Implement Automated Tests:** Add Jest for backend logic and Playwright for simulation flows.
2. **Handle judge0 Rate Limits:** Implement a queue or local execution runner if public API limits are hit.

### 🟡 Important
1. **Refactor Simulation Engine:** Clean up the duplicate logic in `circuit-engine.ts` and finalize DEMUX/Flip-Flop handle support.
2. **Schema Validation:** Implement Zod or Joi for request body validation in the backend.

### 🟢 Nice to have
1. **Containerization:** Add Dockerfiles and `docker-compose.yml` for unified local development.
2. **Progress Visualization:** Dashboard analytics for students to see their experiment completion history.

---

## 16. OPEN QUESTIONS
1. Is there a plan for a local Judge0 node for faster/private execution?
2. Should teacher roles have the ability to create experiments directly via the UI, or is Seeding the intended path?
3. What is the target mobile support level for the simulation canvas?
