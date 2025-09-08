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

## Contributing

We welcome contributions! Please read our [contributing guide](./CONTRIBUTING.md) to get started.

## License

Licensed under the [MIT license](https://github.com/gochitashvili/lost-ui/blob/main/LICENSE.md).
