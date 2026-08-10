// @ts-nocheck
import { backgroundColors } from "@yext/visual-editor/section-library-support";
import { PageSection } from "../../atoms/pageSection";
import { resolveYextEntityField } from "@yext/visual-editor/section-library-support";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { HeroVariantProps } from "../HeroSection";
import { HeroContent, heroContentParentCn } from "./HeroContent";
import { useTranslation } from "react-i18next";
import { getImageUrl } from "@yext/pages-components";
import { PuckComponent } from "@puckeditor/core";
import {
  isLocalizedAssetImage,
  resolveLocalizedAssetImage,
} from "@yext/visual-editor/section-library-support";

export const ImmersiveHero: PuckComponent<HeroVariantProps> = (props) => {
  const { data, styles } = props;
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const streamDocument = useDocument();
  const resolvedBackgroundImage = resolveYextEntityField(
    streamDocument,
    data?.backgroundImage,
    locale
  );

  const localizedImage:
    | { url: string; width: number; height: number }
    | undefined =
    resolvedBackgroundImage && isLocalizedAssetImage(resolvedBackgroundImage)
      ? resolveLocalizedAssetImage(resolvedBackgroundImage, locale)
      : resolvedBackgroundImage && "image" in resolvedBackgroundImage
        ? resolvedBackgroundImage.image
        : resolvedBackgroundImage;

  return (
    <div
      style={{
        backgroundImage: localizedImage?.url
          ? `url(${getImageUrl(localizedImage.url, localizedImage.width, localizedImage.height)})`
          : undefined,
      }}
      className="bg-no-repeat bg-center bg-cover"
    >
      <PageSection
        background={
          localizedImage?.url
            ? {
                selectedColor: "[#00000099]", // keep in sync with VisualEditorThemeClassSafelist
                contrastingColor: "white",
                isDarkColor: true,
              }
            : backgroundColors.background1.value
        }
        aria-label={t("heroBanner", "Hero Banner")}
        className="z-10 flex items-center h-full w-full"
        outerClassName="h-fit flex items-center"
        outerStyle={{
          minHeight: `${styles.imageHeight}px`,
        }}
      >
        <div className={heroContentParentCn(styles)}>
          <HeroContent {...props} />
        </div>
      </PageSection>
    </div>
  );
};
