import { Image, ImageType, Link, CTA } from "@yext/pages-components";
import { MaybeLink } from "./MaybeLink";
import "./components.css";

const navigation: CTA[] = [
  { link: "/", label: "Home" },
  { link: "/", label: "About" },
];
const logo: ImageType = {
  url: "https://cdn.fs.brandfolder.com/cache=expiry:604800/deY3VGFpSjC761Abjbfc",
  width: 10,
  height: 10,
};

const Header = () => {
  return <HeaderLayout links={navigation} logo={logo} />;
};

type HeaderLayoutProps = {
  links: CTA[];
  logo?: ImageType;
  logoLink?: string;
};

const HeaderLayout = (props: HeaderLayoutProps) => {
  const { logo, logoLink, links } = props;

  return (
    <header className="header container">
      {logo && <HeaderLogo logo={logo} logoLink={logoLink} />}
      <HeaderLinks links={links} />
    </header>
  );
};

const HeaderLogo = (props: { logo: ImageType; logoLink?: string }) => {
  return (
    <MaybeLink href={props.logoLink}>
      <div className="header-logo">
        <Image image={props.logo} layout="fill" />
      </div>
    </MaybeLink>
  );
};

const HeaderLinks = (props: { links: CTA[] }) => {
  return (
    <div className="header-links">
      <ul className="link">
        {props.links.map((item: CTA, idx) => (
          <li key={item.label}>
            <Link cta={item} eventName={`link${idx}`} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export { Header };
