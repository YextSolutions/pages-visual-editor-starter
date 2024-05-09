import { Link, CTA } from "@yext/pages-components";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const navigation: CTA[] = [
  { link: "/", label: "Link 1" },
  { link: "/", label: "Link 2" },
];

const Footer = () => {
  return (
    <FooterLayout
      copyrightMessage={"© 2024. All Rights Reserved."}
      youtube="https://www.youtube.com/"
      twitter="https://twitter.com/"
      linkedIn="https://www.linkedin.com/"
      facebook="https://www.facebook.com/"
      instagram="https://www.instagram.com/"
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
  const copyrightMessage = props.copyrightMessage;

  const socialLinks = [
    {
      name: "facebook",
      link: props.facebook,
      label: <FaFacebook className="social-icon" />,
    },
    {
      name: "instagram",
      link: props.instagram,
      label: <FaInstagram className="social-icon" />,
    },
    {
      name: "youtube",
      link: props.youtube,
      label: <FaYoutube className="social-icon" />,
    },
    {
      name: "linkedIn",
      link: props.linkedIn,
      label: <FaLinkedinIn className="social-icon" />,
    },
    {
      name: "twitter",
      link: props.twitter,
      label: <FaTwitter className="social-icon" />,
    },
  ].filter((link) => link.link);

  const footerLinks = props.footerLinks || [];

  return (
    <footer className="footer container">
      <div className="footer-top">
        <div className="links">
          {footerLinks.map((link, i) => (
            <Link className="link" key={i} cta={link} eventName={`link${i}`} />
          ))}
        </div>
        <div className="social-links">
          {socialLinks.map((socialLink, i) =>
            socialLink.link ? (
              <Link key={i} href={socialLink.link} eventName={socialLink.name}>
                {socialLink.label}
              </Link>
            ) : null
          )}
        </div>
      </div>
      <div className="copyright-msg">{copyrightMessage}</div>
    </footer>
  );
};

export { Footer };
