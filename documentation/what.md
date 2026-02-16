# Business and Functional Requirements

## 1. Business Requirements

### 1.1. Purpose and Goals
The primary purpose of this website is to serve as a professional digital portfolio for **Jordin Hipps**. It aims to:
-   Showcase marketing expertise, specifically in storytelling, branding, and digital strategy.
-   Present case studies, proposals, and other professional artifacts in an engaging and accessible format.
-   Establish a strong personal brand identity.

### 1.2. Target Audience
-   Potential employers and recruiters in the marketing and digital strategy sectors.
-   Clients looking for marketing consultation or services.
-   Peers and professional network connections.

### 1.3. Key Business Values
-   **Simplicity:** The design should be minimalist to keep the focus on the content.
-   **Interactivity:** The site should offer a unique, memorable user experience that differentiates it from standard portfolios.
-   **Accessibility:** Contact information and social profiles must be easily accessible to facilitate networking.
-   **Modernity:** Clean, path-based URLs (no hashes) to ensure professional presentation and SEO friendliness.

---

## 2. Functional Requirements

### 2.1. Navigation System (The Wheel)
-   **Layout Variations:**
    -   **Desktop:** A vertical scroll menu displayed on the left side of the screen.
    -   **Mobile:** A horizontal scroll menu displayed within the sticky top header.
-   **Visual Feedback:** The menu items must exhibit a "wheel" behavior:
    -   Items closer to the center of the view should appear larger and fully opaque.
    -   Items further away should appear smaller, rotated, and semi-transparent.
-   **Interaction:**
    -   Users must be able to scroll through the list.
    -   **Discrete Movement:** Scrolling should feel controlled, snapping to the next option without excessive velocity-based "flying".
    -   **Interactive Feedback:** The cursor should change to a pointer when hovering over menu items to indicate interactivity.
    -   **Clean Aesthetic:** The selected item should not have a distinct background color or border, appearing seamless with the site background.
    -   Users must be able to click on any specific item to select it immediately.

### 2.2. Content Display Area
-   **Dynamic Content Loading:** The right side of the screen acts as a viewer for the selected project.
-   **Path-Based Routing:** The site must support clean paths (e.g., `/project-id`) for deep linking and navigation, rather than URL hashes.
-   **Markdown Rendering:** The viewer must receive content in Markdown format and display it as rendered HTML.
-   **Smooth Transitions:** When a user switches between projects, the content area should transition smoothly (e.g., fade out the old content and fade in the new) to provide a polished feel.
-   **Default State:** The root URL (`/`) should default to displaying the first available project.

### 2.3. User Interface Elements
-   **Persistent Branding:**
    -   The user's name ("Jordin Hipps") and professional title ("Social Media Marketer") must be persistently visible on all screen sizes.
    -   On desktop, this is located at the top of the sidebar; on mobile, it is centered in the top header.
-   **Footer/Contact:**
    -   Social media links (e.g., LinkedIn) must be available.
    -   A direct email link must be provided for inquiries.

### 2.4. Content Management
-   **Project Attributes:** Each portfolio item must support the following metadata:
    -   **Title:** The name of the project.
    -   **Description:** A brief summary.
    -   **Publication Status:** A flag to control whether the item is visible on the live site.
    -   **Order:** A numeric value to determine the sequence in which items appear in the navigation.

### 2.5. Responsive Design
-   **Device Compatibility:** The website must be accessible and intuitive on both large desktop screens and small mobile devices.
-   **Mobile UX:** On mobile devices, the layout shifts to a single-column view. The navigation wheel adapts into a horizontal format located directly beneath the branding in the sticky header, ensuring projects are always reachable without opening separate menus.