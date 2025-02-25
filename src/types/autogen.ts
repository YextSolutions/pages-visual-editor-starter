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

export enum LinkType {
	OTHER = "Other",
	URL = "URL",
	PHONE = "Phone",
	EMAIL = "Email",
}

export interface Links {
	label?: string,
	linkType?: LinkType,
	link?: string,
}

export interface Header {
	links?: Links[],
}

export interface Footer {
	links?: Links[],
}

export default interface SiteStream {
	favicon: Image,
	logo: ComplexImage,
	twitterHandle: string,
	facebookPageUrl: string,
	instagramHandle: string,
	linkedInUrl: string,
	pinterestUrl: string,
	tikTokUrl: string,
	youTubeChannelUrl: string,
	header: Header,
	footer: Footer,
}
