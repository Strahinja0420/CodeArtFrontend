import type { DetailedHTMLProps, HTMLAttributes, CSSProperties } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          "camera-controls"?: boolean;
          "auto-rotate"?: boolean;
          "touch-action"?: string;
          style?: CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}
