import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WheelMenu } from "./WheelMenu";
import { SectionViewer } from "./SectionViewer";

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
  const [direction, setDirection] = useState<"up" | "down">("up");

  // Sync state with URL path on mount and popstate (browser back/forward)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.split("/").filter(Boolean).pop();
      const nextId =
        path && sections.some((s) => s.id === path)
          ? path
          : initialSectionId || sections[0]?.id;

      if (nextId && nextId !== activeSectionId) {
        const currentIndex = sections.findIndex((s) => s.id === activeSectionId);
        const nextIndex = sections.findIndex((s) => s.id === nextId);

        // Recalculate direction for browser navigation
        if (currentIndex !== -1 && nextIndex !== -1) {
          setDirection(nextIndex > currentIndex ? "up" : "down");
        }
        setActiveSectionId(nextId);
      }
    };

    if (!initialSectionId) {
      handleLocationChange();
    }

    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, [sections, initialSectionId, activeSectionId]);

  // Update URL path when active section changes
  useEffect(() => {
    if (activeSectionId) {
      const currentPath = window.location.pathname.split("/").filter(Boolean).pop() || "";
      if (currentPath !== activeSectionId) {
        const firstId = sections[0]?.id || "";
        const newPath = activeSectionId === firstId ? "/" : `/${activeSectionId}`;
        window.history.pushState({ id: activeSectionId }, "", newPath);
      }
    }
  }, [activeSectionId, sections]);

  const handleSelect = useCallback(
    (id: string) => {
      if (id !== activeSectionId) {
        const currentIndex = sections.findIndex((s) => s.id === activeSectionId);
        const nextIndex = sections.findIndex((s) => s.id === id);

        if (currentIndex !== -1 && nextIndex !== -1) {
          setDirection(nextIndex > currentIndex ? "up" : "down");
        }
        setActiveSectionId(id);
      }
    },
    [activeSectionId, sections],
  );

  const menuItems = useMemo(
    () => sections.map((s) => ({ id: s.id, title: s.title })),
    [sections],
  );

  const activeSection = sections.find((s) => s.id === activeSectionId);

  // Animation Variants for separate entry/exit timing
  const variants = {
    enter: (direction: "up" | "down") => ({
      opacity: 0,
      y: direction === "up" ? 40 : -40,
    }),
    center: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.5, // Slower entry
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: (direction: "up" | "down") => ({
      opacity: 0,
      y: direction === "up" ? -40 : 40,
      transition: {
        duration: 0.01, // Near zero duration
        ease: "easeIn",
      },
    }),
  };

  return (
    <div className="relative flex flex-col md:flex-row h-screen max-h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Mobile Top Navigation */}
      <header className="flex flex-col z-50 bg-nav-bg border-b border-nav-border md:hidden shrink-0">
        <div className="py-4 text-center">
          <h1 className="text-xl font-bold tracking-tight text-nav-foreground">
            Jordin Hipps
          </h1>
          <h2 className="text-sm tracking-tight text-nav-foreground/80">
            Social Media Marketer
          </h2>
        </div>
        <div className="h-24 overflow-hidden relative flex items-center justify-center border-t border-nav-border/30">
          <WheelMenu
            items={menuItems}
            onSelect={handleSelect}
            selectedId={activeSectionId}
            isHorizontal={true}
          />
        </div>
      </header>

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden m-24 rounded-4xl md:flex md:flex-col md:w-64 border border-nav-border bg-nav-bg shrink-0">
        <div className="p-8 pb-0 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-nav-foreground">
            Jordin Hipps
          </h1>
          <h2 className="text-sm tracking-tight text-nav-foreground/80">
            Social Media Marketer
          </h2>
        </div>

        <div className="flex-1 overflow-hidden relative flex items-center justify-center">
          <WheelMenu
            items={menuItems}
            onSelect={handleSelect}
            selectedId={activeSectionId}
          />
        </div>

        <div className="p-8 pt-0 mx-auto text-center">
          <div className="flex gap-4 text-sm">
            <a
              href="#"
              className="text-nav-foreground/80 hover:text-nav-foreground transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="text-nav-foreground/80 hover:text-nav-foreground transition-colors"
            >
              Email
            </a>
          </div>
        </div>
      </aside>

      {/* Content Viewer Container (Using neutral defaults from CSS variables) */}
      <main className="flex-1 overflow-y-auto bg-content-bg text-content-foreground relative">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          {activeSection ? (
            <motion.div
              key={activeSection.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="container mx-auto md:mx-0 max-w-3xl px-6 py-12 md:py-24 min-h-full flex flex-col justify-center"
            >
              <SectionViewer
                title={activeSection.title}
                description={activeSection.description}
                html={activeSection.html || ""}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full items-center justify-center"
            >
              <p className="opacity-60">Select a project to begin.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
