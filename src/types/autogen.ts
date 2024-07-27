import { ComplexImageType, HoursType } from "@yext/pages-components";

export interface SiteStream {
  c_locationVisualConfiguration: string;
  c_productVisualConfiguration: string;
  c_financialProfessionalVisualConfiguration: string;
}

export interface Navigation {
  navigationList: {
    title?: string;
    pages?: string[];
  }[];
}

export interface PageSiteStream {
  name: string;
  c_header: Navigation;
  c_theme: string;
}

export interface FinancialProfessionalStream {
  id: string;
  name: string;
  slug: string;
  c_financialProfessionalVisualConfiguration: string;
}

export interface RTFType {
  json: Record<string, any>;
}

export interface PageStream {
  uid: string;
  id: string;
  name: string;
  slug: string;
  c_financialProfessionalVisualConfiguration: string;
  c_contentBlocks?: ContentBlock[];
  richTextDescriptionV2: RTFType;
  visualTemplate?: any;
  _site?: PageSiteStream;
  c_linkedSites?: LinkedSite[];
}

export interface LinkedSite {
  name: string;
  c_header?: Navigation;
  c_theme?: string;
  c_linkedFinancialProfessional?: {
    name: string;
  }[];
}

export interface ContentBlock {
  uid: string;
  id: string;
  name: string;
  richTextDescriptionV2?: Record<string, any>;
  c_featuredFile?: FeaturedFile;
  c_featuredVideo?: FeaturedVideo;
}

export interface FeaturedFile {
  id: string;
  label: string;
  file: File;
  filePreviewImage: ComplexImageType;
}

export interface FeaturedVideo {
  video: {
    url: string;
  };
}

export interface File {
  mimeType: string;
  name: string;
  size: string;
  sourceUrl: string;
  url: string;
}

export interface Address {
  line1: string;
  line2?: string;
  line3?: string;
  sublocality?: string;
  city: string;
  region?: string;
  postalCode: string;
  extraDescription?: string;
  countryCode: string;
}

export interface ImageThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface Image {
  url: string;
  width: number;
  height: number;
  thumbnails?: ImageThumbnail[];
  alternateText?: string;
}

export interface ComplexImage {
  image: Image;
  details?: string;
  description?: string;
  clickthroughUrl?: string;
}

export interface C_hero {
  title?: string;
  subtitle?: string;
  image?: ComplexImage;
  email?: string;
  phoneNumber?: string;
  address?: Address;
}

export interface LocationStream {
  id: string;
  uid: string;
  meta: any;
  name: string;
  address: Address;
  slug: string;
  c_hero: C_hero;
}

