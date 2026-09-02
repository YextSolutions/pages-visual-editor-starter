import { YextFields } from "@yext/visual-editor/section-library-support";
import { ImageFillType } from "@yext/visual-editor/section-library-support";
import { msg } from "@yext/visual-editor/section-library-support";

/** Props for displaying an image */
export interface ImageStylingProps {
  /** The aspect ratio of the image */
  aspectRatio: number;
  width?: number;
  imageConstrain?: "fill" | "fixed";
  imageFillType?: ImageFillType;
}

export const ImageStylingFields: YextFields<ImageStylingProps> = {
  imageConstrain: {
    label: msg("fields.imageConstrain", "Image Constrain"),
    type: "radio",
    options: [
      {
        label: msg("fields.options.fillContainer", "Fill Container"),
        value: "fill",
      },
      {
        label: msg("fields.options.fixedWidth", "Fixed Width"),
        value: "fixed",
      },
    ],
    visible: false,
  },
  imageFillType: {
    type: "basicSelector",
    label: msg("fields.imageFillType", "Image Fill Type"),
    options: [
      { label: msg("fields.options.fill", "Fill"), value: "fill" },
      { label: msg("fields.options.fit", "Fit"), value: "fit" },
    ],
  },
  width: {
    type: "number",
    label: msg("fields.options.width", "Width"),
    min: 0,
  },
  aspectRatio: {
    type: "basicSelector",
    label: msg("fields.options.aspectRatio", "Aspect Ratio"),
    options: [
      { label: "1:1", value: 1 },
      { label: "5:4", value: 1.25 },
      { label: "4:3", value: 1.33 },
      { label: "3:2", value: 1.5 },
      { label: "5:3", value: 1.67 },
      { label: "16:9", value: 1.78 },
      { label: "2:1", value: 2 },
      { label: "3:1", value: 3 },
      { label: "4:1", value: 4 },
      { label: "4:5", value: 0.8 },
      { label: "3:4", value: 0.75 },
      { label: "2:3", value: 0.67 },
      { label: "3:5", value: 0.6 },
      { label: "9:16", value: 0.56 },
      { label: "1:2", value: 0.5 },
      { label: "1:3", value: 0.33 },
      { label: "1:4", value: 0.25 },
    ],
  },
};
