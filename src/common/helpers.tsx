import { normalizeSlug } from "@yext/visual-editor";

declare const window: any;

export function canonicalUrl(document: Record<string, any>, locale?: string): string {
  let path =  `${locale}/${document.name}`;
  if (locale == 'en') {
    path = `${document.name}`;
  }

  return `https://${document.siteDomain}${normalizeSlug(path)}/`;
}

export const formatDate = (date?: string) => {
  if (!date) {
    return "";
  }

  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const formatPhone = (phone: string) => phone.replace(/^\+?1?(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3");

export function pushClickToDataLayer(linkText: string, linkUrl: string) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'click',
    'event_type': 'button',
    'link_text': linkText,
    'link_url': linkUrl,
  });
}

export function pushOpenModalToDataLayer(isAdvisor: boolean, path: string, name: string) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'modal_view',
    'modal_location': path + '/modal/' + name,
    'modal_title': isAdvisor ? 'Advisor Card' : 'Partner Card',
  });
}

export function pushModalClickToDataLayer(isAdvisor: boolean, name: string, linkText: string) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'modal_click',
    'location_id': isAdvisor ? name + ' advisor card' : name + ' partner card',
    'event_type': 'text',
    'link_text': linkText
  });
}

export function pushContactSubmitToDataLayer(consentToContact: boolean, questionsOrComments: string, salesforceId: string) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'generate_lead',
    'funnel_category': 'contact form',
    'funnel_step_number': '2',
    'funnel_step_name': 'submit',
    'funnel_name': 'advisor contact form',
    'method': 'consent to contact - ' + consentToContact,
    'additional_info': questionsOrComments,
    'transaction_id': salesforceId,
  });
}