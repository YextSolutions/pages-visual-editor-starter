import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { VisibilityWrapper, type YextComponentConfig, type YextFields } from "@yext/visual-editor";
import { AnalyticsScopeProvider, Link } from "@yext/pages-components";

type Action = { label: string; link: string };
type EdwardJonesPagesHeroProps = {
  eyebrow: string;
  heading: string;
  description: string;
  primaryCta: Action;
  secondaryCta: Action;
  section: { backgroundColor: string; visibleOnLivePage: boolean };
};

const fields: YextFields<EdwardJonesPagesHeroProps> = {
  eyebrow: { label: "Eyebrow", type: "text" },
  heading: { label: "Heading", type: "text" },
  description: { label: "Description", type: "textarea" },
  primaryCta: { label: "Primary Call To Action", type: "object", objectFields: { label: { label: "Label", type: "text" }, link: { label: "Link", type: "text" } } },
  secondaryCta: { label: "Secondary Call To Action", type: "object", objectFields: { label: { label: "Label", type: "text" }, link: { label: "Link", type: "text" } } },
  section: { label: "Section", type: "object", objectFields: { backgroundColor: { label: "Background Color", type: "text" }, visibleOnLivePage: { label: "Visible On Live Page", type: "radio", options: [{ label: "Yes", value: true }, { label: "No", value: false }] } } },
};

const Hero: PuckComponent<EdwardJonesPagesHeroProps> = (props) => (
  <VisibilityWrapper liveVisibility={props.section.visibleOnLivePage} isEditing={props.puck.isEditing}>
    <AnalyticsScopeProvider name="EdwardJonesPagesHero">
      <section id="top" className="px-6 py-20 text-white md:px-10 md:py-28" style={{ backgroundColor: props.section.backgroundColor }}>
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-emerald-200">{props.eyebrow}</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">{props.heading}</h1>
          </div>
          <div className="max-w-xl lg:pb-2">
            <p className="text-lg leading-8 text-white/85">{props.description}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link className="rounded-full bg-white px-6 py-3 font-bold text-[#004b3b]" cta={{ link: props.primaryCta.link, linkType: "URL" }} eventName="primaryCta">{props.primaryCta.label}</Link>
              <Link className="rounded-full border border-white/70 px-6 py-3 font-bold text-white" cta={{ link: props.secondaryCta.link, linkType: "URL" }} eventName="secondaryCta">{props.secondaryCta.label}</Link>
            </div>
          </div>
        </div>
      </section>
    </AnalyticsScopeProvider>
  </VisibilityWrapper>
);

export const EdwardJonesPagesHero: YextComponentConfig<EdwardJonesPagesHeroProps> = {
  label: "Hero",
  fields,
  defaultProps: {
    eyebrow: "Planning for what matters most",
    heading: "Your goals deserve a plan built around you.",
    description: "Work with a financial advisor who takes time to understand your priorities and helps you move forward with clarity.",
    primaryCta: { label: "Find an Advisor", link: "#contact" },
    secondaryCta: { label: "Explore Our Approach", link: "#approach" },
    section: { backgroundColor: "#004b3b", visibleOnLivePage: true },
  },
  render: (props) => <Hero {...props} />,
};

export const config: SectionConfig = {
  id: "EdwardJonesPagesHero",
  displayName: "Hero",
  description: "Hero",
  pageSetTypes: ["ENTITY"],
};
