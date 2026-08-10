// @ts-nocheck
import { FaPhone } from "react-icons/fa";
import { CTA } from "./cta";
import { Body } from "./body";
import { parsePhoneNumber } from "awesome-phonenumber";
import { ThemeColor } from "@yext/visual-editor/section-library-support";
import {
  getBackgroundColorClasses,
  getBackgroundColorStyle,
} from "@yext/visual-editor/section-library-support";

export type PhoneAtomProps = {
  phoneNumber: string;
  label?: string;
  eventName?: string;
  backgroundColor?: ThemeColor;
  format: "domestic" | "international" | undefined;
  includeHyperlink: boolean;
  includeIcon: boolean;
  linkColor?: ThemeColor;
  onClick?: () => void;
};

export const PhoneAtom = (props: PhoneAtomProps) => {
  const formattedPhoneNumber = formatPhoneNumber(
    props.phoneNumber,
    props.format
  );

  // If a custom click handler is provided, the phone number doesn't get
  // link-ified in the pages-components Link component, so we have to
  // preemptively format it for tel: links here.
  const phoneNumberLink = props.onClick
    ? sanitizePhoneForTelHref(props.phoneNumber)
    : props.phoneNumber;

  return (
    <div className={"components flex gap-2 items-center"}>
      {props.includeIcon &&
        (props.backgroundColor ? (
          <div
            className={`h-10 w-10 flex justify-center rounded-full items-center ${getBackgroundColorClasses(
              props.backgroundColor
            )}`}
            style={getBackgroundColorStyle(props.backgroundColor)}
          >
            <FaPhone className="w-4 h-4" />
          </div>
        ) : (
          <FaPhone className="w-4 h-4" />
        ))}
      {props.label && <Body className="font-bold">{props.label}</Body>}
      {props.includeHyperlink ? (
        <CTA
          link={phoneNumberLink}
          label={formattedPhoneNumber}
          linkType="PHONE"
          normalizeLink={false}
          variant="link"
          eventName={props.eventName}
          color={props.linkColor}
          onClick={props.onClick}
          alwaysHideCaret={true}
        />
      ) : (
        <Body>{formattedPhoneNumber}</Body>
      )}
    </div>
  );
};

/*
 * formatPhoneNumber formats a phone number into one of the following forms,
 * depending on whether format is set to domestic or international:
 * (123) 456-7890 or +1 (123) 456-7890. A variety of 1-3 digit international
 * codes are accepted. If formatting fails, the original string is returned.
 */
export const formatPhoneNumber = (
  phoneNumberString: string,
  format: string = "domestic"
): string => {
  // Remove any '+' that is not the leading character and strip non-digits.
  const cleanedPhoneNumberString = phoneNumberString.replace(
    /(?!^\+)\+|[^\d+]/g,
    ""
  );

  const parsedPhoneNumber = parsePhoneNumber(cleanedPhoneNumberString);
  if (!parsedPhoneNumber.valid || parsedPhoneNumber.number === undefined) {
    return phoneNumberString;
  }

  return format === "international"
    ? parsedPhoneNumber.number.international
    : parsedPhoneNumber.number.national;
};

/**
 * sanitizePhoneForTelHref formats a phone number string for use in a tel: link.
 * It keeps only digits and at most one leading plus. If the input already starts with "tel:", it returns it as-is.
 * @param rawPhone The raw phone number string.
 * @returns A sanitized tel: link string or undefined if input is invalid.
 */
function sanitizePhoneForTelHref(rawPhone?: string): string | undefined {
  if (!rawPhone) {
    return undefined;
  }
  if (rawPhone.startsWith("tel:")) {
    return rawPhone;
  }

  // Remove any '+' that is not the leading character and strip non-digits.
  const cleaned = rawPhone.replace(/(?!^\+)\+|[^\d+]/g, "");
  return `tel:${cleaned}`;
}
