import React from "react";

import * as components from "./components";

const blocksComponents: { [blocksId: string]: React.ElementType } = {
  "file-upload-01": components.FileUpload01,
  "file-upload-02": components.FileUpload02,
};

export default blocksComponents;