export enum CurrencyCode {
  AED = "AED-United Arab Emirates Dirham",
  AFN = "AFN-Afghan Afghani",
  ALL = "ALL-Albanian Lek",
  AMD = "AMD-Armenian Dram",
  ANG = "ANG-Netherlands Antillean Guilder",
  AOA = "AOA-Angolan Kwanza",
  ARS = "ARS-Argentine Peso",
  AUD = "AUD-Australian Dollar",
  AWG = "AWG-Aruban Florin",
  AZN = "AZN-Azerbaijani Manat",
  BAM = "BAM-Bosnia-Herzegovina Convertible Mark",
  BBD = "BBD-Barbadian Dollar",
  BDT = "BDT-Bangladeshi Taka",
  BGN = "BGN-Bulgarian Lev",
  BHD = "BHD-Bahraini Dinar",
  BIF = "BIF-Burundian Franc",
  BMD = "BMD-Bermudan Dollar",
  BND = "BND-Brunei Dollar",
  BOB = "BOB-Bolivian Boliviano",
  BRL = "BRL-Brazilian Real",
  BSD = "BSD-Bahamian Dollar",
  BTN = "BTN-Bhutanese Ngultrum",
  BWP = "BWP-Botswanan Pula",
  BYN = "BYN-Belarusian Ruble",
  BZD = "BZD-Belize Dollar",
  CAD = "CAD-Canadian Dollar",
  CDF = "CDF-Congolese Franc",
  CHF = "CHF-Swiss Franc",
  CLP = "CLP-Chilean Peso",
  CNY = "CNY-Chinese Yuan",
  COP = "COP-Colombian Peso",
  CRC = "CRC-Costa Rican Colón",
  CUP = "CUP-Cuban Peso",
  CVE = "CVE-Cape Verdean Escudo",
  CZK = "CZK-Czech Koruna",
  DJF = "DJF-Djiboutian Franc",
  DKK = "DKK-Danish Krone",
  DOP = "DOP-Dominican Peso",
  DZD = "DZD-Algerian Dinar",
  EGP = "EGP-Egyptian Pound",
  ERN = "ERN-Eritrean Nakfa",
  ETB = "ETB-Ethiopian Birr",
  EUR = "EUR-Euro",
  FJD = "FJD-Fijian Dollar",
  FKP = "FKP-Falkland Islands Pound",
  GBP = "GBP-British Pound",
  GEL = "GEL-Georgian Lari",
  GHS = "GHS-Ghanaian Cedi",
  GIP = "GIP-Gibraltar Pound",
  GMD = "GMD-Gambian Dalasi",
  GNF = "GNF-Guinean Franc",
  GTQ = "GTQ-Guatemalan Quetzal",
  GYD = "GYD-Guyanaese Dollar",
  HKD = "HKD-Hong Kong Dollar",
  HRK = "HRK-Croatian Kuna",
  HTG = "HTG-Haitian Gourde",
  HUF = "HUF-Hungarian Forint",
  IDR = "IDR-Indonesian Rupiah",
  ILS = "ILS-Israeli New Shekel",
  INR = "INR-Indian Rupee",
  IQD = "IQD-Iraqi Dinar",
  IRR = "IRR-Iranian Rial",
  ISK = "ISK-Icelandic Króna",
  JMD = "JMD-Jamaican Dollar",
  JOD = "JOD-Jordanian Dinar",
  JPY = "JPY-Japanese Yen",
  KES = "KES-Kenyan Shilling",
  KGS = "KGS-Kyrgystani Som",
  KHR = "KHR-Cambodian Riel",
  KMF = "KMF-Comorian Franc",
  KRW = "KRW-South Korean Won",
  KWD = "KWD-Kuwaiti Dinar",
  KYD = "KYD-Cayman Islands Dollar",
  KZT = "KZT-Kazakhstani Tenge",
  LAK = "LAK-Laotian Kip",
  LBP = "LBP-Lebanese Pound",
  LKR = "LKR-Sri Lankan Rupee",
  LRD = "LRD-Liberian Dollar",
  LSL = "LSL-Lesotho Loti",
  LYD = "LYD-Libyan Dinar",
  MAD = "MAD-Moroccan Dirham",
  MDL = "MDL-Moldovan Leu",
  MGA = "MGA-Malagasy Ariary",
  MKD = "MKD-Macedonian Denar",
  MMK = "MMK-Myanmar Kyat",
  MNT = "MNT-Mongolian Tugrik",
  MOP = "MOP-Macanese Pataca",
  MRO = "MRO-Mauritanian Ouguiya (1973–2017)",
  MUR = "MUR-Mauritian Rupee",
  MVR = "MVR-Maldivian Rufiyaa",
  MWK = "MWK-Malawian Kwacha",
  MXN = "MXN-Mexican Peso",
  MYR = "MYR-Malaysian Ringgit",
  MZN = "MZN-Mozambican Metical",
  NAD = "NAD-Namibian Dollar",
  NGN = "NGN-Nigerian Naira",
  NIO = "NIO-Nicaraguan Córdoba",
  NOK = "NOK-Norwegian Krone",
  NPR = "NPR-Nepalese Rupee",
  NZD = "NZD-New Zealand Dollar",
  OMR = "OMR-Omani Rial",
  PAB = "PAB-Panamanian Balboa",
  PEN = "PEN-Peruvian Sol",
  PGK = "PGK-Papua New Guinean Kina",
  PHP = "PHP-Philippine Piso",
  PKR = "PKR-Pakistani Rupee",
  PLN = "PLN-Polish Zloty",
  PYG = "PYG-Paraguayan Guarani",
  QAR = "QAR-Qatari Rial",
  RON = "RON-Romanian Leu",
  RSD = "RSD-Serbian Dinar",
  RUB = "RUB-Russian Ruble",
  RWF = "RWF-Rwandan Franc",
  SAR = "SAR-Saudi Riyal",
  SBD = "SBD-Solomon Islands Dollar",
  SCR = "SCR-Seychellois Rupee",
  SDG = "SDG-Sudanese Pound",
  SEK = "SEK-Swedish Krona",
  SGD = "SGD-Singapore Dollar",
  SHP = "SHP-St. Helena Pound",
  SLL = "SLL-Sierra Leonean Leone",
  SOS = "SOS-Somali Shilling",
  SRD = "SRD-Surinamese Dollar",
  SSP = "SSP-South Sudanese Pound",
  STD = "STD-São Tomé & Príncipe Dobra (1977–2017)",
  SYP = "SYP-Syrian Pound",
  SZL = "SZL-Swazi Lilangeni",
  THB = "THB-Thai Baht",
  TJS = "TJS-Tajikistani Somoni",
  TMT = "TMT-Turkmenistani Manat",
  TND = "TND-Tunisian Dinar",
  TOP = "TOP-Tongan Paʻanga",
  TRY = "TRY-Turkish Lira",
  TTD = "TTD-Trinidad & Tobago Dollar",
  TWD = "TWD-New Taiwan Dollar",
  TZS = "TZS-Tanzanian Shilling",
  UAH = "UAH-Ukrainian Hryvnia",
  UGX = "UGX-Ugandan Shilling",
  USD = "USD-US Dollar",
  UYU = "UYU-Uruguayan Peso",
  UZS = "UZS-Uzbekistani Som",
  VEF = "VEF-Venezuelan Bolívar (2008–2018)",
  VND = "VND-Vietnamese Dong",
  VUV = "VUV-Vanuatu Vatu",
  WST = "WST-Samoan Tala",
  XAF = "XAF-Central African CFA Franc",
  XCD = "XCD-East Caribbean Dollar",
  XOF = "XOF-West African CFA Franc",
  XPF = "XPF-CFP Franc",
  YER = "YER-Yemeni Rial",
  ZAR = "ZAR-South African Rand",
  ZMW = "ZMW-Zambian Kwacha",
}

