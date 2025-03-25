import * as components from "./components";

const blocksComponents: { [blocksId: string]: React.ElementType } = {
  "file-upload-01": components.FileUpload01,
  "file-upload-02": components.FileUpload02,
  "file-upload-03": components.FileUpload03,
  "file-upload-04": components.FileUpload04,
  "file-upload-05": components.FileUpload05,

  "form-layout-01": components.FormLayout01,
  "form-layout-02": components.FormLayout02,
  "form-layout-03": components.FormLayout03,
  "form-layout-04": components.FormLayout04,
};

export default blocksComponents;
