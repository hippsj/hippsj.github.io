import React from "react";

export interface SectionViewerProps {
  title: string;
  description?: string;
  html: string;
}

export function SectionViewer({ title, description, html }: SectionViewerProps) {
  return (
    <div className="prose prose-lg prose-zinc dark:prose-invert max-w-none prose-img:rounded-xl prose-img:shadow-lg prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 transition-colors">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">{title}</h1>
      {description && (
        <p className="lead text-xl text-muted-foreground mb-8">{description}</p>
      )}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
