import { Link, CTA } from "@yext/pages-components";
import logo from "../assets/logo.png";
import "./index.css";

const navigation: CTA[] = [
  { link: "#", label: "Restaurants" },
  { link: "#", label: "Blog" },
  { link: "#", label: "Support" },
];

type HeaderProps = {
  isEditing: boolean;
};

const Header = (props: HeaderProps) => {
  const { isEditing } = props;
  return <HeaderLayout links={navigation} logo={logo} isEditing={isEditing} />;
};

type HeaderLayoutProps = {
  isEditing: boolean;
  links: CTA[];
  logo?: string;
  logoLink?: string;
};

const HeaderLayout = (props: HeaderLayoutProps) => {
  const { logo, isEditing } = props;

  return (
    <header className=" w-full bg-white components">
      <div className="mx-auto flex max-w-6xl flex-1 items-center justify-between px-4 py-6">
        {logo && <img src={logo} height={47} width={40} />}
        <div className="flex items-center justify-end space-x-4">
          <ul className="flex space-x-8">
            {props.links.map((item: CTA, idx) => (
              <li
                key={item.label?.toString()}
                className="cursor-pointer font-bold text-palette-primary hover:text-palette-secondary"
              >
                <Link
                  cta={item}
                  eventName={`link${idx}`}
                  style={{ pointerEvents: isEditing && "none" }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

export { Header };
