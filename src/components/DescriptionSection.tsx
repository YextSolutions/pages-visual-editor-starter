import { ComponentConfig, Fields } from "@measured/puck";
import {
  resolveYextEntityField,
  useDocument,
  YextEntityField,
  YextEntityFieldSelector,
} from "@yext/visual-editor";

interface DescriptionProps {
  title: YextEntityField<string>;
  description: YextEntityField<string>;
}

const defaults: Fields<DescriptionProps> = {
  //@ts-ignore
  title: YextEntityFieldSelector<typeof config>({
    label: "Heading",
    filter: { types: ["type.string"] },
  }),
  //@ts-ignore
  description: YextEntityFieldSelector<typeof config>({
    label: "Description",
    filter: { types: ["type.string"] },
  }),
};

const DescriptionSectionCard = ({
  title: titleField,
  description: descriptionField,
}: DescriptionProps) => {
  const document = useDocument();
  const title = resolveYextEntityField<string>(document, titleField);
  const description = resolveYextEntityField<string>(
    document,
    descriptionField
  );
  return (
    <section className="bg-white md:text-center w-full py-12">
      <article className="centered-container flex flex-col md:justify-center px-5 md:px-44 w-full mx-auto items-center">
        <h2 className="sr-only">About {title}</h2>
        <h2 className="text-2xl md:text-4xl font-bold my-4 mx-auto text-center">
          About {title}
        </h2>
        <p className=" md:text-lg">{description}</p>
      </article>
    </section>
  );
};

const DescriptionSection: ComponentConfig<any> = {
  fields: defaults,
  defaultProps: {
    title: "Hi",
    description: "Hi",
  },
  render: (props) => <DescriptionSectionCard {...props} />,
};

export { DescriptionSection, DescriptionProps };
