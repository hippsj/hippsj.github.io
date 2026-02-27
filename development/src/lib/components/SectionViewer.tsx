import React from "react";

export interface SectionViewerProps {
  title: string;
  description?: string;
  html: string;
  nextSection?: {
    id: string;
    title: string;
  };
  onNext?: (id: string) => void;
}

export function SectionViewer({
  title,
  description,
  html,
  nextSection,
  onNext,
}: SectionViewerProps) {
  return (
    <div className="prose prose-lg max-w-none prose-headings:text-content-foreground prose-p:text-content-foreground/80 prose-a:text-content-foreground prose-a:inline-block prose-strong:text-content-foreground prose-img:rounded-xl prose-img:shadow-lg transition-colors">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-8 text-content-foreground">
        {title}
      </h1>
      {description && (
        <p className="text-xl text-content-foreground/60 mb-8 italic">{description}</p>
      )}
      <div
        className="text-content-foreground [&_button]:inline-block"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {nextSection && onNext && (
        <div className="mt-16 w-full flex justify-center pt-8 border-t border-content-foreground/10">
          <button
            onClick={() => onNext(nextSection.id)}
            className="group flex flex-col items-center justify-center gap-2 text-xl font-medium text-content-foreground/60 hover:text-content-foreground transition-colors cursor-pointer"
          >
            <span>{nextSection.title}</span>
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
              className="shrink-0 transition-transform"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
