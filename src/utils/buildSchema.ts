import { SchemaWrapper, LocalBusiness } from "@yext/pages-components";

export function buildSchema(document: Record<string, any>) {
  const localBusiness = document.address && {
    ...LocalBusiness(document),
    paymentAccepted: document.paymentOptions,
    makesOffer: document.services,
  };

  const json = {
    "@graph": [localBusiness].filter(Boolean),
  };

  return SchemaWrapper(json);
}
