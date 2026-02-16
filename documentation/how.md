# Technical Blueprint & Roadmap

This document outlines the technical architecture, technology stack, and implementation details for the Jordin Hipps portfolio website. The project follows a modern, performance-oriented approach using Astro and React.

> **Constraint:** All development happens under the `development` directory.

## v0: Tech Stack & Environment

### Core Technologies
-   **Framework:** [Astro](https://astro.build/) (v5)
    -   Utilizes Static Site Generation (SSG) for performance and SEO.
-   **UI Library:** [React](https://react.dev/)
    -   Powers the interactive `PortfolioApp`, `WheelMenu`, and `SectionViewer` components.
-   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
    -   Utility-first CSS framework with native Vite support.
    -   **Plugins:** `@tailwindcss/typography` for Markdown styling.
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Package Manager:** [npm](https://www.npmjs.com/)
-   **Environment:** [devenv](https://devenv.sh/)
    -   Nix-based reproducible environment (Node.js 20).

### Key Libraries
-   **Wheel Component:** `@ncdai/react-wheel-picker`
    -   Provides the core 3D wheel interaction.
-   **Markdown Parser:** `markdown-it`
    -   Converts markdown body to HTML strings for React rendering.
-   **Icons:** `lucide-react`
    -   Standard icon set for UI elements.

---

## v1: Project Foundation & Optimization

### Implementation Details
1.  **Environment:** `devenv.nix` configures Node.js and handles `npm install` on shell entry.
2.  **Performance Fixes:**
    -   **Vite Cache:** Added `optimizeDeps` in `astro.config.mjs` for `lucide-react` and `@ncdai/react-wheel-picker` to prevent slow startup times.
    -   **Filesystem Scan:** Added `.devenv` to `.gitignore` to prevent Tailwind v4 from scanning the large Nix store directory, which was causing extreme dev-server latency.
3.  **TS Config:** Configured path aliases (`@/*` -> `src/*`) and strictly excluded `node_modules`.

---

## v2: Navigation & Routing (The Path System)

### Implementation Details
1.  **Dynamic Routing:**
    -   Replaced static `index.astro` with `src/pages/[...slug].astro`.
    -   Uses `getStaticPaths` to generate a dedicated path for every markdown file.
    -   The root path (`/`) automatically defaults to the first project.
2.  **Path-Based Navigation:**
    -   Moved away from URL hashes (`#`) in favor of the **HTML5 History API**.
    -   `PortfolioApp.tsx` listens for `popstate` events and uses `pushState` to update the URL as the user scrolls or clicks.
3.  **Wheel Component:**
    -   Merged the `@ncdai/wheel-picker` shadcn primitive directly into `WheelMenu.tsx` for a self-contained component.
    -   **Physics Tuning:** Set `scrollSensitivity` to `1` to achieve a discrete, "snap-to-item" feel instead of wild velocity scrolling.
    -   **Aesthetics:** Removed all background colors and borders from the wheel elements to ensure it blends seamlessly with the page background.

---

## v3: Content Engine

### Implementation Details
1.  **Content Collections:**
    -   Managed via `src/content/config.ts`.
    -   Schema includes `title`, `description`, `order`, and `published` status.
2.  **Rendering Pipeline:**
    -   Astro fetches the collection during the build.
    -   `renderMarkdown` utility (using `markdown-it`) processes the content.
    -   The resulting HTML and metadata are passed to the `PortfolioApp` React island.
3.  **Data Stability:**
    -   Used `useMemo` and `useCallback` in the React layer to prevent "snap-back" bugs caused by array reference changes during scrolling.

---

## v4: Responsive UI & Branding

### Implementation Details
1.  **Mobile Header:**
    -   Implemented a sticky `<header>` in `PortfolioApp.tsx` that is only visible on mobile.
    -   Ensures the "Jordin Hipps" branding remains persistently visible above the project content.
2.  **Layout Splits:**
    -   **Desktop:** Navigation occupies a fixed 1/6 width on the left.
    -   **Mobile:** Navigation is hidden behind a toggle button, appearing as a full-screen blurred overlay.
3.  **Interactivity:**
    -   Added `cursor-pointer` and hover opacity transitions to wheel items.
    -   Used Tailwind `prose` for automatic, high-quality styling of markdown-rendered content.

---

## Directory Structure
```text
development/
├── src/
│   ├── components/  # React components (PortfolioApp, WheelMenu, SectionViewer)
│   ├── content/     # Markdown sections
│   ├── data/        # site.json metadata
│   ├── lib/         # Shared utilities (markdown, tailwind merge)
│   ├── pages/       # [...slug].astro dynamic route
│   └── styles/      # global.css (Tailwind v4 entry)
├── devenv.nix
└── astro.config.mjs
```
