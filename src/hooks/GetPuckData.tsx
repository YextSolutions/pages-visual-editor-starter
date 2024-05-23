import { Role } from "../templates/edit";
import {
  baseEntityPageLayoutsField,
  baseEntityVisualConfigField,
  LayoutDefinition,
  VisualConfiguration,
} from "../puck/editor";
import { useState } from "react";
import { useEntity, useLayouts } from "./useEntity";

// used to track 'priority' of data, where lower is prioritized
enum DataSource {
  Entity = 0,
  LayoutId = 1,
  EntityLayout = 2,
  SiteLayout = 3,
  AnyLayout = 4,
  None = 5,
}

type TemplateData = {
  data: string;
  source: DataSource;
};

/**
 * Gets the puck data using the configuration directly on the baseEntity, then falling back to
 * the Page Layout referenced by the base entity, and failing that gets the Page Layout referenced
 * by the Site entity.
 *
 * The data directly on the base entity is only used for role 'individual'.
 */
export const GetPuckData = (
  role: string,
  siteEntityId: string,
  templateId: string,
  layoutId: string,
  entityId: string,
): string => {
  const [data, setData] = useState<TemplateData>({
    data: "",
    source: DataSource.None,
  });

  const { entity: baseEntity, status: baseEntityStatus } = useEntity(entityId);
  const { entity: siteEntity, status: siteEntityStatus } =
    useEntity(siteEntityId);
  const { layouts, status: layoutStatus } = useLayouts();

  // get puck data off base entity for ICs
  const baseEntityPageLayoutIds: string[] = [];
  if (baseEntityStatus === "success" && baseEntity?.response) {
    const configs = baseEntity.response[baseEntityVisualConfigField] ?? [];
    configs.forEach((config: VisualConfiguration) => {
      // only use the data directly off the entity for role 'INDIVIDUAL'
      if (
        templateId &&
        config.template === templateId &&
        data.source > DataSource.Entity &&
        role === Role.INDIVIDUAL
      ) {
        setData({
          data: config.data,
          source: DataSource.Entity,
        });
      }
    });
    (baseEntity?.response[baseEntityPageLayoutsField] ?? []).forEach(
      (id: string) => {
        baseEntityPageLayoutIds.push(id);
      },
    );
  }

  // get siteEntity layout ids from the site entity
  const siteEntityPageLayoutIds: string[] = [];
  if (siteEntityStatus === "success") {
    (siteEntity?.response[baseEntityPageLayoutsField] ?? []).forEach(
      (id: string) => {
        siteEntityPageLayoutIds.push(id);
      },
    );
  }

  if (layoutStatus === "success" && layouts) {
    layouts.forEach((layout: LayoutDefinition) => {
      // apply the layoutId data, unless we have data from the base entity
      if (layout.externalId === layoutId) {
        if (layout.visualConfiguration.template !== templateId) {
          throw new Error(
            "Mismatch between layout and template: " +
              layoutId +
              ", " +
              templateId,
          );
        }
        if (role === Role.GLOBAL && data.source > DataSource.LayoutId) {
          setData({
            data: layout.visualConfiguration.data,
            source: DataSource.LayoutId,
          });
        }
      }
      // fallback to layout related to entity, related to the site, or just matching the template
      if (layout.visualConfiguration.template === templateId) {
        if (
          data.source > DataSource.EntityLayout &&
          baseEntityPageLayoutIds.includes(layout.externalId)
        ) {
          setData({
            data: layout.visualConfiguration.data,
            source: DataSource.EntityLayout,
          });
        }
        if (
          data.source > DataSource.SiteLayout &&
          siteEntityPageLayoutIds.includes(layout.externalId)
        ) {
          setData({
            data: layout.visualConfiguration.data,
            source: DataSource.SiteLayout,
          });
        }
        if (data.source > DataSource.AnyLayout) {
          setData({
            data: layout.visualConfiguration.data,
            source: DataSource.AnyLayout,
          });
        }
      }
    });
  }

  return data.data;
};
