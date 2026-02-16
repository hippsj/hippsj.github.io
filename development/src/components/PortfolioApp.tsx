import { useState, useEffect, useMemo, useCallback } from "react";
import { WheelMenu } from "./WheelMenu";
import { SectionViewer } from "./SectionViewer";
import { Menu, X } from "lucide-react";

export interface Section {
  id: string;
  title: string;
  html?: string;
  description?: string;
}

export interface PortfolioAppProps {
  sections: Section[];
  initialSectionId?: string;
}

export function PortfolioApp({ sections, initialSectionId }: PortfolioAppProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>(initialSectionId || "");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Sync state with URL path on mount and popstate (browser back/forward)
  useEffect(() => {
    const handleLocationChange = () => {
      // Get the last part of the path (e.g., /sample-1 -> sample-1)
      const path = window.location.pathname.split("/").filter(Boolean).pop();

      if (path && sections.some((s) => s.id === path)) {
        setActiveSectionId(path);
      } else if (sections.length > 0) {
        // Fallback to initial or first section if path is empty/invalid
        setActiveSectionId(initialSectionId || sections[0].id);
      }
    };

    // Only run on mount if we don't have an initialSectionId from Astro
    if (!initialSectionId) {
      handleLocationChange();
    }

    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, [sections, initialSectionId]);

  // Update URL path when active section changes (History API)
  useEffect(() => {
    if (activeSectionId) {
      const currentPath = window.location.pathname.split("/").filter(Boolean).pop() || "";
      if (currentPath !== activeSectionId) {
        const newPath =
          activeSectionId === (sections[0]?.id || "") ? "/" : `/${activeSectionId}`;
        window.history.pushState({ id: activeSectionId }, "", newPath);
      }
    }
  }, [activeSectionId, sections]);

  const handleSelect = useCallback((id: string) => {
    setActiveSectionId(id);
    setIsMenuOpen(false); // Close mobile menu on selection
  }, []);

  const menuItems = useMemo(
    () => sections.map((s) => ({ id: s.id, title: s.title })),
    [sections],
  );

  const activeSection = sections.find((s) => s.id === activeSectionId);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Mobile Menu Toggle */}
      <button
        className="fixed top-4 right-4 z-50 md:hidden p-2 rounded-full bg-primary text-primary-foreground shadow-lg"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle Menu"
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Navigation Wheel Container */}
      <div
        className={`
        fixed inset-0 z-40 flex flex-col bg-background/95 backdrop-blur-sm transition-transform duration-300 md:translate-x-0 md:static md:w-1/6 md:border-r md:border-border md:bg-card/50
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-8 pb-0 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Jordin Hipps</h1>
        </div>

        <div className="flex-1 overflow-hidden relative flex items-center justify-center">
          <WheelMenu
            items={menuItems}
            onSelect={handleSelect}
            selectedId={activeSectionId}
          />
        </div>

        <div className="p-8 pt-0 mx-auto text-center">
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              LinkedIn
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Email
            </a>
          </div>
        </div>
      </div>

      {/* Content Viewer Container */}
      <div className="h-full w-full md:w-5/6 overflow-y-auto bg-background transition-opacity duration-300">
        {activeSection ? (
          <div
            key={activeSection.id}
            className="container mx-auto max-w-3xl px-6 py-12 md:py-24 animate-fade-in"
          >
            <SectionViewer
              title={activeSection.title}
              description={activeSection.description}
              html={activeSection.html || ""}
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Select a project to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
