export interface C_visualConfigurations {
	template: string,
	data: string,
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

export interface C_hero {
	title?: string,
	image?: ComplexImage,
}

export interface C_visualConfiguration {
	template: string,
	data: string,
}

export interface C_pages_layouts {
	c_visualConfiguration?: C_visualConfiguration,
}

export interface linkedFAQs {
  question: string,
  answer: string,
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
	c_pages_layouts: C_pages_layouts[],
	c_faqSection: C_faqSection,
}

export interface C_visualLayouts {
	c_visualConfiguration?: C_visualConfiguration,
}

export interface SiteStream {
	c_visualLayouts: C_visualLayouts[],
}
