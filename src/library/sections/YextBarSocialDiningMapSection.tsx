import type { SectionConfig } from "@yext/visual-editor";

import type { PuckComponent } from "@puckeditor/core";
import {
  EntityField,
  MapboxStaticMapComponent,
  mapboxStaticMapStyleOptions,
  type ThemeColor,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  VisibilityWrapper,
  toPuckFields,
} from "@yext/visual-editor";
import type { Coordinate } from "@yext/pages-components";

type YextBarSocialDiningMapSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  map: {
    coordinate: YextEntityField<Coordinate>;
    mapStyle: string;
    zoom: number;
    height?: string;
  };
};

const YextBarSocialDiningMapSectionFields: YextFields<YextBarSocialDiningMapSectionProps> =
  {
    section: {
      label: "Section",
      type: "object",
      objectFields: {
        backgroundColor: {
          label: "Background Color",
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
        visibleOnLivePage: {
          label: "Visible on Live Page",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      },
    },
    map: {
      label: "Map",
      type: "object",
      objectFields: {
        coordinate: {
          type: "entityField",
          label: "Coordinates",
          filter: { types: ["type.coordinate"] },
        },
        mapStyle: {
          label: "Mapbox Map Style",
          type: "select",
          options: mapboxStaticMapStyleOptions,
        },
        zoom: {
          label: "Zoom",
          type: "number",
          min: 0,
          max: 22,
        },
      },
    },
  };

const YextBarSocialDiningMapSectionComponent: PuckComponent<
  YextBarSocialDiningMapSectionProps
> = (props) => {
  const sectionBackgroundColorToken =
    props.section.backgroundColor.selectedColor;
  const sectionBackgroundColor = !sectionBackgroundColorToken
    ? undefined
    : sectionBackgroundColorToken.startsWith("[") &&
        sectionBackgroundColorToken.endsWith("]")
      ? sectionBackgroundColorToken.slice(1, -1)
      : ((
          {
            white: "#ffffff",
            "palette-primary": "var(--colors-palette-primary)",
            "palette-secondary": "var(--colors-palette-secondary)",
            "palette-tertiary": "var(--colors-palette-tertiary)",
            "palette-quaternary": "var(--colors-palette-quaternary)",
            "palette-primary-contrast":
              "var(--colors-palette-primary-contrast)",
            "palette-secondary-contrast":
              "var(--colors-palette-secondary-contrast)",
            "palette-tertiary-contrast":
              "var(--colors-palette-tertiary-contrast)",
            "palette-quaternary-contrast":
              "var(--colors-palette-quaternary-contrast)",
            "palette-primary-light":
              "hsl(from var(--colors-palette-primary) h s 98)",
            "palette-secondary-light":
              "hsl(from var(--colors-palette-secondary) h s 98)",
            "palette-tertiary-light":
              "hsl(from var(--colors-palette-tertiary) h s 98)",
            "palette-quaternary-light":
              "hsl(from var(--colors-palette-quaternary) h s 98)",
            "palette-primary-dark":
              "hsl(from var(--colors-palette-primary) h s 20)",
            "palette-secondary-dark":
              "hsl(from var(--colors-palette-secondary) h s 20)",
          } as Record<string, string>
        )[sectionBackgroundColorToken] ?? sectionBackgroundColorToken);

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <section
        style={{
          backgroundColor: sectionBackgroundColor,
        }}
      >
        <style>{`
          .bar-social-dining-map-frame {
            height: 360px;
            overflow: hidden;
            position: relative;
            width: 100%;
          }

          .bar-social-dining-map-frame .mapbox-static-map-shell,
          .bar-social-dining-map-frame .mapbox-static-map-picture,
          .bar-social-dining-map-frame .mapbox-static-map-image {
            height: 100%;
            width: 100%;
          }

          .bar-social-dining-map-frame .mapbox-static-map-image {
            object-fit: cover;
            object-position: center;
          }

          @media (max-width: 768px) {
            .bar-social-dining-map-frame {
              height: 240px;
            }
          }
        `}</style>
        <EntityField
          displayName="Map Coordinates"
          fieldId={props.map.coordinate.field}
          constantValueEnabled={props.map.coordinate.constantValueEnabled}
        >
          <div className="bar-social-dining-map-frame">
            <MapboxStaticMapComponent
              coordinate={props.map.coordinate}
              id={props.id}
              mapStyle={props.map.mapStyle}
              zoom={props.map.zoom}
              height={props.map.height}
              puck={props.puck}
            />
          </div>
        </EntityField>
      </section>
    </VisibilityWrapper>
  );
};

export const YextBarSocialDiningMapSection: YextComponentConfig<YextBarSocialDiningMapSectionProps> =
  {
    label: "Map Section",
    fields: toPuckFields(YextBarSocialDiningMapSectionFields),
    defaultProps: {
      section: {
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "black",
        },
        visibleOnLivePage: true,
      },
      map: {
        coordinate: {
          field: "yextDisplayCoordinate",
          constantValue: {
            latitude: 0,
            longitude: 0,
          },
          constantValueEnabled: false,
        },
        mapStyle: "streets-v12",
        zoom: 10,
        height: "100%",
      },
    },
    render: (props) => <YextBarSocialDiningMapSectionComponent {...props} />,
  };

export const config: SectionConfig = {
  id: "YextBarSocialDiningMapSection",
  displayName: "Map Section",
  description: "Map Section",
  pageSetTypes: ["ENTITY"],
};
