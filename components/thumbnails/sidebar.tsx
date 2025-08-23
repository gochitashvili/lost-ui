import { JSX, SVGProps } from "react";

export const SidebarThumbnail = (
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) => (
  <svg width="296" height="141" viewBox="0 0 296 141" fill="none" {...props}>
    <g clipPath="url(#clip0_99_8548)">
      <path
        d="M64 23C64 19.6863 66.6863 17 70 17H226C229.314 17 232 19.6863 232 23V118C232 121.314 229.314 124 226 124H70C66.6863 124 64 121.314 64 118V23Z"
        className="fill-card"
      />
      <mask id="path-3-inside-1_99_8548" fill="white">
        <path d="M64 17H232V29H64V17Z" />
      </mask>
      <path d="M64 17H232V29H64V17Z" className="fill-card" />
      <path
        d="M232 28H64V30H232V28Z"
        className="fill-muted"
        mask="url(#path-3-inside-1_99_8548)"
      />
      <rect x="70" y="21" width="4" height="4" rx="2" className="fill-muted" />
      <rect x="77" y="21" width="4" height="4" rx="2" className="fill-muted" />
      <rect x="84" y="21" width="4" height="4" rx="2" className="fill-muted" />
      <mask id="path-8-inside-2_99_8548" fill="white">
        <path d="M64 29H102V127H64V29Z" />
      </mask>
      <path d="M64 29H102V127H64V29Z" className="fill-card" />
      <path
        d="M101 29V127H103V29H101Z"
        className="fill-muted"
        mask="url(#path-8-inside-2_99_8548)"
      />
      <rect
        x="70"
        y="36"
        width="7"
        height="7"
        rx="3.5"
        className="fill-primary"
      />
      <rect
        x="70"
        y="47"
        width="19"
        height="3"
        rx="1.5"
        className="fill-primary"
      />
      <rect
        x="70"
        y="56"
        width="19"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="70"
        y="65"
        width="19"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="70"
        y="74"
        width="19"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <mask id="path-16-inside-3_99_8548" fill="white">
        <path d="M102 29H233V41H102V29Z" />
      </mask>
    </g>
    <path
      d="M64.5 23C64.5 19.9624 66.9624 17.5 70 17.5H226C229.038 17.5 231.5 19.9624 231.5 23V118C231.5 121.038 229.038 123.5 226 123.5H70C66.9624 123.5 64.5 121.038 64.5 118V23Z"
      className="stroke-muted"
    />
    <defs>
      <clipPath id="clip0_99_8548">
        <path
          d="M64 23C64 19.6863 66.6863 17 70 17H226C229.314 17 232 19.6863 232 23V118C232 121.314 229.314 124 226 124H70C66.6863 124 64 121.314 64 118V23Z"
          fill="white"
        />
      </clipPath>
    </defs>
  </svg>
);
