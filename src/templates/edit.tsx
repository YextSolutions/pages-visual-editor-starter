import "../index.css";
import {
  Template,
  GetPath,
  TemplateConfig,
  TemplateProps,
  TemplateRenderProps,
} from "@yext/pages";
import { Editor, TemplateDefinition } from "../puck/editor";
import { DocumentProvider } from "../hooks/useDocument";
import useEntityDocumentQuery from "../hooks/queries/useEntityDocumentQuery";
import { useEffect, useState } from "react";
import { fetchTemplates } from "../utils/api";
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
  const [template, setTemplate] = useState<TemplateDefinition>();
  const [entityId, setEntityId] = useState<string>("");
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
      setTemplate(targetTemplate);
      const targetLayoutId = getUrlParam("layoutId");
      setLayoutId(targetLayoutId);
      const targetEntityId = getUrlParam("entityId");
      setEntityId(targetEntityId);
      // get puckConfig from hardcoded map
      const puckConfig = puckConfigs.get(targetTemplate.id);
      if (getPuckRole() && targetTemplate?.id && targetLayoutId && targetEntityId) {
        setLocaleStorage(
            typeof window !== "undefined"
                ? window.localStorage.getItem(
                getLocalStorageKey(
                    getPuckRole(),
                    targetTemplate.id,
                    targetLayoutId,
                    targetEntityId
                )
            ) ?? "" : ""
        );
      }
      setPuckConfig(puckConfig);
    }
    setMounted(true);
    getData();
  }, []);

  let puckData = GetPuckData(
      getPuckRole(),
      siteEntityId,
      template?.id ?? "",
      layoutId,
      entityId
  );
  // use localStorage if it exists
  if (localStorage) {
    puckData = localStorage;
  }

  // get the document
  const { entityDocument } = useEntityDocumentQuery({
    templateId: template?.id,
    entityId: entityId,
  });
  const document = entityDocument?.response.document;

  const loadingMessage = !template ? "Loading templates.."
      : !puckConfig ? "Loading configuration.."
          : !puckData ? "Loading data.."
              : !document ? "Loading document.."
                  : "";

  const isLoading =
      !document ||
      !puckData ||
      !puckConfig ||
      !template ||
      !template ||
      !entityId;

  const progress: number =
      (100 *
          ((template ? 1 : 0) + (puckConfig ? 1 : 0) + (puckData ? 1 : 0) + (document ? 1 : 0))) /
      4;

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
                    entityId={entityId}
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
