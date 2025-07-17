const data = {
		"root": {
				"props": {
						"title": {
								"field": "name",
								"constantValue": "",
								"constantValueEnabled": false
						},
						"version": 11,
						"description": {
								"field": "description",
								"constantValue": "",
								"constantValueEnabled": false
						}
				}
		},
		"zones": {},
		"content": [
				{
						"type": "ExpandedHeader",
						"props": {
								"id": "ExpandedHeader-12b0c1a3-c5ff-42c6-976f-72dd1574d329",
								"data": {
										"primaryHeader": {
												"logo": "https://placehold.co/100",
												"links": [
														{
																"link": "#",
																"label": {
																		"en": "Main Header Link",
																		"hasLocalizedValue": "true"
																},
																"linkType": "URL"
														},
														{
																"link": "#",
																"label": {
																		"en": "Main Header Link",
																		"hasLocalizedValue": "true"
																},
																"linkType": "URL"
														},
														{
																"link": "#",
																"label": {
																		"en": "Main Header Link",
																		"hasLocalizedValue": "true"
																},
																"linkType": "URL"
														},
														{
																"link": "#",
																"label": {
																		"en": "Main Header Link",
																		"hasLocalizedValue": "true"
																},
																"linkType": "URL"
														}
												],
												"primaryCTA": {
														"link": "#",
														"label": {
																"en": "Call to Action",
																"hasLocalizedValue": "true"
														},
														"linkType": "URL"
												},
												"secondaryCTA": {
														"link": "#",
														"label": {
																"en": "Call to Action",
																"hasLocalizedValue": "true"
														},
														"linkType": "URL"
												},
												"showPrimaryCTA": true,
												"showSecondaryCTA": true
										},
										"secondaryHeader": {
												"show": false,
												"secondaryLinks": [
														{
																"link": "#",
																"label": {
																		"en": "Secondary Header Link",
																		"hasLocalizedValue": "true"
																},
																"linkType": "URL"
														},
														{
																"link": "#",
																"label": {
																		"en": "Secondary Header Link",
																		"hasLocalizedValue": "true"
																},
																"linkType": "URL"
														},
														{
																"link": "#",
																"label": {
																		"en": "Secondary Header Link",
																		"hasLocalizedValue": "true"
																},
																"linkType": "URL"
														},
														{
																"link": "#",
																"label": {
																		"en": "Secondary Header Link",
																		"hasLocalizedValue": "true"
																},
																"linkType": "URL"
														},
														{
																"link": "#",
																"label": {
																		"en": "Secondary Header Link",
																		"hasLocalizedValue": "true"
																},
																"linkType": "URL"
														}
												],
												"showLanguageDropdown": false
										}
								},
								"styles": {
										"primaryHeader": {
												"logo": {
														"aspectRatio": 2
												},
												"backgroundColor": {
														"bgColor": "bg-white",
														"textColor": "text-black"
												},
												"primaryCtaVariant": "primary",
												"secondaryCtaVariant": "secondary"
										},
										"secondaryHeader": {
												"backgroundColor": {
														"bgColor": "bg-palette-primary-light",
														"textColor": "text-black"
												}
										}
								},
								"analytics": {
										"scope": "expandedHeader"
								}
						}
				},
				{
						"type": "BreadcrumbsSection",
						"props": {
								"id": "BreadcrumbsSection-16e56d01-021b-4882-9f40-d3861490d278",
								"data": {
										"directoryRoot": {
												"en": "Directory Root",
												"hasLocalizedValue": "true"
										}
								},
								"analytics": {
										"scope": "breadcrumbs"
								},
								"liveVisibility": true
						}
				},
				{
						"type": "HeroSection",
						"props": {
								"id": "HeroSection-255abedb-ddbf-4ddd-8d54-cf1643dd415e",
								"data": {
										"hero": {
												"field": "",
												"constantValue": {
														"image": {
																"url": "https://placehold.co/640x360",
																"width": 640,
																"height": 360
														},
														"primaryCta": {
																"link": "#",
																"label": {
																		"en": "Call To Action",
																		"hasLocalizedValue": "true"
																},
																"linkType": "URL"
														},
														"secondaryCta": {
																"link": "#",
																"label": {
																		"en": "Call To Action",
																		"hasLocalizedValue": "true"
																},
																"linkType": "URL"
														}
												},
												"constantValueEnabled": true,
												"constantValueOverride": {
														"image": true,
														"primaryCta": true,
														"secondaryCta": true
												}
										},
										"hours": {
												"field": "hours",
												"constantValue": {},
												"constantValueEnabled": false
										},
										"businessName": {
												"field": "",
												"constantValue": {
														"en": "Business Name",
														"hasLocalizedValue": "true"
												},
												"constantValueEnabled": true
										},
										"localGeoModifier": {
												"field": "",
												"constantValue": {
														"en": "Geomodifier",
														"hasLocalizedValue": "true"
												},
												"constantValueEnabled": true
										},
										"showAverageReview": false
								},
								"styles": {
										"image": {
												"aspectRatio": 1.78
										},
										"primaryCTA": "primary",
										"secondaryCTA": "secondary",
										"backgroundColor": {
												"bgColor": "bg-white",
												"textColor": "text-black"
										},
										"imageOrientation": "right",
										"businessNameLevel": 3,
										"localGeoModifierLevel": 1
								},
								"analytics": {
										"scope": "heroSection"
								},
								"liveVisibility": true
						}
				},
				{
						"type": "CoreInfoSection",
						"props": {
								"id": "CoreInfoSection-b35756c8-6f58-4817-ae7a-1948f03b62e8",
								"data": {
										"info": {
												"emails": {
														"field": "emails",
														"constantValue": []
												},
												"address": {
														"field": "address",
														"constantValue": {
																"city": "",
																"line1": "",
																"postalCode": "",
																"countryCode": ""
														}
												},
												"headingText": {
														"field": "",
														"constantValue": {
																"en": "Information",
																"hasLocalizedValue": "true"
														},
														"constantValueEnabled": true
												},
												"phoneNumbers": [
														{
																"label": {
																		"en": "Phone",
																		"hasLocalizedValue": "true"
																},
																"number": {
																		"field": "mainPhone",
																		"constantValue": ""
																}
														}
												]
										},
										"hours": {
												"hours": {
														"field": "hours",
														"constantValue": {}
												},
												"headingText": {
														"field": "",
														"constantValue": {
																"en": "Hours",
																"hasLocalizedValue": "true"
														},
														"constantValueEnabled": true
												}
										},
										"services": {
												"headingText": {
														"field": "",
														"constantValue": {
																"en": "Services",
																"hasLocalizedValue": "true"
														},
														"constantValueEnabled": true
												},
												"servicesList": {
														"field": "services",
														"constantValue": []
												}
										}
								},
								"styles": {
										"info": {
												"phoneFormat": "domestic",
												"emailsListLength": 1,
												"includePhoneHyperlink": true,
												"showGetDirectionsLink": true
										},
										"hours": {
												"startOfWeek": "today",
												"collapseDays": false,
												"showAdditionalHoursText": true
										},
										"heading": {
												"align": "left",
												"level": 3
										},
										"backgroundColor": {
												"bgColor": "bg-white",
												"textColor": "text-black"
										}
								},
								"analytics": {
										"scope": "coreInfoSection"
								},
								"liveVisibility": true
						}
				},
				{
						"type": "PromoSection",
						"props": {
								"id": "PromoSection-e5ed6606-8b89-4087-8b17-748d0f9e0b1a",
								"data": {
										"promo": {
												"field": "",
												"constantValue": {
														"cta": {
																"link": "#",
																"label": {
																		"en": "Learn More",
																		"hasLocalizedValue": "true"
																},
																"linkType": "URL"
														},
														"image": {
																"url": "https://placehold.co/640x360",
																"width": 640,
																"height": 360
														},
														"title": {
																"en": "Featured Promotion",
																"hasLocalizedValue": "true"
														},
														"description": {
																"en": "Lorem ipsum dolor sit amet, consectetur adipiscing. Maecenas finibus placerat justo. 100 characters",
																"hasLocalizedValue": "true"
														}
												},
												"constantValueEnabled": true,
												"constantValueOverride": {
														"cta": true,
														"image": true,
														"title": true,
														"description": true
												}
										}
								},
								"styles": {
										"image": {
												"aspectRatio": 1.78
										},
										"heading": {
												"align": "left",
												"level": 2
										},
										"ctaVariant": "primary",
										"orientation": "left",
										"backgroundColor": {
												"bgColor": "bg-white",
												"textColor": "text-black"
										}
								},
								"analytics": {
										"scope": "promoSection"
								},
								"liveVisibility": true
						}
				},
				{
						"type": "ProductSection",
						"props": {
								"id": "ProductSection-f073638a-d0c0-43c2-9835-8988035488a1",
								"data": {
										"heading": {
												"field": "",
												"constantValue": {
														"en": "Featured Products",
														"hasLocalizedValue": "true"
												},
												"constantValueEnabled": true
										},
										"products": {
												"field": "",
												"constantValue": {
														"products": [
																{
																		"cta": {
																				"link": "#",
																				"label": {
																						"en": "Learn More",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		"name": {
																				"en": "Product Title",
																				"hasLocalizedValue": "true"
																		},
																		"image": {
																				"url": "https://placehold.co/640x360",
																				"width": 640,
																				"height": 360
																		},
																		"category": {
																				"en": "Category, Pricing, etc",
																				"hasLocalizedValue": "true"
																		},
																		"description": {
																				"en": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
																				"hasLocalizedValue": "true"
																		}
																},
																{
																		"cta": {
																				"link": "#",
																				"label": {
																						"en": "Learn More",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		"name": {
																				"en": "Product Title",
																				"hasLocalizedValue": "true"
																		},
																		"image": {
																				"url": "https://placehold.co/640x360",
																				"width": 640,
																				"height": 360
																		},
																		"category": {
																				"en": "Category, Pricing, etc",
																				"hasLocalizedValue": "true"
																		},
																		"description": {
																				"en": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
																				"hasLocalizedValue": "true"
																		}
																},
																{
																		"cta": {
																				"link": "#",
																				"label": {
																						"en": "Learn More",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		"name": {
																				"en": "Product Title",
																				"hasLocalizedValue": "true"
																		},
																		"image": {
																				"url": "https://placehold.co/640x360",
																				"width": 640,
																				"height": 360
																		},
																		"category": {
																				"en": "Category, Pricing, etc",
																				"hasLocalizedValue": "true"
																		},
																		"description": {
																				"en": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
																				"hasLocalizedValue": "true"
																		}
																}
														]
												},
												"constantValueEnabled": true
										}
								},
								"styles": {
										"cards": {
												"headingLevel": 3,
												"backgroundColor": {
														"bgColor": "bg-white",
														"textColor": "text-black"
												}
										},
										"heading": {
												"align": "left",
												"level": 2
										},
										"backgroundColor": {
												"bgColor": "bg-palette-primary-light",
												"textColor": "text-black"
										}
								},
								"analytics": {
										"scope": "productsSection"
								},
								"liveVisibility": true
						}
				},
				{
						"type": "TestimonialSection",
						"props": {
								"id": "TestimonialSection-ad495cbf-8856-4f3e-a1a9-6212df3283c3",
								"data": {
										"heading": {
												"field": "",
												"constantValue": {
														"en": "Featured Testimonials",
														"hasLocalizedValue": "true"
												},
												"constantValueEnabled": true
										},
										"testimonials": {
												"field": "",
												"constantValue": {
														"testimonials": [
																{
																		"description": {
																				"en": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
																				"hasLocalizedValue": "true"
																		},
																		"contributorName": {
																				"en": "Name",
																				"hasLocalizedValue": "true"
																		},
																		"contributionDate": "July 22, 2022"
																},
																{
																		"description": {
																				"en": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
																				"hasLocalizedValue": "true"
																		},
																		"contributorName": {
																				"en": "Name",
																				"hasLocalizedValue": "true"
																		},
																		"contributionDate": "July 22, 2022"
																},
																{
																		"description": {
																				"en": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
																				"hasLocalizedValue": "true"
																		},
																		"contributorName": {
																				"en": "Name",
																				"hasLocalizedValue": "true"
																		},
																		"contributionDate": "July 22, 2022"
																}
														]
												},
												"constantValueEnabled": true
										}
								},
								"styles": {
										"cards": {
												"headingLevel": 3,
												"backgroundColor": {
														"bgColor": "bg-palette-primary-light",
														"textColor": "text-black"
												}
										},
										"heading": {
												"align": "left",
												"level": 2
										},
										"backgroundColor": {
												"bgColor": "bg-palette-secondary-light",
												"textColor": "text-black"
										}
								},
								"liveVisibility": true
						}
				},
				{
						"type": "FAQSection",
						"props": {
								"id": "FAQSection-1dfb0458-3292-4d45-8df1-922db4914060",
								"data": {
										"faqs": {
												"field": "",
												"constantValue": {
														"faqs": [
																{
																		"answer": {
																				"en": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
																				"hasLocalizedValue": "true"
																		},
																		"question": {
																				"en": "Question Lorem ipsum dolor sit amet?",
																				"hasLocalizedValue": "true"
																		}
																},
																{
																		"answer": {
																				"en": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
																				"hasLocalizedValue": "true"
																		},
																		"question": {
																				"en": "Question Lorem ipsum dolor sit amet?",
																				"hasLocalizedValue": "true"
																		}
																},
																{
																		"answer": {
																				"en": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
																				"hasLocalizedValue": "true"
																		},
																		"question": {
																				"en": "Question Lorem ipsum dolor sit amet?",
																				"hasLocalizedValue": "true"
																		}
																}
														]
												},
												"constantValueEnabled": true
										},
										"heading": {
												"field": "",
												"constantValue": {
														"en": "Frequently Asked Questions",
														"hasLocalizedValue": "true"
												},
												"constantValueEnabled": true
										}
								},
								"styles": {
										"heading": {
												"align": "left",
												"level": 2
										},
										"backgroundColor": {
												"bgColor": "bg-palette-primary-light",
												"textColor": "text-black"
										}
								},
								"liveVisibility": true
						}
				},
				{
						"type": "TeamSection",
						"props": {
								"id": "TeamSection-ecc3b656-3b9f-4579-b2b6-f327c0f72b44",
								"data": {
										"people": {
												"field": "",
												"constantValue": {
														"people": [
																{
																		"cta": {
																				"link": "#",
																				"label": {
																						"en": "Visit Profile",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		"name": {
																				"en": "First Last",
																				"hasLocalizedValue": "true"
																		},
																		"email": "jkelley@[company].com",
																		"title": {
																				"en": "Associate Agent",
																				"hasLocalizedValue": "true"
																		},
																		"headshot": {
																				"url": "https://placehold.co/80x80",
																				"width": 80,
																				"height": 80
																		},
																		"phoneNumber": "(202) 770-6619 "
																},
																{
																		"cta": {
																				"link": "#",
																				"label": {
																						"en": "Visit Profile",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		"name": {
																				"en": "First Last",
																				"hasLocalizedValue": "true"
																		},
																		"email": "jkelley@[company].com",
																		"title": {
																				"en": "Associate Agent",
																				"hasLocalizedValue": "true"
																		},
																		"headshot": {
																				"url": "https://placehold.co/80x80",
																				"width": 80,
																				"height": 80
																		},
																		"phoneNumber": "(202) 770-6619 "
																},
																{
																		"cta": {
																				"link": "#",
																				"label": {
																						"en": "Visit Profile",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		"name": {
																				"en": "First Last",
																				"hasLocalizedValue": "true"
																		},
																		"email": "jkelley@[company].com",
																		"title": {
																				"en": "Associate Agent",
																				"hasLocalizedValue": "true"
																		},
																		"headshot": {
																				"url": "https://placehold.co/80x80",
																				"width": 80,
																				"height": 80
																		},
																		"phoneNumber": "(202) 770-6619 "
																}
														]
												},
												"constantValueEnabled": true
										},
										"heading": {
												"field": "",
												"constantValue": {
														"en": "Meet Our Team",
														"hasLocalizedValue": "true"
												},
												"constantValueEnabled": true
										}
								},
								"styles": {
										"cards": {
												"headingLevel": 3,
												"backgroundColor": {
														"bgColor": "bg-white",
														"textColor": "text-black"
												}
										},
										"heading": {
												"align": "left",
												"level": 2
										},
										"backgroundColor": {
												"bgColor": "bg-palette-secondary-light",
												"textColor": "text-black"
										}
								},
								"analytics": {
										"scope": "teamSection"
								},
								"liveVisibility": true
						}
				},
				{
						"type": "InsightSection",
						"props": {
								"id": "InsightSection-575c1600-cf09-472d-98ea-217e8842773d",
								"data": {
										"heading": {
												"field": "",
												"constantValue": {
														"en": "Insights",
														"hasLocalizedValue": "true"
												},
												"constantValueEnabled": true
										},
										"insights": {
												"field": "",
												"constantValue": {
														"insights": [
																{
																		"cta": {
																				"link": "#",
																				"label": {
																						"en": "Read More",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		"name": {
																				"en": "Article Name",
																				"hasLocalizedValue": "true"
																		},
																		"image": {
																				"url": "https://placehold.co/640x360",
																				"width": 640,
																				"height": 360
																		},
																		"category": {
																				"en": "Category",
																				"hasLocalizedValue": "true"
																		},
																		"description": {
																				"en": "Lorem ipsum dolor sit amet, consectetur adipiscing. Maecenas finibus placerat justo. Lorem ipsum dolor sit amet, consectetur adipiscing. Maecenas finibus placerat justo.Lorem ipsum dolor sit amet, consectetur adipiscing. Maecenas finibus placerat justo. 300 characters",
																				"hasLocalizedValue": "true"
																		},
																		"publishTime": "August 2, 2022"
																},
																{
																		"cta": {
																				"link": "#",
																				"label": {
																						"en": "Read More",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		"name": {
																				"en": "Article Name",
																				"hasLocalizedValue": "true"
																		},
																		"image": {
																				"url": "https://placehold.co/640x360",
																				"width": 640,
																				"height": 360
																		},
																		"category": {
																				"en": "Category",
																				"hasLocalizedValue": "true"
																		},
																		"description": {
																				"en": "Lorem ipsum dolor sit amet, consectetur adipiscing. Maecenas finibus placerat justo. Lorem ipsum dolor sit amet, consectetur adipiscing. Maecenas finibus placerat justo.Lorem ipsum dolor sit amet, consectetur adipiscing. Maecenas finibus placerat justo. 300 characters",
																				"hasLocalizedValue": "true"
																		},
																		"publishTime": "August 2, 2022"
																},
																{
																		"cta": {
																				"link": "#",
																				"label": {
																						"en": "Read More",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		"name": {
																				"en": "Article Name",
																				"hasLocalizedValue": "true"
																		},
																		"image": {
																				"url": "https://placehold.co/640x360",
																				"width": 640,
																				"height": 360
																		},
																		"category": {
																				"en": "Category",
																				"hasLocalizedValue": "true"
																		},
																		"description": {
																				"en": "Lorem ipsum dolor sit amet, consectetur adipiscing. Maecenas finibus placerat justo. Lorem ipsum dolor sit amet, consectetur adipiscing. Maecenas finibus placerat justo.Lorem ipsum dolor sit amet, consectetur adipiscing. Maecenas finibus placerat justo. 300 characters",
																				"hasLocalizedValue": "true"
																		},
																		"publishTime": "August 2, 2022"
																}
														]
												},
												"constantValueEnabled": true
										}
								},
								"styles": {
										"cards": {
												"headingLevel": 3,
												"backgroundColor": {
														"bgColor": "bg-white",
														"textColor": "text-black"
												}
										},
										"heading": {
												"align": "left",
												"level": 2
										},
										"backgroundColor": {
												"bgColor": "bg-palette-primary-light",
												"textColor": "text-black"
										}
								},
								"analytics": {
										"scope": "insightsSection"
								},
								"liveVisibility": true
						}
				},
				{
						"type": "PhotoGallerySection",
						"props": {
								"id": "PhotoGallerySection-86067bdf-2fa6-4457-9743-dec846f757b6",
								"data": {
										"images": {
												"field": "",
												"constantValue": [
														{
																"url": "https://placehold.co/1000x570/png",
																"width": 1000,
																"height": 570
														},
														{
																"url": "https://placehold.co/1000x570/png",
																"width": 1000,
																"height": 570
														},
														{
																"url": "https://placehold.co/1000x570/png",
																"width": 1000,
																"height": 570
														}
												],
												"constantValueEnabled": true
										},
										"heading": {
												"field": "",
												"constantValue": {
														"en": "Gallery",
														"hasLocalizedValue": "true"
												},
												"constantValueEnabled": true
										}
								},
								"styles": {
										"image": {
												"width": 1000,
												"aspectRatio": 1.78
										},
										"heading": {
												"align": "left",
												"level": 2
										},
										"backgroundColor": {
												"bgColor": "bg-white",
												"textColor": "text-black"
										}
								},
								"liveVisibility": true
						}
				},
				{
						"type": "EventSection",
						"props": {
								"id": "EventSection-01003495-92d9-44f1-bff9-cab0f291db47",
								"data": {
										"events": {
												"field": "",
												"constantValue": {
														"events": [
																{
																		"cta": {
																				"link": "#",
																				"label": {
																						"en": "Learn More",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		"image": {
																				"url": "https://placehold.co/640x360",
																				"width": 640,
																				"height": 360
																		},
																		"title": {
																				"en": "Event Title",
																				"hasLocalizedValue": "true"
																		},
																		"dateTime": "2022-12-12T14:00:00",
																		"description": {
																				"en": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
																				"hasLocalizedValue": "true"
																		}
																},
																{
																		"cta": {
																				"link": "#",
																				"label": {
																						"en": "Learn More",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		"image": {
																				"url": "https://placehold.co/640x360",
																				"width": 640,
																				"height": 360
																		},
																		"title": {
																				"en": "Event Title",
																				"hasLocalizedValue": "true"
																		},
																		"dateTime": "2022-12-12T14:00:00",
																		"description": {
																				"en": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
																				"hasLocalizedValue": "true"
																		}
																},
																{
																		"cta": {
																				"link": "#",
																				"label": {
																						"en": "Learn More",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		"image": {
																				"url": "https://placehold.co/640x360",
																				"width": 640,
																				"height": 360
																		},
																		"title": {
																				"en": "Event Title",
																				"hasLocalizedValue": "true"
																		},
																		"dateTime": "2022-12-12T14:00:00",
																		"description": {
																				"en": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
																				"hasLocalizedValue": "true"
																		}
																}
														]
												},
												"constantValueEnabled": true
										},
										"heading": {
												"field": "",
												"constantValue": {
														"en": "Upcoming Events",
														"hasLocalizedValue": "true"
												},
												"constantValueEnabled": true
										}
								},
								"styles": {
										"cards": {
												"headingLevel": 3,
												"backgroundColor": {
														"bgColor": "bg-white",
														"textColor": "text-black"
												}
										},
										"heading": {
												"align": "left",
												"level": 2
										},
										"backgroundColor": {
												"bgColor": "bg-palette-primary-light",
												"textColor": "text-black"
										}
								},
								"analytics": {
										"scope": "eventsSection"
								},
								"liveVisibility": true
						}
				},
				{
						"type": "NearbyLocationsSection",
						"props": {
								"id": "NearbyLocationsSection-1549e534-3ba4-436d-8627-23ea2ff461cd",
								"data": {
										"limit": 3,
										"radius": 10,
										"heading": {
												"field": "",
												"constantValue": {
														"en": "Nearby Locations",
														"hasLocalizedValue": "true"
												},
												"constantValueEnabled": true
										},
										"coordinate": {
												"field": "yextDisplayCoordinate",
												"constantValue": {
														"latitude": 0,
														"longitude": 0
												}
										}
								},
								"styles": {
										"cards": {
												"headingLevel": 4,
												"backgroundColor": {
														"bgColor": "bg-white",
														"textColor": "text-black"
												}
										},
										"hours": {
												"timeFormat": "12h",
												"showDayNames": true,
												"dayOfWeekFormat": "long",
												"showCurrentStatus": true
										},
										"heading": {
												"align": "left",
												"level": 3
										},
										"backgroundColor": {
												"bgColor": "bg-white",
												"textColor": "text-black"
										},
										"phoneNumberLink": false,
										"phoneNumberFormat": "domestic"
								},
								"analytics": {
										"scope": "nearbyLocationsSection"
								},
								"liveVisibility": true
						}
				},
				{
						"type": "ExpandedFooter",
						"props": {
								"id": "ExpandedFooter-5707a44e-0d3b-4e1f-8266-12403c7a036c",
								"data": {
										"primaryFooter": {
												"logo": "https://placehold.co/100",
												"xLink": "",
												"footerLinks": [
														{
																"link": "#",
																"label": {
																		"en": "Footer Link",
																		"hasLocalizedValue": "true"
																},
																"linkType": "URL"
														},
														{
																"link": "#",
																"label": {
																		"en": "Footer Link",
																		"hasLocalizedValue": "true"
																},
																"linkType": "URL"
														},
														{
																"link": "#",
																"label": {
																		"en": "Footer Link",
																		"hasLocalizedValue": "true"
																},
																"linkType": "URL"
														},
														{
																"link": "#",
																"label": {
																		"en": "Footer Link",
																		"hasLocalizedValue": "true"
																},
																"linkType": "URL"
														},
														{
																"link": "#",
																"label": {
																		"en": "Footer Link",
																		"hasLocalizedValue": "true"
																},
																"linkType": "URL"
														}
												],
												"youtubeLink": "",
												"facebookLink": "",
												"linkedInLink": "",
												"instagramLink": "",
												"pinterestLink": "",
												"utilityImages": [],
												"expandedFooter": false,
												"expandedFooterLinks": [
														{
																"label": "Footer Label",
																"links": [
																		{
																				"link": "#",
																				"label": {
																						"en": "Footer Link",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		{
																				"link": "#",
																				"label": {
																						"en": "Footer Link",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		{
																				"link": "#",
																				"label": {
																						"en": "Footer Link",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		{
																				"link": "#",
																				"label": {
																						"en": "Footer Link",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		{
																				"link": "#",
																				"label": {
																						"en": "Footer Link",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		}
																]
														},
														{
																"label": "Footer Label",
																"links": [
																		{
																				"link": "#",
																				"label": {
																						"en": "Footer Link",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		{
																				"link": "#",
																				"label": {
																						"en": "Footer Link",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		{
																				"link": "#",
																				"label": {
																						"en": "Footer Link",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		{
																				"link": "#",
																				"label": {
																						"en": "Footer Link",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		{
																				"link": "#",
																				"label": {
																						"en": "Footer Link",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		}
																]
														},
														{
																"label": "Footer Label",
																"links": [
																		{
																				"link": "#",
																				"label": {
																						"en": "Footer Link",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		{
																				"link": "#",
																				"label": {
																						"en": "Footer Link",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		{
																				"link": "#",
																				"label": {
																						"en": "Footer Link",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		{
																				"link": "#",
																				"label": {
																						"en": "Footer Link",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		{
																				"link": "#",
																				"label": {
																						"en": "Footer Link",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		}
																]
														},
														{
																"label": "Footer Label",
																"links": [
																		{
																				"link": "#",
																				"label": {
																						"en": "Footer Link",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		{
																				"link": "#",
																				"label": {
																						"en": "Footer Link",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		{
																				"link": "#",
																				"label": {
																						"en": "Footer Link",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		{
																				"link": "#",
																				"label": {
																						"en": "Footer Link",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		},
																		{
																				"link": "#",
																				"label": {
																						"en": "Footer Link",
																						"hasLocalizedValue": "true"
																				},
																				"linkType": "URL"
																		}
																]
														}
												]
										},
										"secondaryFooter": {
												"show": false,
												"copyrightMessage": {
														"en": "",
														"hasLocalizedValue": "true"
												},
												"secondaryFooterLinks": [
														{
																"link": "#",
																"label": {
																		"en": "Footer Link",
																		"hasLocalizedValue": "true"
																},
																"linkType": "URL"
														},
														{
																"link": "#",
																"label": {
																		"en": "Footer Link",
																		"hasLocalizedValue": "true"
																},
																"linkType": "URL"
														},
														{
																"link": "#",
																"label": {
																		"en": "Footer Link",
																		"hasLocalizedValue": "true"
																},
																"linkType": "URL"
														},
														{
																"link": "#",
																"label": {
																		"en": "Footer Link",
																		"hasLocalizedValue": "true"
																},
																"linkType": "URL"
														},
														{
																"link": "#",
																"label": {
																		"en": "Footer Link",
																		"hasLocalizedValue": "true"
																},
																"linkType": "URL"
														}
												]
										}
								},
								"styles": {
										"primaryFooter": {
												"logo": {
														"width": 0,
														"aspectRatio": 1.78
												},
												"utilityImages": {
														"width": 0,
														"aspectRatio": 1
												},
												"linksAlignment": "right",
												"backgroundColor": {
														"bgColor": "bg-palette-primary-dark",
														"textColor": "text-white"
												}
										},
										"secondaryFooter": {
												"linksAlignment": "left",
												"backgroundColor": {
														"bgColor": "bg-palette-primary-light",
														"textColor": "text-black"
												}
										}
								},
								"analytics": {
										"scope": "expandedFooter"
								}
						}
				}
		]
};


console.log(JSON.stringify(data).replace(/"/g, '\\"'));