export interface Price {
  value?: number;
  currencyCode: CurrencyCode;
}

export interface ProductStream {
  id: string;
  name: string;
  price: Price;
  slug: string;
}

export interface SiteStream {
  c_locationVisualConfiguration: string;
}

export interface Price {
  value?: number;
  currencyCode: CurrencyCode;
}

export interface C_visualConfigurations {
  template: string;
  data: string;
}

export interface EntityReference {
  entityId: string;
  name: string;
}

export interface ProductStream {
  id: string;
  name: string;
  price: Price;
  slug: string;
  c_productVisualConfiguration: string;
  c_financialProfessionalVisualConfiguration: string;
}

export interface C_advisorBio {
  headshot?: ComplexImage;
  name?: string;
  role?: string;
  email?: string;
  bio?: string;
}

export interface LinkedService {
  id: string;
  name: string;
  c_description?: string;
  c_iconName?: string;
}

export interface EventTime {
  start?: string;
  end?: string;
}

export interface LinkedEvent {
  id: string;
  name: string;
  time?: EventTime;
  c_description?: string;
  c_coverPhoto?: ComplexImage;
}

export interface LinkedFinancialProfessional {
  id: string;
  name: string;
  c_role?: string;
  photoGallery?: ComplexImage[];
  emails?: string[];
  mainPhone?: string;
}

export interface LinkedBlog {
  name: string;
  datePosted?: string;
  c_description?: string;
  landingPageUrl?: string;
  c_category?: string[];
  photoGallery?: ComplexImage[];
}

export interface Events {
  title?: string;
  events?: LinkedEvent[];
}

export interface ContentGrid {
  title?: string;
  financialProfessionals?: LinkedFinancialProfessional[];
}

export interface FeaturedBlogs {
  blogs: LinkedBlog[];
}

export interface Coordinates {
  latitude?: string;
  longitude?: string;
}

export interface C_locator {
  description?: string;
  phoneNumber?: string;
  email?: string;
  coordinates?: Coordinates;
}

export interface ServicesOffered {
  servicesOptions: LinkedService[];
}

export interface FinancialProfessionalStream {
  id: string;
  name: string;
  slug: string;
  c_hero: C_hero;
  c_advisorBio: C_advisorBio;
  c_servicesOffered: ServicesOffered;
  c_contentGrid: ContentGrid;
  c_insights: FeaturedBlogs[];
  c_locator: C_locator;
  c_events: Events;
}

export interface AssociatedLocation {
  id: string;
  name: string;
  hours?: HoursType;
  address?: Address;
}

export interface AssociatedLocations {
  title?: string;
  associatedLocations?: AssociatedLocation[];
}

export interface C_locationCore {
  address?: { address: Address };
  hours?: HoursType;
  mainPhone?: string;
  tollfreePhone?: string;
  emails?: string[];
  services?: string[];
}

export interface BranchStream {
  c_associatedLocations: AssociatedLocations;
  c_locationCore: C_locationCore;
}
