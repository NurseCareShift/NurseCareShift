declare module 'mime' {
    export function getType(path: string): string | null;
    export function getExtension(mime: string): string | null;
  }