// Type declarations for packages without proper types
declare module "@monaco-editor/react" {
  import * as React from "react";
  interface MonacoEditorProps {
    height?: string | number;
    language?: string;
    theme?: string;
    value?: string;
    onChange?: (value: string | undefined) => void;
    options?: Record<string, unknown>;
    onMount?: (editor: unknown, monaco: unknown) => void;
  }
  const MonacoEditor: React.FC<MonacoEditorProps>;
  export default MonacoEditor;
}
declare module "clsx";
