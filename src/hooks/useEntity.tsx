import {useQueries, useQuery} from "@tanstack/react-query";
import { fetchEntity } from "../utils/api";
import { Role } from "../templates/edit";
import React from "react";

const entityVisualConfigurationsFieldId = "c_visualConfigurations";
const entityPagesLayoutsFieldId = "c_pages_layouts";
const layoutVisualConfigurationFieldId = "c_visualConfiguration";
const sitePagesLayoutsFieldId = "c_visualLayouts";

export type VisualConfiguration = {
  template: string;
  data: string;
}

// used to track 'priority' of data, where lower is prioritized
enum DataSource {
  Entity = 0,
  EntityLayout = 1,
  SiteLayout = 2,
  None = 3
}

/**
 * For role 'individual', first searches the entity for a matching layout.
 * Then searches the related Page Layouts for a match.
 * Finally, gets the Site entity and searches the Page Layouts connected to the site entity.
 *
 * For role 'global', simply uses the Site entity.
 */
export const GetPuckData = (
  siteEntityId: string,
  role: string,
  templateId?: string,
  entityId?: string,
): string => {
  const [data, setData] = React.useState("");
  const [dataSource, setDataSource] = React.useState(DataSource.None);

  const {entity, status} = useEntity(entityId ?? "", dataSource > DataSource.EntityLayout && role === Role.INDIVIDUAL);
  const entityPageLayoutIds: string[] = [];
  if (templateId && role === Role.INDIVIDUAL && status === "success" && entity?.response) {
    // look for c_visualConfigurations directly on the entity
    const configs = entity?.response[entityVisualConfigurationsFieldId] ?? [];
    configs.forEach((config: VisualConfiguration) => {
      if (dataSource > DataSource.Entity && config.template === templateId) {
        setDataSource(DataSource.Entity);
        setData(config.data);
      }
    });
    // get the layout entity ids in c_pages_layouts to search
    const pagesLayouts = entity?.response[entityPagesLayoutsFieldId] ?? [];
    pagesLayouts.forEach((pagesLayout: string) => {
      entityPageLayoutIds.push(pagesLayout);
    });
  }
  // get the layout entities related to the base entity
  const entityLayouts = useEntities(entityPageLayoutIds, dataSource > DataSource.EntityLayout && role === Role.INDIVIDUAL);
  entityLayouts.forEach((result: {entity: any, status: string}) => {
    if (templateId && result.status === "success" && result.entity?.response) {
      const layout = result.entity.response[layoutVisualConfigurationFieldId];
      if (layout["data"] && layout["template"] === templateId) {
        if (dataSource > DataSource.EntityLayout) {
          setDataSource(DataSource.EntityLayout);
          setData(layout["data"]);
        }
      }
    }
  });
  // get data from the site entity
  const toGetSiteData = (role === Role.GLOBAL && !data) || (dataSource > DataSource.SiteLayout);
  const sitePagesLayoutsIds: string[] = [];
  const {entity: siteEntity, status: siteEntityStatus} = useEntity(siteEntityId, toGetSiteData);
  if (siteEntityStatus === "success" && siteEntity.response?.[sitePagesLayoutsFieldId]) {
    // read the c_visualLayouts field off the Site entity
    siteEntity.response[sitePagesLayoutsFieldId].forEach((visualLayout: string) => {
      sitePagesLayoutsIds.push(visualLayout);
    })
  }
  // pull the layouts from the Site entity and search for the matching layout
  const siteLayouts = useEntities(sitePagesLayoutsIds, toGetSiteData);
  siteLayouts.forEach((result: {entity: any, status: string}) => {
    if (templateId && result.status === "success" && result.entity?.response[layoutVisualConfigurationFieldId]) {
      const layout = result.entity.response[layoutVisualConfigurationFieldId];
      if (layout["data"] && layout["template"] === templateId) {
        if (dataSource > DataSource.SiteLayout) {
          setDataSource(DataSource.SiteLayout);
          setData(layout["data"]);
        }
      }
    }
  });
  return data;
};

const useEntity = (entityId: string, isEnabled: boolean) => {
  const { data: entity, status: status } = useQuery({
    queryKey: ["entity", entityId],
    queryFn: async () => {
      if (!entityId) return null;
      return await fetchEntity(entityId);
    },
    enabled: !!entityId && isEnabled,
  });
  return { entity, status };
};

const useEntities = (entityIds: string[], isEnabled: boolean) => {
  const queries = entityIds.map((entityId: string) => {
    return {
      queryKey: ["entityId", entityId],
      queryFn: async () => {
        if (!entityId) return null;
        return await fetchEntity(entityId);
      },
      enabled: !!entityId && isEnabled,
    }
  });
  return useQueries({
    queries: queries
  }).map(result => {
    return {
      entity: result?.data,
      status: result?.status ?? "pending"
    }
  });
}

export default useEntity;
