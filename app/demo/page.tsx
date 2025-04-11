import { CodeBlockEditor } from "@/components/code-block-editor";

export default function Home() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="mb-8 text-3xl font-bold">Code Block Editor</h1>
      <CodeBlockEditor />
    </main>
  );
}
