import { ImageType, Link, CTA } from "@yext/pages-components";
import logo from "../assets/logo.png";

const navigation: CTA[] = [
  { link: "/", label: "Restaurants" },
  { link: "/", label: "Blog" },
  { link: "/", label: "Support" },
];

const Header = () => {
  return <HeaderLayout links={navigation} logo={logo} />;
};

type HeaderLayoutProps = {
  links: CTA[];
  logo?: ImageType;
  logoLink?: string;
};

const HeaderLayout = (props: HeaderLayoutProps) => {
  const { logo } = props;

  return (
    <header className=" w-full bg-white">
      <div className="mx-auto flex max-w-6xl flex-1 items-center justify-between px-4 py-6">
        <img src={logo} height={47} width={40} />
        <div className="flex items-center justify-end space-x-4">
          <ul className="flex space-x-8">
            {props.links.map((item: CTA, idx) => (
              <li
                key={item.label}
                className="cursor-pointer font-bold text-[#1B78D0] hover:text-[#073866] "
              >
                <Link cta={item} eventName={`link${idx}`} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

export { Header };
