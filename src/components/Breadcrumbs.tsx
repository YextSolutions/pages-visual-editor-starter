import { ReactNode } from "react";
import { HomeIcon } from "@heroicons/react/20/solid";
import { Link } from "@yext/pages-components";
import classNames from "classnames";
import { ComponentConfig } from "@measured/puck";

export interface BreadCrumbProps {
  name: string;
  slug?: string;
  breadcrumbs?: Array<BreadCrumbProps>;
  className?: string;
  separator?: ReactNode;
  baseUrl: string;
}

export interface BreadCrumbsProps {
  name?: any;
  breadcrumbs?: Array<BreadCrumbProps>;
  className?: string;
  separator?: ReactNode;
  baseUrl: string;
}

const Breadcrumb = (props: BreadCrumbProps) => {
  const { name, slug } = props;

  if (slug) {
    return (
      <Link href={slug}>
        <span className="font-bold hover:underline hover:cursor-pointer">
          {name}
        </span>
      </Link>
    );
  }

  return <span className="Breadcrumbs-label">{name}</span>;
};

const BreadCrumbs = (props: BreadCrumbsProps) => {
  const { breadcrumbs, className, separator = ">", baseUrl } = props;

  return (
    <nav className="section flex" aria-label="Breadcrumb">
      {breadcrumbs?.length && (
        <nav
          className={classNames("Breadcrumbs", className)}
          aria-label="Breadcrumb"
        >
          <ol className="flex space-x-4">
            {breadcrumbs.map(({ name, slug }, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              const isFirst = idx === 0;

              return (
                <li className="Breadcrumbs-item flex" key={idx}>
                  {isFirst ? (
                    <Breadcrumb
                      name={<HomeIcon className="h-5 w-5" aria-hidden="true" />}
                      slug={isLast ? "" : baseUrl + slug}
                      {...props}
                    />
                  ) : (
                    <Breadcrumb
                      name={name}
                      slug={isLast ? "" : baseUrl + slug}
                      {...props}
                    />
                  )}
                  {!isLast && <span className="pl-4">{separator}</span>}
                </li>
              );
            })}
          </ol>
        </nav>
      )}
    </nav>
  );
};

export default BreadCrumbs;