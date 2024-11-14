import { ComponentConfig, Fields } from "@measured/puck";
import { ImageType, Image, LexicalRichText } from "@yext/pages-components";
import { useDocument, YextEntityField } from "@yext/visual-editor";
import { CTAProps } from "./cta";

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
}

interface BlogsProps {
  layout: "Layout 1" | "Layout 2";
}

const defaults: Fields<BlogsProps> = {
  layout: {
    label: "Blog Layout",
    type: "radio",
    options: [
      { label: "Layout 1", value: "Layout 1" },
      { label: "Layout 2", value: "Layout 2" },
    ],
  },
};

const BlogsSelector = ({ layout }: BlogsProps) => {
  const { c_relatedBlogs: relatedBlogs } = useDocument<any>();
  return <BlogsLayout linkedArticles={relatedBlogs} layoutType={layout} />;
};

const Blogs: ComponentConfig<BlogsProps> = {
  fields: defaults,
  defaultProps: {
    layout: "Layout 1",
  },
  render: (props) => <BlogsSelector {...props} />,
};

export { Blogs, BlogsProps };

const BlogsLayout = ({ linkedArticles, layoutType }: BlogsCardProps) => (
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
          From the blog
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          Learn how to grow your business with our expert advice.
        </p>
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
