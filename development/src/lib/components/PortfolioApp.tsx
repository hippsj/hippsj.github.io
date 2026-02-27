import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { WheelMenu } from "./WheelMenu";
import { SectionViewer } from "./SectionViewer";
import { Magnetic } from "./ui/Magnetic";

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
  const mainContentRef = useRef<HTMLElement>(null);

  // Magnetic effect for content area links and buttons
  useEffect(() => {
    const main = mainContentRef.current;
    if (!main) return;

    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const elements = main.querySelectorAll("a, button");
        elements.forEach((el) => {
          const target = el as HTMLElement;
          const rect = target.getBoundingClientRect();

          // Ensure element is visible and has layout
          if (rect.width === 0 || rect.height === 0) return;

          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const distanceX = e.clientX - centerX;
          const distanceY = e.clientY - centerY;
          const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

          const range = 80; // Smaller activation range
          const strength = 0.2; // Weaker magnetism effect

          if (distance < range) {
            // Exponential pull: stronger when closer to the center
            const power = 1 - distance / range;
            const moveX = distanceX * strength * power;
            const moveY = distanceY * strength * power;

            target.style.transform = `translate(${moveX}px, ${moveY}px)`;
            target.style.transition = "transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)";
            target.style.display = "inline-block"; // Ensure transform works
          } else if (target.style.transform !== "translate(0px, 0px)") {
            target.style.transform = "translate(0px, 0px)";
            target.style.transition = "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)";
          }
        });
      });
    };

    const handleMouseLeave = () => {
      const elements = main.querySelectorAll("a, button");
      elements.forEach((el) => {
        const target = el as HTMLElement;
        target.style.transform = "translate(0px, 0px)";
        target.style.transition = "transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)";
      });
    };

    main.addEventListener("mousemove", handleMouseMove);
    main.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      cancelAnimationFrame(rafId);
      main.removeEventListener("mousemove", handleMouseMove);
      main.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [activeSectionId]);

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

  // Reset scroll position when active section changes
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [activeSectionId]);

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
  const variants: Variants = {
    enter: (direction: "up" | "down") => ({
      opacity: 0,
      y: direction === "up" ? 1000 : -1000,
    }),
    center: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 3,
        ease: [0.16, 1, 0.3, 1],
      } as any,
    },
    exit: (direction: "up" | "down") => ({
      opacity: 0,
      y: direction === "up" ? -20 : 20,
      transition: {
        duration: 0.01,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div className="relative flex flex-col md:flex-row h-screen max-h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Mobile Top Navigation */}
      <header className="flex flex-col z-50 bg-nav-bg border-b border-nav-border md:hidden shrink-0">
        <div className="py-4 flex justify-center">
          <Magnetic strength={0.1}>
            <a href="/" className="text-center cursor-pointer relative z-50 block px-4">
              <h1 className="text-xl font-bold tracking-tight text-nav-foreground">
                Jordin Hipps
              </h1>
              <h2 className="text-sm tracking-tight text-nav-foreground/80">
                Social Media Marketer
              </h2>
            </a>
          </Magnetic>
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
      <aside className="hidden md:flex md:flex-col md:w-64 border border-nav-border bg-nav-bg shrink-0">
        <div className="p-8 pb-0 flex justify-center">
          <Magnetic strength={0.1}>
            <a href="/" className="text-center cursor-pointer relative z-50 block px-4">
              <h1 className="text-2xl font-bold tracking-tight text-nav-foreground">
                Jordin Hipps
              </h1>
              <h2 className="text-sm tracking-tight text-nav-foreground/80">
                Social Media Marketer
              </h2>
            </a>
          </Magnetic>
        </div>

        <div className="flex-1 overflow-hidden relative flex items-center justify-center">
          <WheelMenu
            items={menuItems}
            onSelect={handleSelect}
            selectedId={activeSectionId}
          />
        </div>

        <div className="p-8 pt-0 mx-auto text-center">
          <div className="flex gap-4 text-sm items-center justify-center">
            <Magnetic strength={0.15}>
              <a
                href="#"
                className="text-nav-foreground/80 hover:text-nav-foreground p-2 block"
              >
                LinkedIn
              </a>
            </Magnetic>
            <Magnetic strength={0.15}>
              <a
                href="#"
                className="text-nav-foreground/80 hover:text-nav-foreground p-2 block"
              >
                Email
              </a>
            </Magnetic>
          </div>
        </div>
      </aside>

      {/* Content Viewer Container (Using neutral defaults from CSS variables) */}
      <main
        ref={mainContentRef}
        className="flex-1 overflow-y-auto bg-content-bg text-content-foreground relative md:pl-24"
      >
        <AnimatePresence mode="popLayout" initial={true} custom={direction}>
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
