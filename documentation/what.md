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

---

## 2. Functional Requirements

### 2.1. Navigation System (The Wheel)
-   **Vertical Scroll Menu:** A list of portfolio projects (sections) must be displayed on the left side of the screen.
-   **Visual Feedback:** The menu items must exhibit a "wheel" behavior:
    -   Items closer to the center of the view should appear larger and fully opaque.
    -   Items further away should appear smaller, rotated, and semi-transparent.
-   **Interaction:**
    -   Users must be able to scroll through the list.
    -   Users must be able to click on any specific item to select it immediately.
    -   Upon selection (via scroll stop or click), the chosen item must automatically align to the center of the navigation area.

### 2.2. Content Display Area
-   **Dynamic Content Loading:** The right side of the screen acts as a viewer for the selected project.
-   **Markdown Rendering:** The viewer must receive content in Markdown format and display it as rendered HTML.
-   **Rich Media Support:** The viewer must support formatted text, headers, and images to effectively present case studies.
-   **Content Structure:** The layout must support content structured in 1-2 rows.
-   **Image Optimization:** Images must be sized for an optimal viewing experience, ensuring they are neither too large nor too small. Both horizontal and vertical images must adapt seamlessly to the layout.
-   **Smooth Transitions:** When a user switches between projects, the content area should transition smoothly (e.g., fade out the old content and fade in the new) to provide a polished feel.
-   **Default State:** Default content should be the first content available from the CDN. If no specific content is available, a friendly placeholder message should be displayed.

### 2.3. User Interface Elements
-   **Header:** The user's name ("Jordin Hipps") must be persistently visible, serving as the site branding.
-   **Footer/Contact:**
    -   Social media links (e.g., LinkedIn) must be available.
    -   A direct email link must be provided for inquiries.
    -   Hover effects should be used on interactive elements (links, buttons) to indicate interactivity.

### 2.4. Content Management
-   **Project Attributes:** Each portfolio item must support the following metadata:
    -   **Title:** The name of the project.
    -   **Description:** A brief summary.
    -   **Publication Status:** A flag to control whether the item is visible on the live site.
    -   **Order:** A numeric value to determine the sequence in which items appear in the navigation.

### 2.5. Responsive Design
-   **Device Compatibility:** The website must be accessible and intuitive on both large desktop screens and small mobile devices.
-   **Adaptive Layout:** The interface, including the navigation wheel and content viewer, must adapt to different screen sizes to ensure usability.