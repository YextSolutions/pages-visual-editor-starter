import { ComponentConfig, Fields } from "@measured/puck";
import { LocationStream } from "../types/autogen";
import { Section, sectionVariants } from "./atoms/section";
import {
  getDirections,
  GetDirectionsConfig,
  Link,
  Coordinate,
} from "@yext/pages-components";
import {
  resolveYextEntityField,
  useDocument,
  YextEntityField,
  YextEntityFieldSelector,
} from "@yext/visual-editor";
import "./index.css";
import "@yext/pages-components/style.css";
import { config } from "../templates/location";
import { CardProps } from "./Card";
import { Button, ButtonProps} from "./atoms/button"

export type GetDirectionsProps = {
  coordinate: YextEntityField<Coordinate>;
  getDirectionsProvider: GetDirectionsConfig["provider"];
  variant: ButtonProps["variant"];
  size: ButtonProps["size"];
  alignment: CardProps["alignment"];
}

const getDirectionsFields: Fields<GetDirectionsProps> = {
  coordinate: YextEntityFieldSelector<typeof config, Coordinate>({
    label: "Get Directions",
    filter: { types: ["type.coordinate"] },
  }),
  getDirectionsProvider: {
    label: "Maps Provider",
    type: "radio",
    options: [
      { label: "Google", value: "google" },
      { label: "Apple", value: "apple" },
      { label: "Bing", value: "bing" },
    ],
  },
  variant: {
    label: "Variant",
    type: "radio",
    options: [
      { label: "Primary", value: "primary" },
      { label: "Secondary", value: "secondary" },
      { label: "Outline", value: "outline" },
      { label: "Link", value: "link" },
    ],
  },
  size: {
    label: "Size",
    type: "radio",
    options: [
      { label: "Default", value: "defaut" },
      { label: "Small", value: "small" },
      { label: "Large", value: "large" },
      { label: "Icon", value: "icon" },
    ],
  },
  alignment: {
    label: "Align card",
    type: "radio",
    options: [
      { label: "Left", value: "items-start" },
      { label: "Center", value: "items-center" },
    ],
  },
};

const GetDirections = ({
  variant,
  size,
  alignment,
  coordinate: coordinateField,
  getDirectionsProvider,
}: GetDirectionsProps) => {
  const document = useDocument<LocationStream>();
  let coordinate = resolveYextEntityField<Coordinate>(document, coordinateField);
  if (!coordinate) {
   console.warn("yextDisplayCoordinate is not present in the stream");
  }

  const searchQuery = getDirections(
    undefined,
    undefined,
    undefined,
    { provider: getDirectionsProvider },
    coordinate,
  );

  return (
    <Section
      className={`flex flex-col justify-center components ${alignment} font-body-fontWeight text-body-fontSize text-body-color`}
    >
      <Button asChild variant={variant} size={size}>
        <Link 
          cta={{
            link: searchQuery,
            label: "Get Directions",
            linkType: "URL",
          }}
        />
      </Button>
    </Section>
  );
};

export const GetDirectionsComponent: ComponentConfig<GetDirectionsProps> = {
  fields: getDirectionsFields,
  defaultProps: {
    variant: "primary",
    size: "default",
    alignment: "items-start",
    getDirectionsProvider: "google",
    coordinate: {
      field: "yextDisplayCoordinate",
      constantValue: {
        latitude: 0,
        longitude: 0,
      },
    },
  },
  label: "Get Directions",
  render: (props) => <GetDirections {...props} />,
};
