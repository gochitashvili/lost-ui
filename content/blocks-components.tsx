import * as components from "./components";
import { blocksMetadata } from "./blocks-metadata";

// Create a placeholder component for directory type blocks
const DirectoryBlockPlaceholder = () => {
  return <div>Directory block - handled by preview page</div>;
};

// Build the components object dynamically based on block metadata
export const blocksComponents: { [blocksId: string]: React.ElementType } = {};

// Populate the components object
blocksMetadata.forEach((block) => {
  if (block.type === "directory") {
    // For directory blocks, use placeholder (actual rendering happens in preview page)
    blocksComponents[block.id] = DirectoryBlockPlaceholder;
  } else {
    // For file blocks, use the imported component
    const component = components[block.id as keyof typeof components];
    if (component) {
      blocksComponents[block.id] = component as React.ElementType;
    }
  }
});
