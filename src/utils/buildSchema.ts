import { SchemaWrapper, LocalBusiness, FAQPage } from "@yext/pages-components";

export function buildSchema(document: Record<string, any>) {
  const localBusiness = document.address && {
    ...LocalBusiness(document),
    paymentAccepted: document.paymentOptions,
    makesOffer: document.services,
  };

  const faqs =
    document.c_faqSection?.linkedFAQs &&
    FAQPage(document.c_faqSection.linkedFAQs);

  const json = {
    "@graph": [localBusiness, faqs].filter(Boolean),
  };

  return SchemaWrapper(json);
}
