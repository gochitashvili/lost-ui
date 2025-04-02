interface Window {
  stonks?: {
    event: (name: string, props?: { [key: string]: string }) => void;
  };
}
