import { DropZone, type Config } from "@puckeditor/core";
import { resolveDirectoryRootProps } from "@yext/visual-editor/section-library-support";

const rootStyle = { display: "flex", flexDirection: "column", minHeight: "100vh" } as const;

export const directoryRootConfig: NonNullable<Config["root"]> = {
  resolveData: (data: any, params: any) => ({
    ...data,
    props: resolveDirectoryRootProps(data.props ?? {}, params.metadata?.streamDocument ?? {}),
  }),
  render: () => <DropZone zone="default-zone" style={rootStyle} disallow={[]}/>,
};

export const locatorRootConfig: NonNullable<Config["root"]> = {
  render: () => <DropZone zone="default-zone" style={rootStyle} disallow={[]}/>,
};
