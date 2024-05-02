const featuredPost = {
  id: 1,
  title: "We’re incredibly proud to announce we have secured $75m in Series B",
  href: "#",
  description:
    "Libero neque aenean tincidunt nec consequat tempor. Viverra odio id velit adipiscing id. Nisi vestibulum orci eget bibendum dictum. Velit viverra posuere vulputate volutpat nunc. Nunc netus sit faucibus.",
  date: "Mar 16, 2020",
  datetime: "2020-03-16",
  author: {
    name: "Michael Foster",
    href: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
};
const posts = [
  {
    id: 2,
    title: "Boost your conversion rate",
    href: "#",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel iusto corrupti dicta laboris incididunt.",
    date: "Mar 10, 2020",
    datetime: "2020-03-16",
    author: {
      name: "Lindsay Walton",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  // More posts...
];

import { ComponentConfig } from "@measured/puck";
// import { cn } from "../../utils/cn";

import { Section } from "./Section";
import { ChevronUp } from "lucide-react";

export type FeaturedBlogsProps = {
  sectionTitle: string;
};

export const FeaturedBlogs: ComponentConfig<FeaturedBlogsProps> = {
  fields: {
    sectionTitle: {
      label: "Section Title",
      type: "text",
    },
  },
  defaultProps: {
    sectionTitle: "Section",
  },
  render: ({ sectionTitle }) => {
    // TODO: add placeholder for null content value
    return (
      <Section>
        <h2 className="text-center text-blue-950 text-[34px] font-bold mb-8">
          {sectionTitle}
        </h2>
        <div className="bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-12 px-6 sm:gap-y-16 lg:grid-cols-2 lg:px-8">
            <article className="mx-auto w-full max-w-2xl lg:mx-0 lg:max-w-lg">
              <div className="flex">
                <span className="text-sm text-zinc-800">Category</span>
                <div className="border-r border-zinc-800 mx-2"></div>
                <time
                  dateTime={featuredPost.datetime}
                  className="block text-sm text-zinc-800"
                >
                  {featuredPost.date}
                </time>
              </div>
              <h2
                id="featured-post"
                className="mt-4 text-xl font-bold tracking-tight text-blue-950 sm:text-2xl"
              >
                {featuredPost.title}
              </h2>
              <p className="mt-4  text-zinc-800">{featuredPost.description}</p>
              <div className="mt-4 flex flex-col justify-between gap-6 sm:mt-8 sm:flex-row-reverse sm:gap-8 lg:mt-4 lg:flex-col">
                <div className="flex items-center">
                  <a
                    href={featuredPost.href}
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
                {posts.map((post) => (
                  <article key={post.id} className="py-12">
                    <div className="group relative max-w-xl">
                      <time
                        dateTime={post.datetime}
                        className="block text-sm leading-6 text-zinc-800"
                      >
                        {post.date}
                      </time>
                      <h2 className="mt-2 text-lg font-semibold text-blue-950 group-hover:text-zinc-800">
                        <a href={post.href}>
                          <span className="absolute inset-0" />
                          {post.title}
                        </a>
                      </h2>
                      <p className="mt-4 text-sm leading-6 text-zinc-800">
                        {post.description}
                      </p>
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
