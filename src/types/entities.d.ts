import type {
  CTA,
  ImageType,
} from "@yext/pages-components";

interface BaseProfile {
  readonly id: string;
  readonly businessId: number;
  readonly locale: string;
  readonly siteDomain: string;
  readonly siteId: number;
  readonly siteInternalHostname: string;
  readonly uid: number;
  readonly meta: {
    readonly entityType: {
      readonly id: string;
      readonly uid: number;
    };
    readonly locale: string;
  };
  readonly _site: SiteProfile;
}

export interface SiteProfile extends BaseProfile {
  readonly name: string;
  readonly c_brand?: string;
  readonly c_copyrightMessage?: string;
  readonly c_facebook?: string;
  readonly c_instagram?: string;
  readonly c_youtube?: string;
  readonly c_twitter?: string;
  readonly c_linkedIn?: string;
  readonly c_footerLinks?: CTA[];
  readonly c_header?: {
    readonly logo?: ImageType;
    readonly logoLink?: string;
    readonly links?: CTA[];
  };
  readonly c_searchPage?: {
    readonly slug?: string;
  };
}