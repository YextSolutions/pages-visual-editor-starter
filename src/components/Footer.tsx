import { Link, CTA } from "@yext/pages-components";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import logo from "../assets/logo-white.png"; // Adjust the path as needed
import "./index.css";

const navigation: CTA[] = [
  { link: "#", label: "Contact Us" },
  { link: "#", label: "Restaurants" },
  { link: "#", label: "Blog" },
  { link: "#", label: "Support" },
  { link: "#", label: "Careers" },
  { link: "#", label: "FAQs" },
];

const Footer = () => {
  return (
    <FooterLayout
      copyrightMessage={"All Rights Reserved."}
      youtube="#"
      twitter="#"
      linkedIn="#"
      facebook="#"
      instagram="#"
      footerLinks={navigation}
    />
  );
};

interface FooterLayoutProps {
  copyrightMessage: string;
  youtube?: string;
  linkedIn?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  footerLinks: CTA[];
}

const FooterLayout = (props: FooterLayoutProps) => {
  const {
    copyrightMessage,
    youtube,
    linkedIn,
    twitter,
    facebook,
    instagram,
    footerLinks,
  } = props;

  const socialLinks = [
    {
      name: "facebook",
      link: facebook,
      label: <FaFacebook size="24" className="text-white" />,
    },
    {
      name: "instagram",
      link: instagram,
      label: <FaInstagram size="24" className="text-white" />,
    },
    {
      name: "youtube",
      link: youtube,
      label: <FaYoutube size="24" className="text-white" />,
    },
    {
      name: "linkedIn",
      link: linkedIn,
      label: <FaLinkedinIn size="24" className="text-white" />,
    },
    {
      name: "twitter",
      link: twitter,
      label: <FaTwitter size="24" className="text-white" />,
    },
  ].filter((link) => link.link);

  return (
    <footer className="bg-foreground p-4 text-white components">
      <div className="mb-4 flex flex-col-reverse md:flex-row md:justify-between">
        <div className="flex flex-col space-y-4 pt-4 md:grid md:grid-cols-2 md:grid-rows-4 md:gap-y-4 md:space-y-0 md:pt-0">
          {footerLinks.map((link, i) => (
            <Link
              key={i}
              cta={link}
              className="font-bold hover:underline md:px-4"
              eventName={`link${i}`}
            />
          ))}
        </div>
        <div className="flex space-x-4 pb-4">
          {socialLinks.map((socialLink, i) =>
            socialLink.link ? (
              <Link
                key={i}
                href={socialLink.link}
                className="hover:text-gray-300"
              >
                {socialLink.label}
              </Link>
            ) : null,
          )}
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <img src={logo} height={47} width={40} />
        <span className="text-center text-sm">{copyrightMessage}</span>
      </div>
    </footer>
  );
};

export { Footer };
