import { ComponentConfig } from "@measured/puck";
// import { cn } from "../../utils/cn";

import { Section } from "./Section";
import { ChevronUp } from "lucide-react";
import {
  FeaturedBlogs as FeaturedBlogsType,
  FinancialProfessionalStream,
} from "../types/autogen";
import { useDocument } from "../hooks/useDocument";
import { Image } from "@yext/pages-components";
import useScreenSizes from "../hooks/useScreenSizes";
import { backgroundColors } from "../puck/theme";
import { Skeleton } from "./ui/skeleton";
import useEnvironment from "../hooks/useEnvironment";

export type FeaturedBlogsProps = {
  sectionTitle: string;
  backgroundColor: string;
};

export const FeaturedBlogs: ComponentConfig<FeaturedBlogsProps> = {
  fields: {
    sectionTitle: {
      label: "Section Title",
      type: "text",
    },
    backgroundColor: {
      label: "Background Color",
      type: "select",
      options: backgroundColors,
    },
  },
  defaultProps: {
    sectionTitle: "Section",
    backgroundColor: "bg-white",
  },
  render: ({ sectionTitle, backgroundColor }) => {
    const insights: FeaturedBlogsType =
      useDocument<FinancialProfessionalStream>(
        (document) => document.c_insights
      );

    const blogs = insights?.blogs || [];
    const featuredBlog = insights?.blogs?.[0];
    const featuredImage = featuredBlog?.photoGallery?.[0];

    const { isMediumDevice } = useScreenSizes();

    const isEditor = useEnvironment();

    if (!insights) {
      if (isEditor) {
        return (
          <FeaturedBlogsSkeleton
            backgroundColor={backgroundColor}
            sectionTitle={sectionTitle}
          />
        );
      } else {
        return <></>;
      }
    }

    // TODO: add placeholder for null content value
    return (
      <Section className={backgroundColor}>
        <h2 className="text-center text-blue-950 text-[34px] font-bold mb-8">
          {sectionTitle}
        </h2>
        <div className="bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-12 px-6 sm:gap-y-16 lg:grid-cols-2 lg:px-8">
            <article className="mx-auto w-full max-w-2xl lg:mx-0 lg:max-w-lg">
              {featuredImage && (
                <div className="w-full">
                  <Image
                    className="object-cover rounded-2xl"
                    aspectRatio={isMediumDevice ? 2 / 1 : 16 / 9}
                    image={featuredImage}
                  />
                </div>
              )}
              <div className="flex mt-6">
                <span className="text-sm text-zinc-800">Category</span>
                <div className="border-r border-zinc-800 mx-2"></div>
                <time
                  dateTime={featuredBlog.datePosted}
                  className="block text-sm text-zinc-800"
                >
                  {featuredBlog.datePosted}
                </time>
              </div>
              <h2
                id="featured-post"
                className="mt-4 text-xl font-bold tracking-tight text-blue-950 sm:text-2xl"
              >
                {featuredBlog.name}
              </h2>
              <p className="mt-4  text-zinc-800">
                {featuredBlog.c_description}
              </p>
              <div className="mt-4 flex flex-col justify-between gap-6 sm:mt-8 sm:flex-row-reverse sm:gap-8 lg:mt-4 lg:flex-col">
                <div className="flex items-center">
                  <a
                    href={featuredBlog.landingPageUrl}
                    className="text-sm font-semibold text-blue-950 underline"
                    aria-describedby="featured-post"
                  >
                    Read more
                  </a>
                  <ChevronUp className="rotate-90 ml-1" />
                </div>
              </div>
            </article>
            <div className="mx-auto w-full max-w-2xl border-t border-gray-900/10 pt-12 sm:pt-16 lg:mx-0 lg:max-w-none lg:border-t-0 lg:pt-0">
              <div className="-my-12 divide-y divide-gray-900/10">
                {blogs.slice(1).map((blog) => (
                  <article key={blog.name} className="py-8">
                    <div className="group relative max-w-xl">
                      <div className="flex">
                        <span className="text-sm text-zinc-800">Category</span>
                        <div className="border-r border-zinc-800 mx-2"></div>
                        <time
                          dateTime={blog.datePosted}
                          className="block text-sm text-zinc-800"
                        >
                          {blog.datePosted}
                        </time>
                      </div>
                      <h2 className="mt-2 text-lg font-semibold text-blue-950 group-hover:text-zinc-800">
                        <a href={blog.landingPageUrl}>
                          <span className="absolute inset-0" />
                          {blog.name}
                        </a>
                      </h2>
                      <p className="mt-4 text-sm leading-6 text-zinc-800">
                        {blog.c_description}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-col justify-between gap-6 sm:mt-8 sm:flex-row-reverse sm:gap-8 lg:mt-4 lg:flex-col">
                      <div className="flex items-center">
                        <a
                          href={blog.landingPageUrl}
                          className="text-sm font-semibold text-blue-950 underline"
                          aria-describedby="featured-post"
                        >
                          Read more
                        </a>
                        <ChevronUp className="rotate-90 ml-1" />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>
    );
  },
};

interface FeaturedBlogsSkeletonProps {
  sectionTitle: string;
  backgroundColor: string;
}

const FeaturedBlogsSkeleton = ({
  sectionTitle,
  backgroundColor,
}: FeaturedBlogsSkeletonProps) => {
  return (
    <Section className={backgroundColor}>
      <h2 className="text-center text-blue-950 text-[34px] font-bold mb-8">
        {sectionTitle}
      </h2>
      <div className="bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-12 px-6 sm:gap-y-16 lg:grid-cols-2 lg:px-8">
          <article className="mx-auto w-full max-w-2xl lg:mx-0 lg:max-w-lg">
            <Skeleton className="w-full h-[200px]" />
            <div className="flex mt-6">
              <Skeleton className="w-24 h-4" />
              <div className="mx-2 w-4 h-4 border-r border-zinc-800" />{" "}
              <Skeleton className="w-24 h-4" />
            </div>
            <Skeleton className="mt-4 h-8" />
            <Skeleton className="mt-2 h-6" />
          </article>
          <div className="mx-auto w-full max-w-2xl border-t border-gray-900/10 pt-12 sm:pt-16 lg:mx-0 lg:max-w-none lg:border-t-0 lg:pt-0">
            <div className="-my-12 divide-y divide-gray-900/10">
              {Array.from({ length: 3 }).map((_, idx) => (
                <article key={idx} className="py-8">
                  <div className="group relative max-w-xl">
                    <div className="flex">
                      <Skeleton className="w-24 h-4" />{" "}
                      <div className="mx-2 w-4 h-4 border-r border-zinc-800" />{" "}
                      <Skeleton className="w-24 h-4" />{" "}
                    </div>
                    <Skeleton className="mt-2 h-8" />{" "}
                    <Skeleton className="mt-4 h-6" />{" "}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
