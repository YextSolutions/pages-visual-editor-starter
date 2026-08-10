// @ts-nocheck
import { PuckComponent } from "@puckeditor/core";
import { AssetVideo } from "@yext/visual-editor/section-library-support";
import { msg } from "@yext/visual-editor/section-library-support";
import { VideoAtom } from "../atoms/video";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";

export type VideoProps = {
  data: {
    /** The embedded YouTube video */
    assetVideo: AssetVideo | undefined;
  };

  /** @internal */
  className?: string;
};

const videoFields: YextFields<VideoProps> = {
  data: {
    type: "object",
    label: msg("fields.data", "Data"),
    objectFields: {
      assetVideo: {
        type: "video",
        label: msg("fields.video", "Video"),
      },
    },
  },
};

const VideoComponent: PuckComponent<VideoProps> = (props) => {
  const {
    data,
    puck: { isEditing, dragRef },
  } = props;

  return data?.assetVideo?.video?.embeddedUrl ? (
    <div ref={dragRef} className="h-full w-full">
      <VideoAtom
        youTubeEmbedUrl={data.assetVideo.video.embeddedUrl}
        title={data?.assetVideo?.video?.title ?? ""}
        className={props.className ?? "lg:w-4/5 mx-auto mt-8"}
      />
    </div>
  ) : isEditing ? (
    <div ref={dragRef} className="h-20 mt-8"></div>
  ) : (
    <></>
  );
};

export const Video: YextComponentConfig<VideoProps> = {
  fields: videoFields,
  label: msg("components.video", "Video"),
  inline: true,
  defaultProps: {
    data: {
      assetVideo: undefined,
    },
  },
  render: (props) => <VideoComponent {...props} />,
};
