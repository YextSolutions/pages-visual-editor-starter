import "../index.css";
import {
  Template,
  GetPath,
  TemplateConfig,
  TemplateProps,
  TemplateRenderProps,
} from "@yext/pages";
import { Editor, EntityDefinition, TemplateDefinition } from "../puck/editor";
import { DocumentProvider } from "../hooks/useDocument";
import useEntityDocumentQuery from "../hooks/queries/useEntityDocumentQuery";
import { useEffect, useState } from "react";
import { fetchEntities, fetchTemplates } from "../utils/api";
import { Config } from "@measured/puck";
import { puckConfigs } from "../puck/puck.config";
import { LoadingScreen } from "../components/puck-overrides/LoadingScreen";
import { toast } from "sonner";
import { Toaster } from "../components/ui/Toaster";
import { getLocalStorageKey } from "../utils/localStorageHelper";
import { GetPuckData } from "../hooks/GetPuckData";

export const Role = {
  GLOBAL: "global",
  INDIVIDUAL: "individual",
};
const siteEntityId = "site";
const layoutEntityType = "ce_pagesLayout";

export const config: TemplateConfig = {
  name: "edit",
};

// Editor is avaliable at /edit
export const getPath: GetPath<TemplateProps> = () => {
  return `edit`;
};

const getUrlParam = (paramName: string): string => {
  if (typeof document !== "undefined") {
    const params = new URL(document.location.toString()).searchParams;
    const paramValue = params.get(paramName);
    if (paramValue) {
      return paramValue;
    }
  }
  return "";
};

const getPuckRole = (): string => {
  if (typeof document !== "undefined") {
    const params = new URL(document.location.toString()).searchParams;
    const roleValue = params.get("role");
    if (roleValue === "individual") {
      return Role.INDIVIDUAL;
    }
  }
  return Role.GLOBAL;
};

// Render the editor
const Edit: Template<TemplateRenderProps> = () => {
  const [templates, setTemplates] = useState<TemplateDefinition[]>();
  const [template, setTemplate] = useState<TemplateDefinition>();
  const [entities, setEntities] = useState<EntityDefinition[]>();
  const [entity, setEntity] = useState<EntityDefinition>();
  const [layoutId, setLayoutId] = useState<string>("");
  const [puckConfig, setPuckConfig] = useState<Config>();
  const [mounted, setMounted] = useState<boolean>(false);
  const [localStorage, setLocaleStorage] = useState<string>("");

  useEffect(() => {
    async function getData() {
      // get templates
      const fetchedTemplates = await fetchTemplates();
      let targetTemplate: TemplateDefinition = fetchedTemplates[0];
      const urlTemplateId = getUrlParam("templateId");
      if (urlTemplateId) {
        let found = false;
        fetchedTemplates.forEach((fetchedTemplate: TemplateDefinition) => {
          if (fetchedTemplate.id === urlTemplateId) {
            targetTemplate = fetchedTemplate;
            found = true;
          }
        });
        if (!found) {
          toast.error(`Could not find template with id '${urlTemplateId}'`);
        }
      }
      let targetLayoutId = getUrlParam("layoutId");
      if (!targetLayoutId) {
        const fetchedLayouts = await fetchEntities([layoutEntityType]);
        targetLayoutId = fetchedLayouts[0].externalId;
      }
      setLayoutId(targetLayoutId);
      setTemplates(fetchedTemplates);
      setTemplate(targetTemplate);
      // get entities
      const fetchedEntities = await fetchEntities(targetTemplate.entityTypes);
      let targetEntity: EntityDefinition = fetchedEntities[0];
      const urlEntityId = getUrlParam("entityId");
      if (urlEntityId) {
        let found = false;
        fetchedEntities.forEach((fetchedEntity: EntityDefinition) => {
          if (fetchedEntity.externalId === urlEntityId) {
            targetEntity = fetchedEntity;
            found = true;
          }
        });
        if (!found) {
          toast.error(
            `Could not find entity with id '${urlEntityId}' belonging to template '${targetTemplate.id}'`,
          );
        }
      }
      setEntities(fetchedEntities);
      setEntity(targetEntity);
      // get puckConfig from hardcoded map
      const puckConfig = puckConfigs.get(targetTemplate.id);
      setLocaleStorage(
        typeof window !== "undefined"
          ? window.localStorage.getItem(
              getLocalStorageKey(
                getPuckRole(),
                targetTemplate.id,
                targetLayoutId,
                targetEntity.externalId,
              ),
            ) ?? ""
          : "",
      );
      setPuckConfig(puckConfig);
      window.history.replaceState(
        null,
        "",
        `edit?templateId=${targetTemplate.id}&layoutId=${targetLayoutId}&entityId=${targetEntity.externalId}&role=${getPuckRole()}`,
      );
    }
    setMounted(true);
    getData();
  }, []);

  let puckData = GetPuckData(
    getPuckRole(),
    siteEntityId,
    template?.id ?? "",
    layoutId,
    entity?.externalId ?? "",
  );
  // use localStorage if it exists
  if (localStorage) {
    puckData = localStorage;
  }

  // get the document
  const { entityDocument } = useEntityDocumentQuery({
    templateId: template?.id,
    entityId: entity?.externalId,
  });
  const document = entityDocument?.response.document;

  const loadingMessage = !templates
    ? "Loading templates.."
    : !entities
      ? "Loading entities.."
      : !puckConfig
        ? "Loading configuration.."
        : !puckData
          ? "Loading data.."
          : !document
            ? "Loading document.."
            : "";

  const isLoading =
    !document ||
    !puckData ||
    !puckConfig ||
    !template ||
    !templates ||
    !entity ||
    !entities;

  const progress: number =
    (100 *
      (!!templates + !!entities + !!puckConfig + !!puckData + !!document)) /
    5;

  if (!mounted || typeof navigator === "undefined") {
    return <></>;
  }

  return (
    <>
      <DocumentProvider value={document}>
        {!isLoading && !!puckData ? (
          <>
            <Editor
              selectedTemplate={template}
              layoutId={layoutId ?? ""}
              entityId={entity?.externalId ?? ""}
              puckConfig={puckConfig}
              puckData={puckData}
              role={getPuckRole()}
              isLoading={isLoading}
            />
          </>
        ) : (
          <LoadingScreen progress={progress} message={loadingMessage} />
        )}
      </DocumentProvider>
      <Toaster closeButton richColors />
    </>
  );
};
export default Edit;
