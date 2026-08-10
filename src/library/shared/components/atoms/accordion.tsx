// @ts-nocheck
import React from "react";
import { themeManagerCn } from "@yext/visual-editor/section-library-support";

export const Accordion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function Accordion({ className = "", ...props }, ref) {
  return <div ref={ref} className={`flex flex-col ${className}`} {...props} />;
});

export const AccordionItem = React.forwardRef<
  HTMLDetailsElement,
  React.DetailsHTMLAttributes<HTMLDetailsElement>
>(function AccordionItem({ className = "", ...props }, ref) {
  return (
    <details
      ref={ref}
      className={themeManagerCn(
        "group border-b py-4 last:border-none",
        className
      )}
      {...props}
    />
  );
});

export const AccordionTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(function AccordionTrigger({ className = "", children, ...props }, ref) {
  return (
    <summary
      ref={ref}
      className={themeManagerCn(
        "flex cursor-pointer list-none items-center justify-between",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <svg
        className="ml-4 h-5 w-5 flex-shrink-0 transition-transform duration-300 group-open:rotate-180"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </summary>
  );
});

export const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function AccordionContent({ className = "", ...props }, ref) {
  return (
    <div ref={ref} className={themeManagerCn("pt-4", className)} {...props} />
  );
});
