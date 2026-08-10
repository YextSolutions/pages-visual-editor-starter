// @ts-nocheck
import { themeManagerCn } from "@yext/visual-editor/section-library-support";
import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";
import { FaEyeSlash } from "react-icons/fa";

interface VisibilityWrapperProps {
  liveVisibility: boolean;
  isEditing: boolean;
  iconSize?: VariantProps<typeof wrapperVariants>["size"];
  children: React.ReactNode;
}

export const wrapperVariants = cva("components", {
  variants: {
    size: {
      md: "text-3xl",
      lg: "text-7xl",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

export const VisibilityWrapper: React.FC<VisibilityWrapperProps> = ({
  liveVisibility,
  isEditing,
  iconSize,
  children,
}) => {
  if (liveVisibility === undefined) {
    return <>{children}</>;
  }

  if (!liveVisibility && !isEditing) {
    return null;
  }

  if (!liveVisibility && isEditing) {
    return (
      <div className="relative">
        <div className="opacity-30">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <FaEyeSlash
            className={themeManagerCn(
              wrapperVariants({ size: iconSize }),
              "fill-gray-500"
            )}
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
