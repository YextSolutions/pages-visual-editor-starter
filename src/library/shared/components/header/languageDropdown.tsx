import * as React from "react";
import { ChevronDown, Globe } from "lucide-react";
import { themeManagerCn } from "@yext/visual-editor/section-library-support";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@yext/visual-editor/section-library-support";
import { Background } from "@yext/visual-editor/section-library-support";
import { ThemeColor } from "@yext/visual-editor/section-library-support";
import { Body } from "@yext/visual-editor/section-library-support";
import { fetchLocalesToPathsForEntity } from "@yext/visual-editor/section-library-support";
import { useDocument } from "@yext/visual-editor/section-library-support";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";

export interface LanguageDropdownProps {
  className?: string;
  businessId: string;
  entityId: string;
  apiKey: string;
  contentEndpointId: string;
  contentDeliveryAPIDomain: string;
  locales: string[];
  currentLocale: string;
  background?: ThemeColor;
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  className,
  businessId,
  entityId,
  apiKey,
  contentEndpointId,
  contentDeliveryAPIDomain,
  locales,
  currentLocale,
  background,
}) => {
  const streamDocument = useDocument();
  const scopedLocales = new Set<string>(locales);
  const [validLocalesToPaths, setValidLocalesToPaths] = React.useState<
    Record<string, string>
  >({
    [currentLocale]: "",
  });
  const [selected, setSelected] = React.useState(currentLocale);
  const [status, setStatus] = React.useState<
    "UNSET" | "LOADING" | "COMPLETE" | "ERROR"
  >("UNSET");
  const [open, setOpen] = React.useState<boolean>(false);

  // In Editor if locale changes, have selected change as well.
  React.useEffect(() => {
    setSelected(currentLocale);
  }, [currentLocale]);

  // on dropdown clicked, compare the actual locales of the entity to the pageset's scoped locales
  const handleOpenChange = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && status === "UNSET") {
      setStatus("LOADING");
      try {
        const fetchedLocalesToPaths = await fetchLocalesToPathsForEntity({
          businessId,
          apiKey,
          contentEndpointId,
          contentDeliveryAPIDomain,
          entityId,
          streamDocument,
        });

        const filtered: Record<string, string> = {};

        for (const [locale, slug] of Object.entries(fetchedLocalesToPaths)) {
          if (scopedLocales.has(locale)) {
            filtered[locale] = slug;
          }
        }

        if (Object.keys(filtered).length > 1) {
          setValidLocalesToPaths({
            [currentLocale]: filtered[currentLocale],
            ...filtered,
          });
        }
      } catch {
        // just show the single current locale in the dropdown
        setValidLocalesToPaths({ [currentLocale]: "" });
        setStatus("ERROR");
        console.error("failed to fetch locales for entity");
      } finally {
        setStatus("COMPLETE");
      }
    }
  };

  const handleLocaleSelected = (locale: string, path: string) => {
    if (locale === selected) {
      return;
    }
    setSelected(locale);
    window.location.href = `/${path}`;
  };

  return (
    <Background background={background} as="div" className={className}>
      <div className="hidden md:block">
        <DropdownMenu open={open} onOpenChange={handleOpenChange}>
          <DropdownMenuTrigger className="flex flex-row items-center gap-4 justify-between w-full">
            <div className="flex gap-4 items-center">
              <Globe className="w-4 h-4" />
              <Body variant="xs">{getLanguageName(selected)}</Body>
            </div>
            <ChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-40 rounded p-0 hidden md:block"
          >
            {(status === "COMPLETE" || status === "ERROR") &&
              Object.entries(validLocalesToPaths).map(([locale, path]) => (
                <DropdownMenuItem
                  onSelect={() => handleLocaleSelected(locale, path)}
                  className={themeManagerCn(
                    "components font-body-fontFamily font-normal bg-white py-4 px-6 text-body-sm-fontSize",
                    "hover:bg-[#EDEDED] active:bg-[#EDEDED] cursor-pointer data-[highlighted]:outline-none data-[highlighted]:shadow-none",
                    selected === locale && "font-bold"
                  )}
                >
                  {getLanguageName(locale)}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="md:hidden block w-full">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          onValueChange={(value) => handleOpenChange(!!value)}
        >
          <AccordionItem value="language-selector">
            <AccordionTrigger className="group flex w-full items-center justify-between text-body-sm-fontSize font-medium text-gray-900 py-6 md:pb-4 ">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <Body variant="xs">{getLanguageName(selected)}</Body>
              </div>
              <ChevronDown
                className="transition-transform duration-300 group-data-[state=open]:rotate-180"
                size={16}
              />
            </AccordionTrigger>
            <AccordionContent className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp bg-white">
              <div className="flex flex-col pl-6">
                {(status === "COMPLETE" || status === "ERROR") &&
                  Object.entries(validLocalesToPaths).map(([locale, path]) => (
                    <button
                      key={locale}
                      onClick={() => handleLocaleSelected(locale, path)}
                      className={themeManagerCn(
                        "text-left py-3 px-2 rounded text-body-sm-fontSize",
                        selected === locale && "font-body-fontWeight"
                      )}
                    >
                      {getLanguageName(locale)}
                    </button>
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Background>
  );
};

// Returns the localized display name of a language given its locale code.
// For example: "fr" → "Français", "en" → "English", "es" → "Español"
function getLanguageName(locale: string): string | undefined {
  try {
    // Create a DisplayNames instance using the locale itself
    const displayNames = new Intl.DisplayNames([locale], { type: "language" });

    // Get the localized name of the language
    const name = displayNames.of(locale);
    return normalizeLanguageName(name);
  } catch {
    console.warn(`Unsupported locale: ${locale}`);
    return undefined;
  }
}

// If first character of language name is Latin letter, capitalize it.
function normalizeLanguageName(name: string | undefined): string | undefined {
  if (!name) return undefined;

  // Check if first character is Latin letter
  if (/^[a-zA-Z]/.test(name.charAt(0))) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  // Non-Latin scripts: return as is
  return name;
}

export function parseDocumentForLanguageDropdown(
  document: any
): LanguageDropdownProps | undefined {
  const businessId: string = document?.businessId;
  if (!businessId) {
    console.warn("Missing businessId! Unable to use language dropdown.");
    return undefined;
  }

  const entityId: string = document?.id;
  if (!entityId) {
    console.warn("Missing entityId! Unable to use language dropdown.");
    return undefined;
  }

  // read API key
  const apiKey: string = document?._env?.YEXT_PUBLIC_VISUAL_EDITOR_APP_API_KEY;
  if (!apiKey) {
    console.warn(
      "Missing YEXT_PUBLIC_VISUAL_EDITOR_APP_API_KEY! Unable to use language dropdown."
    );
    return undefined;
  }

  let contentEndpointId: string = "";
  let locales: string[] = [];
  if (document?._pageset) {
    try {
      const pagesetJson = JSON.parse(document?._pageset);
      contentEndpointId = pagesetJson?.config?.contentEndpointId;
      locales = pagesetJson?.scope?.locales;
    } catch (e) {
      console.error("Failed to parse pageset from document. err=", e);
      return undefined;
    }
  }
  if (!contentEndpointId) {
    console.warn("Missing contentEndpointId! Unable to use language dropdown.");
    return undefined;
  }
  if (!locales) {
    console.warn("Missing locales! Unable to use language dropdown");
    return undefined;
  }

  const contentDeliveryAPIDomain = document?._yext?.contentDeliveryAPIDomain;
  if (!contentDeliveryAPIDomain) {
    console.warn(
      "Missing contentDeliveryAPIDomain! Unable to use language dropdown."
    );
    return undefined;
  }

  const currentLocale = document?.locale;
  if (!currentLocale) {
    console.warn("Missing locale! Unable to use language dropdown.");
    return undefined;
  }

  return {
    businessId,
    entityId,
    apiKey,
    contentEndpointId,
    contentDeliveryAPIDomain,
    locales,
    currentLocale,
  };
}
