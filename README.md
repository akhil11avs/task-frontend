# Taskify Frontend - Real-Time Dashboard UI

This is the frontend client web application for **Taskify**, built using **Vite, React, TypeScript, and Material UI (MUI)**. It integrates **Zustand** for local state management, **TanStack React Query** for server-side state synchronization, and **Socket.IO Client** for real-time update notifications.

---

## 🚀 Setup & Local Development

### Prerequisites
* **Node.js** (v18.x or higher)
* **npm** (v9.x or higher)

### 1. Installation
Navigate to the `frontend/` directory and install the required dependencies:
```bash
cd frontend
npm install
```

### 2. Environment Variables Configuration
Copy the template environment file to `.env` and configure the variables accordingly:
```bash
cp .env.example .env
```
Refer to `.env.example` for the list of required variables.

### 3. Run the Development Server
To launch Vite's hot-reloading development server:
```bash
npm run dev
```
The app will run locally (typically at `http://localhost:3000` or `http://localhost:5173` depending on configuration).

### 4. Build for Production
To compile typescript types and bundle static assets into the optimized production directory `dist/`:
```bash
npm run build
```
You can preview the compiled assets locally using:
```bash
npm run preview
```

### 5. Code Linting
Run Oxlint for rapid static analysis checks:
```bash
npm run lint
```

---

## 🛠️ Architecture Decisions

### 1. Modern Glassmorphic Dark UI Theme
* Configured a custom dark palette using MUI Theme Provider (`src/App.tsx`) with modern indigo and pink highlight accents, radial backgrounds, and customized typography using the Google Font **Outfit**.
* Standardizes button variants, list layout sheets, forms, and dialog wrappers to achieve a premium UI/UX.

### 2. Specialized State Management Strategy
The client segregates state into distinct categories:
* **Server State (TanStack React Query)**: Handles all queries, mutation payloads, loading indicators, error states, and automatic request retries. Keep cache files clean and optimized.
* **Client UI State (Zustand)**: Manages local pagination thresholds, active status filters, search queries, and real-time state mirroring.

### 3. Real-Time Socket Synchronization Flow
To maintain synchronization across multiple browser tabs without spamming request intervals:
1. When a task status is changed by any client, the backend broadcasts a `task:statusChanged` message.
2. The socket client (`src/socket/socket.ts`) intercepts this signal.
3. It immediately invokes `updateTaskStatusLocal()` on the Zustand store to change the task status instantly on the user's screen.
4. It triggers `queryClient.invalidateQueries({ queryKey: ['tasks'] })`, forcing a background network fetch. This validates that filters, pagination, and server order remain perfectly accurate.
5. It dispatches a custom JavaScript DOM Event (`taskStatusNotification`) which prompts premium toast alerts.

---

## 📈 Production Scalability Recommendations

1. **CDN Edge Deployments**
   Since the build output consists of static HTML, CSS, and JS files, deploy the `dist/` directory directly to global Edge Content Delivery Networks (e.g., Netlify, Vercel, AWS CloudFront, or Cloudflare Pages) to achieve sub-millisecond download times worldwide.

2. **Route and Component Code Splitting**
   Employ `React.lazy` and `React.Suspense` dynamic imports to load heavy components (such as task tables, charting components, or modal managers) only when needed, minimizing initial bundle size.

3. **Progressive Web App (PWA) Integration**
   Integrate `vite-plugin-pwa` to register service workers. This caches web resources locally to allow offline access and enables browser push notifications.

4. **Robust Content Security Policy (CSP)**
   Enforce CSP headers via Nginx or Cloudflare (e.g., blocking inline scripts, configuring whitelist domains for Socket connections) to protect users from Cross-Site Scripting (XSS) and script injections.

5. **Comprehensive E2E Testing**
   Set up Cypress or Playwright tests to replicate user interactions (creating, filtering, and modifying status) and assert that WebSockets update the browser UI correctly in real time across simulated dual-browsers.

---

## ⚖️ Trade-offs Made

* **Heavy MUI Dependency**
  * **Trade-off**: The interface relies on Material-UI elements.
  * **Reasoning**: Speeds up development and ensures responsive styling patterns, but increases total initial javascript bundle weights.
* **Optimistic Local Invalidation Loop**
  * **Trade-off**: The Socket handler updates Zustand state locally and also invalidates the React Query cache.
  * **Reasoning**: This "hybrid" approach ensures the UI responds instantly, but triggers a full network fetch to sync. If multiple status changes occur simultaneously, it can lead to redundant HTTP refresh calls.
* **Client-Side Filters & Pagination Sync**
  * **Trade-off**: Search text and state filters are sent as query parameters, but WebSocket status broadcasts update any visible rows instantly.
  * **Reasoning**: If a user is filtering by "pending" and a task changes to "completed", the item remains on screen until the background query invalidates and filters it out. This ensures UI stability during edits, but can momentarily show mismatching status rows.
