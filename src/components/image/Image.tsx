import { ComponentConfig, Fields } from "@measured/puck";
import {
  EntityFieldType,
  YextEntityFieldSelector,
  resolveYextEntityField,
} from "@yext/visual-editor";
import { useDocument } from "@yext/pages/util";
import {
  ComplexImageType,
  ImageType,
  Image as YextImage,
} from "@yext/pages-components";
import { config } from "../../templates/location";

export type ImageProps = {
  image: EntityFieldType;
};

const headingTextFields: Fields<ImageProps> = {
  image: YextEntityFieldSelector<typeof config>({
    label: "Entity Field",
    filter: {
      types: ["type.image"],
    },
  }),
};

const Image = ({ image }: ImageProps) => {
  const document = useDocument();
  const resolvedImage = resolveYextEntityField(document, image);

  if (!resolvedImage) {
    return null;
  }

  if (typeof resolvedImage === "string") {
    return <img src={resolvedImage} alt="" />;
  } else {
    return <YextImage image={resolvedImage as ComplexImageType | ImageType} />;
  }
};

const ImageComponent: ComponentConfig<ImageProps> = {
  fields: headingTextFields,
  defaultProps: {
    image: {
      fieldName: "",
      staticValue: "https://placehold.co/640x360", // default constant value
    },
  },
  label: "Image",
  render: (props) => <Image {...props} />,
};

export { Image, ImageComponent, headingTextFields };