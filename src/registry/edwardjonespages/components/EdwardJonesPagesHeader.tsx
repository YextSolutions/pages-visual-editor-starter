import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import {
  VisibilityWrapper,
  type YextComponentConfig,
  type YextFields,
} from "@yext/visual-editor";
import { AnalyticsScopeProvider, Link } from "@yext/pages-components";

type LinkItem = { label: string; link: string };

type EdwardJonesPagesHeaderProps = {
  brandName: string;
  navigation: LinkItem[];
  primaryCta: LinkItem;
  section: { backgroundColor: string; visibleOnLivePage: boolean };
};

const fields: YextFields<EdwardJonesPagesHeaderProps> = {
  brandName: { label: "Brand Name", type: "text" },
  navigation: {
    label: "Navigation",
    type: "array",
    arrayFields: {
      label: { label: "Label", type: "text" },
      link: { label: "Link", type: "text" },
    },
    defaultItemProps: { label: "New Link", link: "#" },
    getItemSummary: (item) => item.label,
  },
  primaryCta: {
    label: "Primary Call To Action",
    type: "object",
    objectFields: {
      label: { label: "Label", type: "text" },
      link: { label: "Link", type: "text" },
    },
  },
  section: {
    label: "Section",
    type: "object",
    objectFields: {
      backgroundColor: { label: "Background Color", type: "text" },
      visibleOnLivePage: {
        label: "Visible On Live Page",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
    },
  },
};

const Header: PuckComponent<EdwardJonesPagesHeaderProps> = (props) => (
  <VisibilityWrapper
    liveVisibility={props.section.visibleOnLivePage}
    isEditing={props.puck.isEditing}
  >
    <AnalyticsScopeProvider name="EdwardJonesPagesHeader">
      <header
        className="border-b border-black/10 px-6 py-5 text-slate-950 md:px-10"
        style={{ backgroundColor: props.section.backgroundColor }}
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5">
          <a className="text-xl font-bold tracking-tight" href="#top">
            {props.brandName}
          </a>
          <nav aria-label="Primary navigation" className="flex flex-wrap items-center gap-5 text-sm font-semibold">
            {props.navigation.map((item, index) => (
              <Link key={`${item.label}-${index}`} cta={{ link: item.link, linkType: "URL" }} eventName={`headerLink${index}`}>
                {item.label}
              </Link>
            ))}
            <Link className="rounded-full bg-[#006b54] px-5 py-2.5 text-white" cta={{ link: props.primaryCta.link, linkType: "URL" }} eventName="primaryCta">
              {props.primaryCta.label}
            </Link>
          </nav>
        </div>
      </header>
    </AnalyticsScopeProvider>
  </VisibilityWrapper>
);

export const EdwardJonesPagesHeader: YextComponentConfig<EdwardJonesPagesHeaderProps> = {
  label: "Header",
  fields,
  defaultProps: {
    brandName: "Edward Jones",
    navigation: [
      { label: "Why Edward Jones", link: "#why" },
      { label: "Our Approach", link: "#approach" },
      { label: "Resources", link: "#resources" },
    ],
    primaryCta: { label: "Find an Advisor", link: "#contact" },
    section: { backgroundColor: "#ffffff", visibleOnLivePage: true },
  },
  render: (props) => <Header {...props} />,
};
