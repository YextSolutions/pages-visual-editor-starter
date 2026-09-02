import { DropZone, type Config } from "@puckeditor/core";
import { resolveDirectoryRootProps } from "@yext/visual-editor/section-library-support";

// The Puck Root configuration for directory page sets
export const directoryRootConfig: NonNullable<Config["root"]> = {
  resolveData: (data: any, params: any) => ({
    ...data,
    props: resolveDirectoryRootProps(data.props ?? {}, params.metadata?.streamDocument ?? {}),
  }),
  render: () => <DropZone zone="default-zone" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }} disallow={[]}/>,
};

// The Puck Root configuration for locator page sets
export const locatorRootConfig: NonNullable<Config["root"]> = {
  render: () => <DropZone zone="default-zone" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }} disallow={[]}/>,
};
