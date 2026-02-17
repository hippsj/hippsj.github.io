import React from "react";

export interface SectionViewerProps {
  title: string;
  description?: string;
  html: string;
}

export function SectionViewer({ title, description, html }: SectionViewerProps) {
  return (
    <div className="prose prose-lg max-w-none prose-headings:text-content-foreground prose-p:text-content-foreground/80 prose-a:text-content-foreground prose-strong:text-content-foreground prose-img:rounded-xl prose-img:shadow-lg transition-colors">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-8 text-content-foreground">
        {title}
      </h1>
      {description && (
        <p className="text-xl text-content-foreground/60 mb-8 italic">{description}</p>
      )}
      <div
        className="text-content-foreground"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
