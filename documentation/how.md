# Technical Blueprint & Roadmap

This document outlines the technical architecture, technology stack, and implementation roadmap for the Jordin Hipps portfolio website. The project follows a versioned approach, where each version represents a vertical slice of functionality.

> **Constraint:** All development must happen under the `development` directory.

## v0: Tech Stack & Environment

### Core Technologies
-   **Framework:** [Astro](https://astro.build/) (v5)
    -   Chosen for SSG capabilities and Island Architecture.
-   **UI Library:** [React](https://react.dev/)
    -   Used for the `WheelMenu` and `SectionViewer` components.
-   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
    -   Utility-first CSS framework.
    -   **Plugins:** `@tailwindcss/typography` for Markdown styling.
    -   **Setup:** Manual Vite plugin configuration (required for v4).
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
    -   Strict typing enabled.
-   **Package Manager:** [npm](https://www.npmjs.com/)
-   **Environment:** [devenv](https://devenv.sh/)
    -   Enforces reproducible Node.js environment.

### Key Libraries
-   **Wheel Component:** `@ncdai/wheel-picker`
    -   Installed via `shadcn` CLI.
    -   **Documentation:** [Getting Started](https://react-wheel-picker.chanhdai.com/docs/getting-started)
-   **Markdown Parser:** `markdown-it`
    -   Used to render Markdown body to HTML strings for the React component.
-   **Icons:** `lucide-react`
    -   Standard icon set for shadcn/ui components.

---

## v1: Project Initialization

### Goal
Establish the project foundation with a reproducible environment and configured frameworks.

### Implementation Details
1.  **Devenv Setup:**
    -   Create `development/devenv.nix` and `development/devenv.yaml`.
    -   Configure `languages.javascript` to use Node.js (LTS).
    -   Define shell hook: `npm install`.

2.  **Astro Setup:**
    -   Run `npm create astro@latest` inside `development`.
    -   Run `npx astro add react`.

3.  **Tailwind CSS v4 Setup:**
    -   Install dependencies: `npm install tailwindcss @tailwindcss/vite`.
    -   Install Typography plugin: `npm install -D @tailwindcss/typography`.
    -   **Configuration (`astro.config.mjs`):**
        -   Import `tailwindcss` from `@tailwindcss/vite`.
        -   Add `tailwindcss()` to the `vite.plugins` array.
    -   **CSS:** Create `src/styles/global.css` with content: `@import "tailwindcss";`.

4.  **Shadcn UI Initialization:**
    -   Run `npx shadcn@latest init`.
    -   This generates `components.json`, `src/lib/utils.ts` (or `src/utils.ts`), and base CSS variables.

5.  **TypeScript Configuration:**
    -   Set `strict: true` in `tsconfig.json`.
    -   Configure path alias: `@/*` mapping to `./src/*`.

6.  **Directory Structure:**
    ```text
    development/
    ├── src/
    │   ├── components/  # React and Astro components
    │   ├── layouts/     # Page layouts
    │   ├── pages/       # Astro routes
    │   ├── content/     # Markdown content
    │   ├── lib/         # Shadcn utils
    │   ├── utils/       # Helper functions (markdown parsing)
    │   └── styles/      # Global styles
    ├── public/
    ├── devenv.nix
    └── astro.config.mjs
    ```

---

## v2: Core Layout & Navigation (The Wheel)

### Goal
Implement the main visual structure, interactive wheel navigation, and deep linking.

### Implementation Details
1.  **Dependencies:**
    -   Install Icons: `npm install lucide-react`.

2.  **Layout Strategy:**
    -   **Desktop:** Split-screen layout.
        -   **Left (20%):** Navigation Wheel Container (`fixed` position).
        -   **Right (80%):** Content Viewer Container (`scrollable`).
    -   **Mobile:**
        -   **State:** A `isMenuOpen` boolean state.
        -   **View:** Full-screen content by default. A "Menu" button toggles the Wheel in a full-screen overlay modal.

3.  **Wheel Component Integration:**
    -   Install: `npx shadcn@latest add @ncdai/wheel-picker`.
    -   Create `src/components/WheelMenu.tsx`.
    -   Props: `items: { id: string, title: string }[]`, `onSelect: (id: string) => void`.
    -   Use the `WheelPicker` component from the library.
    -   Customize styling to match the "wheel" visual requirement (opacity/scale gradients are handled by the library).

4.  **Main Page (`index.astro`):**
    -   Create `src/components/PortfolioApp.tsx`.
    -   **State:** `activeSectionId`.
    -   **Deep Linking / Persistence:**
        -   Use `useEffect` to read `window.location.hash` on mount to set initial `activeSectionId`.
        -   Use `useEffect` to update `window.location.hash` whenever `activeSectionId` changes (e.g., `#topgolf`).
    -   Render `WheelMenu` and a placeholder `div` for content.
    -   Embed `PortfolioApp` in `index.astro` with `client:load`.

---

## v3: Content Engine

### Goal
Enable creating portfolio items using Markdown and feeding them into the application.

### Implementation Details
1.  **Astro Content Collections:**
    -   Create `src/content/config.ts`.
    -   Define `sections` collection.
    -   **Schema:**
        ```typescript
        z.object({
          title: z.string(),
          description: z.string(),
          order: z.number().default(999),
          published: z.boolean().default(false),
        })
        ```

2.  **Markdown Files:**
    -   **Constraint:** Do not overwrite or delete any existing content.
    -   Create `src/content/sections/sample.md`.
    -   Any other content is considered user-generated and should not be touched.
    -   **Image Handling:**
        -   **Rule:** Images must be stored in `public/` and referenced by absolute path (e.g., `/images/my-project.png`).
        -   Do not use relative paths (e.g., `./image.png`) as `markdown-it` will not resolve them through the Vite pipeline.

3.  **HTML Generation:**
    -   Install `markdown-it`: `npm install markdown-it @types/markdown-it`.
    -   Create `src/utils/markdown.ts` exporting a function `renderMarkdown(content: string): string`.
    -   In `index.astro`:
        -   Fetch collection: `getCollection('sections')`.
        -   Map over items: `{ ...item.data, id: item.slug, html: renderMarkdown(item.body) }`.
        -   Pass this array to `PortfolioApp`.

---

## v4: Content Viewer & Rendering

### Goal
Display the selected content in the viewer area with proper formatting and transitions.

### Implementation Details
1.  **Content Viewer Component:**
    -   Create `src/components/SectionViewer.tsx`.
    -   Props: `html: string`, `title: string`.
    -   Render logic:
        ```tsx
        <div className="prose prose-lg prose-slate max-w-none">
          <h1>{title}</h1>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
        ```

2.  **Styling & Structure:**
    -   Apply `prose-img:rounded-xl prose-img:shadow-lg` for image styling.
    -   Ensure images default to `max-width: 100%` and `height: auto` via Tailwind prose.

3.  **Integration:**
    -   In `PortfolioApp.tsx`, find the active section from the data array based on `activeSectionId`.
    -   Pass the active section's HTML to `SectionViewer`.

---

## v5: Responsiveness & Polish

### Goal
Ensure the site works on all devices and looks professional.

### Implementation Details
1.  **Responsive Layout Implementation:**
    -   **Desktop (`md:flex`):** Show `WheelMenu` (w-1/3) and `SectionViewer` (w-2/3) side-by-side.
    -   **Mobile (default):**
        -   `WheelMenu` is hidden (`hidden`).
        -   `SectionViewer` is full width (`w-full`).
        -   Add a `FloatingActionButton` (bottom-right) using `lucide-react` icon to toggle a `Dialog` (shadcn/ui or custom) containing the `WheelMenu`.

2.  **Transitions:**
    -   Wrap `SectionViewer` content in a `div` with `className="transition-opacity duration-300"`.
    -   On selection change, briefly set opacity to 0, swap content, then opacity 1.

3.  **Metadata:**
    -   Create `src/components/BaseHead.astro`.
    -   Populate `<title>` and `<meta name="description">` from `site.json` (to be created in `src/data`).
