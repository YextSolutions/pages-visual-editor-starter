export interface C_visualConfigurations {
	template: string,
	data?: string,
}

export interface ImageThumbnail {
	url: string,
	width: number,
	height: number,
}

export interface Image {
	url: string,
	width: number,
	height: number,
	thumbnails?: ImageThumbnail[],
	alternateText?: string,
}

export interface ComplexImage {
	image: Image,
	details?: string,
	description?: string,
	clickthroughUrl?: string,
}

export interface C_visualConfiguration {
	template: string,
	data?: string,
}

export interface C_pages_layouts {
	c_visualConfiguration?: C_visualConfiguration,
}

export interface ProductStream {
	id: string,
	name: string,
	slug: string,
	c_visualConfigurations: C_visualConfigurations[],
	c_coverPhoto: ComplexImage,
	c_description: string,
	c_pages_layouts: C_pages_layouts[],
}

export interface C_visualLayouts {
	c_visualConfiguration?: C_visualConfiguration,
}

export interface SiteStream {
	c_visualLayouts: C_visualLayouts[],
}

export interface Interval {
	start: any,
	end: any,
}

export interface DayHour {
	openIntervals?: Interval[],
	isClosed?: boolean,
}

export interface HolidayHours {
	date: string,
	openIntervals?: Interval[],
	isClosed?: boolean,
	isRegularHours?: boolean,
}

export interface Hours {
	monday?: DayHour,
	tuesday?: DayHour,
	wednesday?: DayHour,
	thursday?: DayHour,
	friday?: DayHour,
	saturday?: DayHour,
	sunday?: DayHour,
	holidayHours?: HolidayHours[],
	reopenDate?: string,
}

export interface Address {
	line1?: string,
	line2?: string,
	line3?: string,
	sublocality?: string,
	city?: string,
	region?: string,
	postalCode?: string,
	extraDescription?: string,
	countryCode?: string,
}

export interface Cta1 {
	name?: string,
	link?: string,
}

export interface Cta2 {
	name?: string,
	link?: string,
}

export interface C_hero {
	image?: ComplexImage,
	cta1?: Cta1,
	cta2?: Cta2,
}

export interface Cta {
	name?: string,
	link?: string,
}

export interface C_deliveryPromo {
	image?: ComplexImage,
	title?: string,
	description?: string,
	cta?: Cta,
}

export interface C_productSection {
	sectionTitle?: string,
	linkedProducts?: any,
}

export interface C_faqSection {
	linkedFAQs?: any,
}

export interface LocationStream {
	id: string,
	uid: string,
	meta: any,
	slug: string,
	c_visualConfigurations: C_visualConfigurations[],
	name: string,
	hours: Hours,
	address: Address,
	c_hero: C_hero,
	additionalHoursText: string,
	mainPhone: any,
	emails: string[],
	c_deliveryPromo: C_deliveryPromo,
	c_pages_layouts: C_pages_layouts[],
	c_productSection: C_productSection,
	c_faqSection: C_faqSection,
}
