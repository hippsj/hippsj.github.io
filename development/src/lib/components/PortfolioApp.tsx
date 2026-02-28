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

export interface UserSocial {
  title: string;
  url: string;
}

export interface UserInfo {
  userName: string;
  jobTitle: string;
  userEmail: string;
  userSocials: UserSocial[];
}

export interface SiteInfo {
  siteTitle: string;
  siteDescription: string;
  emptyStateMessage: string;
}

export interface PortfolioAppProps {
  sections: Section[];
  user: UserInfo;
  site: SiteInfo;
  initialSectionId?: string;
}

export function PortfolioApp({
  sections,
  user,
  site,
  initialSectionId,
}: PortfolioAppProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>(initialSectionId || "");
  const [wheelActiveId, setWheelActiveId] = useState<string>(initialSectionId || "");
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        setWheelActiveId(nextId);
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
      setWheelActiveId(id);
      setIsMenuOpen(false);
    },
    [activeSectionId, sections],
  );

  const handleItemClick = useCallback(
    (id: string) => {
      if (id !== activeSectionId) {
        const currentIndex = sections.findIndex((s) => s.id === activeSectionId);
        const nextIndex = sections.findIndex((s) => s.id === id);

        if (currentIndex !== -1 && nextIndex !== -1) {
          setDirection(nextIndex > currentIndex ? "up" : "down");
        }
        setActiveSectionId(id);
      }
      setIsMenuOpen(false);
    },
    [activeSectionId, sections],
  );

  const handleNext = useCallback(
    (id: string) => {
      // Immediately update content state for responsiveness
      if (id !== activeSectionId) {
        const currentIndex = sections.findIndex((s) => s.id === activeSectionId);
        const nextIndex = sections.findIndex((s) => s.id === id);

        if (currentIndex !== -1 && nextIndex !== -1) {
          setDirection(nextIndex > currentIndex ? "up" : "down");
        }
        setActiveSectionId(id);
      }

      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      const containerSelector = isDesktop ? "aside" : "header";
      const selector = `${containerSelector} [data-wheel-item-id="${id}"]`;
      const element = document.querySelector(selector) as HTMLElement;

      if (element) {
        const rect = element.getBoundingClientRect();
        const clientX = rect.left + rect.width / 2;
        const clientY = rect.top + rect.height / 2;

        // Dispatch mousedown and mouseup to trigger the WheelPicker's internal logic
        const mousedownEvent = new MouseEvent("mousedown", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX,
          clientY,
        });
        const mouseupEvent = new MouseEvent("mouseup", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX,
          clientY,
        });

        element.dispatchEvent(mousedownEvent);
        element.dispatchEvent(mouseupEvent);
      } else {
        // Fallback: update wheel state manually if element not found
        setWheelActiveId(id);
      }
    },
    [activeSectionId, sections],
  );

  const menuItems = useMemo(
    () => sections.map((s) => ({ id: s.id, title: s.title })),
    [sections],
  );

  const activeSection = sections.find((s) => s.id === activeSectionId);
  const activeSectionIndex = sections.findIndex((s) => s.id === activeSectionId);
  const nextSection =
    activeSectionIndex !== -1 && activeSectionIndex < sections.length - 1
      ? sections[activeSectionIndex + 1]
      : null;

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
        duration: 1,
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
      <header className="flex flex-row justify-between items-center z-40 bg-nav-bg border-b border-nav-border md:hidden shrink-0 p-4">
        {/* Hamburger Menu Button */}
        <button onClick={() => setIsMenuOpen(true)} className="p-2 -ml-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Centered Name/Title */}
        <Magnetic strength={0.1}>
          <a href="/" className="text-center cursor-pointer relative z-50 block px-4">
            <h1 className="text-2xl font-bold tracking-tight text-nav-foreground whitespace-nowrap">
              {user.userName}
            </h1>
            <h2 className="text-xs tracking-tight text-nav-foreground/80 whitespace-nowrap">
              {user.jobTitle}
            </h2>
          </a>
        </Magnetic>

        {/* Spacer to keep title centered */}
        <div className="w-10 h-10" />
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 w-full h-full bg-nav-bg z-50 flex flex-col md:hidden"
          >
            {/* Top Bar with Close Button */}
            <div className="flex justify-between items-center shrink-0 p-4 border-b border-nav-border/30">
              {/* Spacer */}
              <div className="w-10 h-10" />
              <Magnetic strength={0.1}>
                <a
                  href="/"
                  className="text-center cursor-pointer relative z-50 block px-4"
                >
                  <h1 className="text-2xl font-bold tracking-tight text-nav-foreground whitespace-nowrap">
                    {user.userName}
                  </h1>
                </a>
              </Magnetic>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 -mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Vertical Wheel Menu */}
            <div className="flex-1 overflow-hidden relative flex items-center justify-center">
              <WheelMenu
                items={menuItems}
                onSelect={handleSelect}
                onItemClick={handleItemClick}
                selectedId={wheelActiveId}
              />
            </div>

            {/* Footer with Socials */}
            <div className="p-8 pt-0 mx-auto text-center">
              <div className="flex gap-4 text-base items-center justify-center">
                {user.userSocials.map((social) => (
                  <Magnetic key={social.title} strength={0.15}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-nav-foreground/80 hover:text-nav-foreground p-2 block"
                    >
                      {social.title}
                    </a>
                  </Magnetic>
                ))}
                {user.userEmail && (
                  <Magnetic strength={0.15}>
                    <a
                      href={`mailto:${user.userEmail}`}
                      className="text-nav-foreground/80 hover:text-nav-foreground p-2 block"
                    >
                      Email
                    </a>
                  </Magnetic>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex md:flex-col md:w-[25vw] min-w-[300px] border border-nav-border bg-nav-bg shrink-0">
        <div className="p-8 pb-0 flex justify-center">
          <Magnetic strength={0.1}>
            <a href="/" className="text-center cursor-pointer relative z-50 block px-4">
              <h1 className="text-3xl font-bold tracking-tight text-nav-foreground whitespace-nowrap">
                {user.userName}
              </h1>
              <h2 className="text-base tracking-tight text-nav-foreground/80 whitespace-nowrap">
                {user.jobTitle}
              </h2>
            </a>
          </Magnetic>
        </div>

        <div className="flex-1 overflow-hidden relative flex items-center justify-center">
          <WheelMenu
            items={menuItems}
            onSelect={handleSelect}
            onItemClick={handleItemClick}
            selectedId={wheelActiveId}
          />
        </div>

        <div className="p-8 pt-0 mx-auto text-center">
          <div className="flex gap-4 text-base items-center justify-center">
            {user.userSocials.map((social) => (
              <Magnetic key={social.title} strength={0.15}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-nav-foreground/80 hover:text-nav-foreground p-2 block"
                >
                  {social.title}
                </a>
              </Magnetic>
            ))}
            {user.userEmail && (
              <Magnetic strength={0.15}>
                <a
                  href={`mailto:${user.userEmail}`}
                  className="text-nav-foreground/80 hover:text-nav-foreground p-2 block"
                >
                  Email
                </a>
              </Magnetic>
            )}
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
                nextSection={
                  nextSection
                    ? { id: nextSection.id, title: nextSection.title }
                    : undefined
                }
                onNext={handleNext}
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
              <p className="opacity-60">{site.emptyStateMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
