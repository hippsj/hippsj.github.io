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
}

export function PortfolioApp({ sections }: PortfolioAppProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Initialize active section from hash or default to first
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && sections.some((s) => s.id === hash)) {
        setActiveSectionId(hash);
      } else if (sections.length > 0 && !activeSectionId) {
        setActiveSectionId(sections[0].id);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [sections, activeSectionId]);

  // Update hash when active section changes
  useEffect(() => {
    if (activeSectionId) {
      const currentHash = window.location.hash.replace("#", "");
      if (currentHash !== activeSectionId) {
        window.location.hash = activeSectionId;
      }
    }
  }, [activeSectionId]);

  const handleSelect = useCallback((id: string) => {
    setActiveSectionId(id);
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
          <p className="text-sm text-muted-foreground">Portfolio</p>
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
