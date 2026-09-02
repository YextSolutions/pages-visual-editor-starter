import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { VisibilityWrapper, type YextComponentConfig, type YextFields } from "@yext/visual-editor";
import { AnalyticsScopeProvider, Link } from "@yext/pages-components";

type Service = { title: string; description: string; linkLabel: string; link: string };
type EdwardJonesPagesServicesProps = {
  heading: string;
  intro: string;
  services: Service[];
  section: { backgroundColor: string; visibleOnLivePage: boolean };
  cardBackgroundColor: string;
};

const fields: YextFields<EdwardJonesPagesServicesProps> = {
  heading: { label: "Heading", type: "text" },
  intro: { label: "Introduction", type: "textarea" },
  services: { label: "Services", type: "array", arrayFields: { title: { label: "Title", type: "text" }, description: { label: "Description", type: "textarea" }, linkLabel: { label: "Link Label", type: "text" }, link: { label: "Link", type: "text" } }, defaultItemProps: { title: "Service", description: "Service description", linkLabel: "Learn More", link: "#" }, getItemSummary: (item) => item.title },
  cardBackgroundColor: { label: "Card Background Color", type: "text" },
  section: { label: "Section", type: "object", objectFields: { backgroundColor: { label: "Background Color", type: "text" }, visibleOnLivePage: { label: "Visible On Live Page", type: "radio", options: [{ label: "Yes", value: true }, { label: "No", value: false }] } } },
};

const Services: PuckComponent<EdwardJonesPagesServicesProps> = (props) => (
  <VisibilityWrapper liveVisibility={props.section.visibleOnLivePage} isEditing={props.puck.isEditing}>
    <AnalyticsScopeProvider name="EdwardJonesPagesServices">
      <section id="approach" className="px-6 py-20 text-slate-950 md:px-10" style={{ backgroundColor: props.section.backgroundColor }}>
        <div className="mx-auto max-w-7xl"><p className="max-w-2xl text-lg leading-8 text-slate-700">{props.intro}</p><h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">{props.heading}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">{props.services.map((service, index) => <article key={`${service.title}-${index}`} className="rounded-2xl p-7" style={{ backgroundColor: props.cardBackgroundColor }}><p className="text-sm font-bold text-[#006b54]">0{index + 1}</p><h3 className="mt-7 text-2xl font-semibold">{service.title}</h3><p className="mt-3 leading-7 text-slate-700">{service.description}</p><Link className="mt-7 inline-block font-bold text-[#005c48] underline decoration-2 underline-offset-4" cta={{ link: service.link, linkType: "URL" }} eventName={`serviceLink${index}`}>{service.linkLabel}</Link></article>)}</div>
        </div>
      </section>
    </AnalyticsScopeProvider>
  </VisibilityWrapper>
);

export const EdwardJonesPagesServices: YextComponentConfig<EdwardJonesPagesServicesProps> = {
  label: "Services", fields,
  defaultProps: { heading: "Advice for every chapter of life.", intro: "Financial decisions are personal. Start with the parts of your life that matter today, then build toward tomorrow.", services: [{ title: "Investing", description: "Build an investment approach that reflects your needs, timeline and comfort with risk.", linkLabel: "Explore investing", link: "#resources" }, { title: "Retirement", description: "Create a retirement strategy that gives your next chapter a stronger foundation.", linkLabel: "Plan for retirement", link: "#resources" }, { title: "Protection", description: "Help protect the people and plans you care about with thoughtful insurance considerations.", linkLabel: "Review protection", link: "#resources" }], cardBackgroundColor: "#f2f5f1", section: { backgroundColor: "#ffffff", visibleOnLivePage: true } },
  render: (props) => <Services {...props} />,
};
