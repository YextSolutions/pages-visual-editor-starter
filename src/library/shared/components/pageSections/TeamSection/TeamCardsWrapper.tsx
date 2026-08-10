// @ts-nocheck
import { PuckComponent } from "@puckeditor/core";
import { PersonStruct } from "@yext/visual-editor/section-library-support";
import { msg } from "@yext/visual-editor/section-library-support";
import { CardContextProvider } from "@yext/visual-editor/section-library-support";
import { SlotMappedCardWrapperType } from "@yext/visual-editor/section-library-support";
import { defaultTeamCardSlotData, TeamCardProps } from "./TeamCard";
import { renderMappedEntityFieldEmptyState } from "../EntityFieldSectionEmptyState";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";
import { MappedEntityFieldConditionalRender } from "../entityFieldSectionUtils";
import { ThemeOptions } from "@yext/visual-editor/section-library-support";
import { createSlottedItemSource } from "@yext/visual-editor/section-library-support";

export const teamCardsSource = createSlottedItemSource<
  PersonStruct,
  TeamCardProps
>({
  label: msg("components.team", "Team"),
  itemLabel: "Team",
  cardName: "TeamCard",
  defaultItemProps: () => defaultTeamCardSlotData().props,
  mappingFields: {
    headshot: {
      type: "entityField",
      label: msg("fields.image", "Image"),
      filter: { types: ["type.image"] },
    },
    name: {
      type: "entityField",
      label: msg("fields.name", "Name"),
      filter: { types: ["type.string"] },
    },
    title: {
      type: "entityField",
      label: msg("fields.title", "Title"),
      filter: { types: ["type.string", "type.rich_text_v2"] },
    },
    phoneNumber: {
      type: "entityField",
      label: msg("fields.phone", "Phone"),
      filter: { types: ["type.phone"] },
    },
    email: {
      type: "entityField",
      label: msg("fields.email", "Email"),
      filter: { types: ["type.string"] },
    },
    cta: {
      type: "entityField",
      label: msg("fields.cta", "CTA"),
      filter: { types: ["type.cta"] },
    },
  },
});

export type TeamCardsWrapperProps = SlotMappedCardWrapperType<PersonStruct> & {
  styles: {
    showImage: boolean;
    showTitle: boolean;
    showPhone: boolean;
    showEmail: boolean;
    showCTA: boolean;
  };

  /** @internal */
  conditionalRender?: MappedEntityFieldConditionalRender;
};

const teamCardsWrapperFields: YextFields<TeamCardsWrapperProps> = {
  data: teamCardsSource.field,
  slots: {
    type: "object",
    objectFields: {
      CardSlot: { type: "slot" },
    },
    visible: false,
  },
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: {
      showImage: {
        label: msg("fields.showImage", "Show Image"),
        type: "radio",
        options: ThemeOptions.SHOW_HIDE,
      },
      showTitle: {
        label: msg("fields.showTitle", "Show Title"),
        type: "radio",
        options: ThemeOptions.SHOW_HIDE,
      },
      showPhone: {
        label: msg("fields.showPhone", "Show Phone"),
        type: "radio",
        options: ThemeOptions.SHOW_HIDE,
      },
      showEmail: {
        label: msg("fields.showEmail", "Show Email"),
        type: "radio",
        options: ThemeOptions.SHOW_HIDE,
      },
      showCTA: {
        label: msg("fields.showCTA", "Show CTA"),
        type: "radio",
        options: ThemeOptions.SHOW_HIDE,
      },
    },
  },
};

const TeamCardsWrapperComponent: PuckComponent<TeamCardsWrapperProps> = (
  props
) => {
  const { slots } = props;

  return (
    <CardContextProvider parentStyles={props.styles}>
      <slots.CardSlot
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center"
        allow={[]}
      />
    </CardContextProvider>
  );
};

export const TeamCardsWrapper: YextComponentConfig<TeamCardsWrapperProps> = {
  label: msg("components.teamCardsWrapper", "Team Cards"),
  fields: teamCardsWrapperFields,
  defaultProps: {
    ...teamCardsSource.defaultWrapperProps,
    styles: {
      showImage: true,
      showTitle: true,
      showPhone: true,
      showEmail: true,
      showCTA: true,
    },
  },
  resolveData: (data, params) =>
    teamCardsSource.populateSlots(data, params.metadata.streamDocument),
  render: (props) => {
    if (props.conditionalRender?.isMappedContentEmpty) {
      return renderMappedEntityFieldEmptyState(props.puck.isEditing);
    }

    return <TeamCardsWrapperComponent {...props} />;
  },
};
