import fs from 'fs';
import { resolve } from 'path';

export const exclude = <T>(arr: T[], v: T) => {
  return arr.filter(x => x !== v);
}

export const getPackageJson = (cwd = process.cwd()) => {
  const path = resolve(cwd, 'package.json');
  if (fs.existsSync(path)) {
    try {
      const raw = fs.readFileSync(path, 'utf8');
      const data = JSON.parse(raw);
      return data;
    } catch(e) {
      console.warn('Failed to parse package.json', e);
      process.exit(1);
    }
  }
}
