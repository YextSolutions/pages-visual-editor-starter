export type TemplateDefinition = {
  name: string;
  id: string;
  entityTypes: string[];
};

export type EntityDefinition = {
  name: string,
  externalId: string,
  internalId: string,
};

export type LayoutDefinition = {
  name: string,
  externalId: string,
  internalId: string,
  visualConfiguration: {
    template: string,
    data: string,
  },
}