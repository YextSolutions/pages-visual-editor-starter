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

export type MessagePayload = {
  entity?: Entity;
  layoutId?: number;
  layouts: Layout[];
  role: string;
  templateId: string;
  visualConfigurationData: string;
  visualConfigurationDataStatus: "successful" | "pending" | "error";
  // entityDocumentData: any; // json object
  // entityDocumentDataStatus: "successful" | "pending" | "error";
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
      visualConfiguration: jsonFromEscapedJsonString(
        layout.visualConfiguration
      ),
      isDefault: layout.isDefault,
      entityIds: layout.entityIds,
      entityCount: layout.entityCount,
    };
  });

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
              data: jsonFromEscapedJsonString(visualConfig.data),
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
    layoutId: messageParams.layoutId,
    layouts: layouts,
    role: messageParams.role,
    templateId: messageParams.templateId,
    // saveState: messageParams.saveState
    //   ? {
    //       history: jsonFromEscapedJsonString(messageParams.saveState.History),
    //       hash: messageParams.saveState.Hash,
    //     }
    //   : undefined,
    visualConfigurationData: JSON.parse(
      messageParams?.visualConfigData?.visualConfigurationData
    ),
    visualConfigurationDataStatus: messageParams.visualConfigDataStatus,
    // entityDocumentData: messageParams?.entityDocumentData,
    // entityDocumentDataStatus: messageParams.entityDocumentDataStatus,
  };
};

// TODO: Remove this when the frontend has been fixed to not string escape
export const jsonFromEscapedJsonString = (escapedJsonString: string) => {
  return JSON.parse(escapedJsonString.replace(/\\"/g, '"'));
};
