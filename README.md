# blocks

![image](./app/opengraph-image.png)

Accessible and customizable blocks that you can copy and paste into your apps. Free. Open Source.

## Usage

To use blocks from this registry, configure your `components.json` file with the remote registry:

```json
{
  "registries": {
    "@lost-ui": "https://lost-ui.vercel.app/r/{name}.json"
  }
}
```

Then add blocks to your project using the shadcn CLI:

```bash
# Add a specific block
npx shadcn@latest add @lost-ui/login-01

# Add a dialog block
npx shadcn@latest add @lost-ui/dialog-01

# Add a sidebar block
npx shadcn@latest add @lost-ui/sidebar-01
```

Alternatively, you can add blocks directly from the registry:

```bash
# Using the direct registry URL
npx shadcn@latest add https://lost-ui.vercel.app/r/login-01.json
```

Visit [lost-ui.vercel.app](https://lost-ui.vercel.app) to view the full documentation and browse all available blocks with live previews.

## Development

### Prerequisites

- Node.js 18+ or Bun
- Git

### Getting Started

1. Clone the repository:

```bash
git clone https://github.com/gochitashvili/lost-ui.git
cd lost-ui
```

2. Install dependencies:

```bash
bun install
# or
npm install
```

3. Start the development server:

```bash
bun dev
# or
npm run dev
```

### Adding New Categories

To create a new category for blocks, use the `add-category` script:

```bash
# Create a new category (category name only)
npx tsx scripts/add-category.ts "Forms"

# Create multi-word category
npx tsx scripts/add-category.ts "Authentication Pages"

# Create category with special characters
npx tsx scripts/add-category.ts "E-commerce"
```

**Example:**

```bash
# Create a "Tables" category
npx tsx scripts/add-category.ts "Tables"

# This creates category ID "tables" automatically from "Tables"
```

This will:

- Create `content/components/tables/` directory (legacy structure)
- Create `components/lost-ui/tables/` directory (new structure for blocks)
- Add the category to `content/blocks-categories.tsx`
- Update `content/declarations.ts` with the new category ID
- Create thumbnail component in `components/thumbnails/tables.tsx`
- Create necessary index files for exports

**Note:** The script automatically generates the category ID from the name:

- "Tables" → ID: "tables"
- "Authentication Pages" → ID: "authentication-pages"
- "E-commerce" → ID: "e-commerce"

### Adding New Blocks

Use the `add-block` script to create new blocks in existing categories:

#### File-type Blocks (Single Component)

```bash
# Basic file block
npx tsx scripts/add-block.ts --category navbars --name "Navigation Bar 02" --id navbar-02 --type file

# File block with custom iframe height
npx tsx scripts/add-block.ts --category forms --name "Contact Form" --id contact-form --type file --height 600px
```

**Example:**

```bash
# Create a login form block
npx tsx scripts/add-block.ts --category auth --name "Login Form" --id login-form --type file --height 500px
```

#### Directory-type Blocks (Multi-file Components)

```bash
# Directory block for complex components
npx tsx scripts/add-block.ts --category tables --name "Advanced Data Table" --id advanced-table --type directory
```

**Example:**

```bash
# Create a dashboard layout with multiple files
npx tsx scripts/add-block.ts --category layouts --name "Dashboard Layout" --id dashboard-layout --type directory --height 800px
```

### Removing Blocks

Use the `remove-block` script to remove existing blocks from categories:

```bash
# Remove a block by category and ID
npx tsx scripts/remove-block.ts --category navbars --id navbar-01

# Remove a directory-type block
npx tsx scripts/remove-block.ts --category layouts --id dashboard-layout
```

**Example:**

```bash
# Remove a contact form block
npx tsx scripts/remove-block.ts --category forms --id contact-form
```

This will:

- Remove the component file(s) from `components/lost-ui/{category}/`
- Update `content/blocks-metadata.ts` to remove the block entry
- Update `content/blocks-components.tsx` to remove the component reference
- Update `components/lost-ui/{category}/index.ts` to remove the export
- Regenerate markdown documentation

**Note:** The script will show available blocks if you try to remove a non-existent block.

### Block Structure

#### File-type Block Structure

```
components/lost-ui/
└── category/
    ├── index.ts                 # Exports
    └── block-id.tsx            # Single component file
```

#### Directory-type Block Structure

```
components/lost-ui/
└── category/
    ├── index.ts                 # Exports
    └── block-id/               # Block directory
        ├── index.tsx           # Main component
        ├── components/         # Sub-components (optional)
        ├── hooks/             # Custom hooks (optional)
        └── lib/               # Utilities (optional)
```

### Complete Workflow Example

Here's how to add a complete new category with blocks:

1. **Create a new category:**

```bash
npx tsx scripts/add-category.ts --name "E-commerce" --id "ecommerce" --description "Shopping cart, product cards, and checkout components"
```

2. **Add file-type blocks:**

```bash
# Product card
npx tsx scripts/add-block.ts --category ecommerce --name "Product Card" --id product-card --type file --height 400px

# Shopping cart
npx tsx scripts/add-block.ts --category ecommerce --name "Shopping Cart" --id shopping-cart --type file --height 500px
```

3. **Add directory-type block:**

```bash
# Complex checkout flow
npx tsx scripts/add-block.ts --category ecommerce --name "Checkout Flow" --id checkout-flow --type directory --height 700px
```

4. **Update the registry:**

```bash
npx tsx scripts/generate-registry.ts
```

5. **Test your components:**

```bash
bun dev
```

### Registry Generation

After adding or modifying blocks, regenerate the registry:

```bash
npx tsx scripts/generate-registry.ts
```

This creates:

- `public/r/registry.json` - Main registry file
- `public/r/{block-id}.json` - Individual block registry files

### Best Practices

1. **Component Naming**: Use PascalCase for component names and kebab-case for IDs
2. **Dependencies**: Only include necessary dependencies in your components
3. **Accessibility**: Ensure all components follow accessibility guidelines
4. **Responsive Design**: Make components work on all screen sizes
5. **TypeScript**: Use TypeScript for better development experience

### File Locations

- **Components**: `components/lost-ui/{category}/{block-id}.tsx`
- **Metadata**: `content/blocks-metadata.ts`
- **Categories**: `content/blocks-categories.tsx`
- **Registry**: `public/r/registry.json`
- **Thumbnails**: `components/thumbnails/{category}.tsx`
- **Legacy Components**: `content/components/{category}/` (for backward compatibility)

### Scripts Reference

#### Development Scripts

```bash
# Start development server
bun dev

# Build for production
bun build

# Generate registry
npx tsx scripts/generate-registry.ts

# Generate markdown documentation
bun run generate:markdown

# Format code with Prettier
bun run format

# Check code formatting
bun run format:check
```

#### Block Management Scripts

```bash
# Add new category
npx tsx scripts/add-category.ts "Category Name"

# Add file-type block
npx tsx scripts/add-block.ts --category <category> --name "<name>" --id <id> --type file [--height <height>]

# Add directory-type block
npx tsx scripts/add-block.ts --category <category> --name "<name>" --id <id> --type directory [--height <height>]

# Remove existing block
npx tsx scripts/remove-block.ts --category <category> --id <id>
```

### Installation for Users

Users can install components from this registry using the shadcn CLI:

```bash
# Configure components.json
{
  "registries": {
    "@lost-ui": "https://lost-ui.vercel.app/r/{name}.json"
  }
}

# Install components
npx shadcn@latest add @lost-ui/navbar-01
```

Components will be installed to `components/lost-ui/` in the user's project.

### Troubleshooting

#### Registry Generation Issues

If registry generation fails:

1. Check that all components exist in `components/lost-ui/`
2. Verify metadata entries in `content/blocks-metadata.ts`
3. Ensure category IDs exist in `content/declarations.ts`

#### Component Installation Issues

If users can't install components:

1. Verify the registry URL is accessible
2. Check that individual JSON files exist in `public/r/`
3. Validate JSON format using online validators

### Code Formatting

This project uses [Prettier](https://prettier.io/) with the [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) plugin to automatically format code and sort Tailwind CSS classes.

#### Configuration

The Prettier configuration is in `prettier.config.js`:

```javascript
/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 80,
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindFunctions: ["clsx", "cn", "cva"],
  tailwindAttributes: ["className", "class"],
};
```

#### Usage

```bash
# Format all files
bun run format

# Check if files need formatting
bun run format:check

# Format specific files
npx prettier --write path/to/file.tsx
```

#### Features

- **Automatic Tailwind CSS class sorting**: Classes are sorted according to Tailwind's recommended order
- **Support for utility functions**: Works with `clsx`, `cn`, `cva` functions
- **Custom attributes**: Sorts classes in `className` and `class` attributes
- **Consistent formatting**: Ensures consistent code style across the project

#### Before and After

```tsx
// Before formatting
<div className="w-full h-16 px-4 sm:px-8 md:px-10 lg:px-12 py-2.5 bg-secondary/30 border-b border-border/30 flex items-center justify-between">

// After formatting
<div className="bg-secondary/30 border-border/30 flex h-16 w-full items-center justify-between border-b px-4 py-2.5 sm:px-8 md:px-10 lg:px-12">
```

## Contributing

We welcome contributions! Please read our [contributing guide](./CONTRIBUTING.md) to get started.

## License

Licensed under the [MIT license](https://github.com/gochitashvili/lost-ui/blob/main/LICENSE.md).
