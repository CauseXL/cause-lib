import { resolve as resolvePackage } from 'mlly';

export interface GetExportOptions {
  url: string;
}

export const getExports = async  (name: string, options?: GetExportOptions) => {
  const path = await resolvePackage(name, { url: options?.url })
  const pkg = await import (path);
  const keys = Object.keys(pkg);
  if (keys.length === 1 && keys[0] === "default") {
    return Object.keys(pkg.default)
  } else {
    return keys;
  }
}
