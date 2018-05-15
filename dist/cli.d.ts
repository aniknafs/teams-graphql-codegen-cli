import { FileOutput } from 'graphql-codegen-compiler';
export interface CLIOptions {
  file?: string;
  url?: string;
  export?: string;
  args?: string[];
  template?: string;
  project?: string;
  out?: string;
  header?: string[];
  schema?: any;
  documents?: any;
  config?: string;
  require?: string[];
}
export declare const initCLI: (args: any) => any;
export declare const cliError: (err: string) => void;
export declare const validateCliOptions: (options: CLIOptions) => void;
export declare const executeWithOptions: (options: CLIOptions) => Promise<FileOutput[]>;
