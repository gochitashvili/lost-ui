import { BlocksMetadata, categoryIds } from "./declarations";

export const blocksMetadata: BlocksMetadata[] = [
  {
    id: "navbar-01",
    category: categoryIds.Navbars,
    name: "Navbar",
    iframeHeight: "500px",
    type: "file",
  },

  {
    id: "footer-01",
    category: categoryIds.Footers,
    name: "Simple Footer",
    iframeHeight: "1000px",
    type: "directory",
  },
];
