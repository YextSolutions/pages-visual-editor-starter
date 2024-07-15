export type VisualConfiguration = {
  template: string;
  data: any; // json object
};

export type Entity = {
  id: number;
  externalId: string;
  name: string;
  layoutIds: number[];
  visualConfigurations: VisualConfiguration[];
  layouts: EntityLayout[];
};

export type EntityLayout = {
  id: number;
};

export type Layout = {
  id: number;
  externalId: string;
  name: string;
  templateId: string;
  visualConfiguration: any; // json object
  isDefault: boolean;
  entityIds: number[]; // internal
  entityCount: number;
};

// All ids are the internalIds
export type Scope = {
  entityIds: number[];
  entityTypeIds: number[];
  savedSearchIds: number[];
  locales: string[];
};

export type SaveState = {
  history: any; // json object
  hash: string;
};

export type TemplateMetadata = {
  role: string;
  templateId: string;
  layoutId?: number;
  entity?: Entity;
};

export const jsonFromEscapedJsonString = (escapedJsonString: string) => {
  return JSON.parse(escapedJsonString.replace(/\\"/g, '"'));
};
