import { ComponentConfig, Fields } from "@measured/puck";
import { ImageType, Image, LexicalRichText } from "@yext/pages-components";
import {
  EntityField,
  resolveYextEntityField,
  useDocument,
  YextEntityField,
  YextEntityFieldSelector,
} from "@yext/visual-editor";
import { CTAProps } from "./cta";
import { toTitleCaseWithRules } from "../utils/reusableFunctions";

interface BlogsCardProps {
  linkedArticles: {
    c_primaryCTA: CTAProps;
    name: string;
    primaryPhoto: ImageType;
    datePosted: string;
    shortDescriptionV2: any;
    id: string;
    c_author?: string;
    c_category?: string;
    slug?: string;
  }[];
  layoutType: "Layout 1" | "Layout 2";
  sectionTitle: string;
  sectionDescription: string;
}

interface BlogsWithStaticDataProps {
  sectionTitle: string;
  sectionDescription: string;
  layout: "Layout 1" | "Layout 2";
  blogs: YextEntityField<any>;
}

const defaults: Fields<BlogsWithStaticDataProps> = {
  sectionTitle: {
    label: "Section Title",
    type: "text",
  },
  sectionDescription: {
    label: "Section Description",
    type: "textarea",
  },
  layout: {
    label: "Blog Layout",
    type: "radio",
    options: [
      { label: "Layout 1", value: "Layout 1" },
      { label: "Layout 2", value: "Layout 2" },
    ],
  },
  //@ts-expect-error
  blogs: YextEntityFieldSelector<typeof config>({
    label: "Blogs Field",
    filter: {
      types: ["type.entity_reference"],
      includeListsOnly: true,
      allowList: ["c_relatedBlogs"],
    },
  }),
};

const BlogsSelector = ({
  layout,
  blogs: blogsField,
  sectionTitle,
  sectionDescription,
}: BlogsWithStaticDataProps) => {
  const document = useDocument();
  const blogs = resolveYextEntityField<BlogsCardProps["linkedArticles"]>(
    document,
    blogsField
  );

  return (
    <>
      {blogs && (
        <EntityField fieldId="c_relatedBlogs">
          <BlogsLayout
            linkedArticles={blogs}
            layoutType={layout}
            sectionTitle={sectionTitle}
            sectionDescription={sectionDescription}
          />
        </EntityField>
      )}
    </>
  );
};

const BlogsWithStaticData: ComponentConfig<BlogsWithStaticDataProps> = {
  fields: defaults,
  defaultProps: {
    sectionTitle: "Sample title",
    sectionDescription: "Sample Description",
    layout: "Layout 1",
    blogs: {
      field: "c_relatedBlogs",
      constantValueEnabled: false,
      constantValue: [
        {
          id: "1",
          c_author: "Author",
          name: "Sample Blog 1",
          slug: "#",
          c_category: "Category Type",
          primaryPhoto: {
            url: "https://placehold.co/1200x800?text=Image placeholder",
            height: 800,
            width: 1200,
          },
          datePosted: "2020-03-16",
          shortDescriptionV2: {
            json: {
              root: {
                children: [
                  {
                    children: [
                      {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: "Sample Description",
                        type: "text",
                        version: 1,
                      },
                    ],
                    format: "",
                    indent: 0,
                    type: "paragraph",
                    version: 1,
                  },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "root",
                version: 1,
              },
            },
          },
          c_primaryCTA: {
            label: "CTA Label",
            link: "https://yext.com",
            linkType: "URL",
          },
        },
        {
          id: "2",
          c_author: "Author",
          name: "Sample Blog 1",
          slug: "#",
          c_category: "Category Type",
          primaryPhoto: {
            url: "https://placehold.co/1200x800?text=Image placeholder",
            height: 800,
            width: 1200,
          },
          datePosted: "2020-03-16",
          shortDescriptionV2: {
            json: {
              root: {
                children: [
                  {
                    children: [
                      {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: "Sample Description",
                        type: "text",
                        version: 1,
                      },
                    ],
                    format: "",
                    indent: 0,
                    type: "paragraph",
                    version: 1,
                  },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "root",
                version: 1,
              },
            },
          },
          c_primaryCTA: {
            label: "CTA Label",
            link: "https://yext.com",
            linkType: "URL",
          },
        },
        {
          id: "3",
          c_author: "Author",
          name: "Sample Blog 1",
          slug: "#",
          c_category: "Category Type",
          primaryPhoto: {
            url: "https://placehold.co/1200x800?text=Image placeholder",
            height: 800,
            width: 1200,
          },
          datePosted: "2020-03-16",
          shortDescriptionV2: {
            json: {
              root: {
                children: [
                  {
                    children: [
                      {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: "Sample Description",
                        type: "text",
                        version: 1,
                      },
                    ],
                    format: "",
                    indent: 0,
                    type: "paragraph",
                    version: 1,
                  },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "root",
                version: 1,
              },
            },
          },
          c_primaryCTA: {
            label: "CTA Label",
            link: "https://yext.com",
            linkType: "URL",
          },
        },
      ],
    },
  },
  render: (props) => <BlogsSelector {...props} />,
};

BlogsWithStaticData.label = "Blogs with Static Data";
export { BlogsWithStaticData, BlogsWithStaticDataProps };

const BlogsLayout = ({
  linkedArticles,
  layoutType,
  sectionTitle,
  sectionDescription,
}: BlogsCardProps) => (
  <section className="bg-white py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <header
        className={`mx-auto ${
          layoutType === "Layout 1"
            ? "max-w-2xl text-center"
            : "max-w-2xl lg:max-w-4xl"
        }`}
      >
        <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          {toTitleCaseWithRules(sectionTitle)}
        </h2>
        <p className="mt-2 text-lg text-gray-1200">{sectionDescription}</p>
      </header>
      <div
        className={`mt-16 ${
          layoutType === "Layout 1"
            ? "grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:max-w-none lg:grid-cols-3"
            : "space-y-20 lg:mt-20 lg:space-y-20"
        }`}
      >
        {linkedArticles.map((post) => (
          <article
            key={post.id}
            className={`${
              layoutType === "Layout 1"
                ? "flex flex-col items-start justify-between"
                : "flex flex-col gap-8 lg:flex-row"
            }`}
          >
            <div
              className={`relative ${
                layoutType === "Layout 1"
                  ? "w-full"
                  : "aspect-[16/9] lg:w-64 lg:shrink-0"
              }`}
            >
              <Image
                loading="lazy"
                image={post.primaryPhoto}
                className={`${
                  layoutType === "Layout 1"
                    ? "aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                    : "absolute inset-0 w-full h-full rounded-2xl bg-gray-50 object-cover"
                }`}
              />
              {layoutType === "Layout 1" && (
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              )}
            </div>
            <div className={`${layoutType === "Layout 1" ? "mt-8" : ""}`}>
              <time dateTime={post.datePosted} className="text-gray-500">
                {post.datePosted}
              </time>
              <h3 className="mt-3 text-lg font-semibold text-gray-900">
                <a href={post.slug}>{post.name}</a>
              </h3>
              <LexicalRichText
                serializedAST={JSON.stringify(post.shortDescriptionV2.json)}
              />
              <p className="mt-4 text-sm font-medium text-gray-900">
                {post.c_author}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
