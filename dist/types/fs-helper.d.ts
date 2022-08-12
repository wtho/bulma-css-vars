export declare function writeFile(filePath: string, content: string): Promise<void>;
export declare function exists(filePath: string): Promise<boolean>;
export declare function fileStartsWith(filePath: string, start: string): Promise<boolean>;
export declare function getAbsoluteFileName(fileName: string, cwd: string): string;
