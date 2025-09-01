import { JSX, SVGProps } from "react";

export const AIThumbnail = (
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) => (
  <svg
    width="296"
    height="141"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M8 16v-6a2 2 0 1 1 4 0v6" />
    <path d="M8 13h4" />
    <path d="M16 8v8" />
  </svg>
);
