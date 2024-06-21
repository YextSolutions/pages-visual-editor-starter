export type VisualConfiguration = {
  template: string;
  data: string;
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
  visualConfiguration: string;
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

export type Template = {
  id: string;
  name: string;
  scope: Scope;
  entityTypes: string[];
};

export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export type SaveState = {
  history: JSONValue;
  hash: string;
};

export type MessagePayload = {
  entity?: Entity;
  externalEntityId?: string;
  externalLayoutId?: string;
  layoutId?: number;
  layouts: Layout[];
  role: string;
  template: Template;
  templateId: string;
  saveState?: SaveState;
};

export const convertRawMessageToObject = (
  messageParams: any
): MessagePayload => {
  const layouts: Layout[] = (messageParams.layouts || []).map((layout: any) => {
    return {
      id: layout.id,
      externalId: layout.externalId,
      name: layout.name,
      templateId: layout.templateId,
      visualConfiguration: layout.visualConfiguration,
      isDefault: layout.isDefault,
      entityIds: layout.entityIds,
      entityCount: layout.entityCount,
    };
  });

  const layoutForExternalLayoutId = layouts.find(
    (layout: Layout) => layout.externalId === messageParams.layoutId
  );

  return {
    entity: messageParams.entity
      ? {
          id: messageParams.entity.internalId,
          externalId: messageParams.entity.externalId,
          name: messageParams.entity.name,
          layoutIds: messageParams.entity.layoutIds,
          visualConfigurations: (
            messageParams.entity.c_visualConfigurations || []
          ).map((visualConfig: any) => {
            return {
              template: visualConfig.template,
              data: JSON.parse(visualConfig.data),
            };
          }),
          layouts: (messageParams.entity.c_pages_layouts || []).map(
            (layout: any) => {
              return {
                id: layout.id,
              };
            }
          ),
        }
      : undefined,
    externalEntityId: messageParams.entityId,
    externalLayoutId: messageParams.layoutId,
    layoutId: layoutForExternalLayoutId?.id,
    layouts: layouts,
    role: messageParams.role,
    template: {
      id: messageParams.template.id,
      name: messageParams.template.name,
      scope: {
        entityIds: messageParams.template.entities,
        entityTypeIds: messageParams.template.entityTypeIds,
        savedSearchIds: messageParams.template.savedSearches,
        locales: messageParams.template.locales,
      },
      entityTypes: messageParams.template.entityTypes,
    },
    templateId: messageParams.templateId,
    saveState: messageParams.saveState
      ? {
          history: messageParams.saveState.History,
          hash: messageParams.saveState.Hash,
        }
      : undefined,
  };
};
