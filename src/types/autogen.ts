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

export interface LocationStream {
	id: string,
	uid: string,
	meta: any,
	name: string,
	address: Address,
	slug: string,
	c_hero: C_hero,
}

export interface SiteStream {
	c_templateVisualConfiguration: string,
}
