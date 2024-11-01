import { ComponentConfig, Fields } from "@measured/puck";
import { LocationStream } from "../types/autogen";
import {
  getDirections,
  GetDirectionsConfig,
  Link,
  Coordinate,
} from "@yext/pages-components";
import { Section, sectionVariants } from "./atoms/section";
import {
  resolveYextEntityField,
  useDocument,
  YextEntityField,
  YextEntityFieldSelector,
} from "@yext/visual-editor";
import "./index.css";
import "@yext/pages-components/style.css";
import { CardProps } from "./Card";
import { VariantProps } from "class-variance-authority";
import { config } from "../templates/location";

export type GetDirectionsProps = {
  coordinate: YextEntityField<Coordinate>;
  getDirectionsProvider: GetDirectionsConfig["provider"];
  alignment: CardProps["alignment"];
  padding: VariantProps<typeof sectionVariants>["padding"];
};

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
  alignment: {
    label: "Align card",
    type: "radio",
    options: [
      { label: "Left", value: "items-start" },
      { label: "Center", value: "items-center" },
    ],
  },
  padding: {
    label: "Padding",
    type: "radio",
    options: [
      { label: "None", value: "none" },
      { label: "Small", value: "small" },
      { label: "Medium", value: "default" },
      { label: "Large", value: "large" },
    ],
  },
};

const GetDirections = ({
  alignment,
  padding,
  coordinate: coordinateField,
  getDirectionsProvider,
}: GetDirectionsProps) => {
  const document = useDocument<LocationStream>();
  let coordinate = resolveYextEntityField<Coordinate>(document, coordinateField);
  if (!coordinate) {
    coordinate = {latitude: 0, longitude: 0};
  }

  console.log(coordinate);
  
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
      padding={padding}
    >
      {searchQuery && (
              <Link
                cta={{
                  link: searchQuery,
                  label: "Get Directions",
                  linkType: "URL",
                }}
                target="_blank"
                className="font-bold text-primary underline hover:no-underline md:px-4;"
              />
            )}
    </Section>
  );
};

export const GetDirectionsComponent: ComponentConfig<GetDirectionsProps> = {
  fields: getDirectionsFields,
  defaultProps: {
    alignment: "items-start",
    padding: "none",
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
